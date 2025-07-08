import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController, LoadingController, ActionSheetController, ModalController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { FilterModalComponent } from './filter-modal/filter-modal.component';

interface PastPaperFile {
  id?: string;
  name: string;
  displayName?: string;
  description?: string;
  category?: string;
  subject?: string;
  grade?: string;
  examPeriod?: string;
  year?: string;
  size?: number;
  downloadURL: string;
  uploadedAt?: Date;
}

@Component({
  selector: 'app-past-papers',
  templateUrl: './past-papers.page.html',
  styleUrls: ['./past-papers.page.scss'],
})
export class PastPapersPage implements OnInit {
  files: PastPaperFile[] = [];
  filteredFiles: PastPaperFile[] = [];
  loading = false;
  searchTerm = '';
  selectedCategory = 'all';
  selectedGrade = 'all';
  selectedExamPeriod = 'all';
  selectedYear = 'all';
  downloadingFiles = new Set<string>();
  canUpload = false; // Set to true for admin users
  databaseConnected = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private authService: AuthService,
    private storage: AngularFireStorage,
    private database: AngularFireDatabase
  ) { }

  ngOnInit() {
    console.log('🚀 Past Papers page initializing...');
    // Set loading state immediately
    this.loading = true;
    // Basic setup and start loading data
    this.initializePage();
  }

  async ionViewWillEnter() {
    console.log('📱 Past Papers view entering...');
    if (!this.files.length) {
      // If no files loaded yet, ensure loading state is true
      this.loading = true;
      await this.initializePage();
    }
  }

  async initializePage() {
    try {
      await this.loadFiles();
      this.checkUploadPermissions();
      console.log('✅ Page initialization completed');
    } catch (error) {
      console.error('❌ Page initialization failed:', error);
      this.loading = false;
      this.showToast('Failed to load past papers. Please try again.', 'danger');
    }
  }

  async loadFiles() {
    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (this.loading) {
        console.log('Loading timeout reached - forcing stop');
        this.loading = false;
        this.showToast('Loading timeout - check your internet connection', 'warning');
        this.files = [];
        this.filteredFiles = [];
      }
    }, 15000); // 15 second timeout
    
    try {
      console.log('=== STARTING TO LOAD PAST PAPERS ===');
      console.log('Database service:', this.database);
      
      // Quick database connection test first
      console.log('Testing basic database connection...');
      const isConnected = await this.testBasicConnection();
      
      if (!isConnected) {
        console.log('Database connection failed - checking authentication and permissions');
        this.showToast('Database connection failed. Check authentication and permissions.', 'danger');
        this.loading = false; // Make sure to stop loading
        return;
      }
      
      console.log('Database connection successful, trying to load data...');
      
            // Use raw Firebase database for more reliable access
      console.log('Attempting to load from uploads path using raw Firebase...');
      const database = this.database.database;
      const uploadsRef = database.ref('uploads');
      
      let foundData = false;
      
      try {
        // Use Firebase's native once() method for reliable data fetching
        const snapshot = await Promise.race([
          uploadsRef.once('value'),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Database timeout')), 8000))
        ]) as any;
        
        console.log('Snapshot exists:', snapshot.exists());
        
        if (snapshot.exists()) {
          const uploadsData = snapshot.val();
          console.log('Raw uploads data:', uploadsData);
          console.log('Data type:', typeof uploadsData);
          
          if (uploadsData && typeof uploadsData === 'object') {
            const keys = Object.keys(uploadsData);
            console.log(`Found ${keys.length} items in uploads`);
            
            const processedFiles = [];
            
            for (const key of keys) {
              const data = uploadsData[key];
              
              if (data && typeof data === 'object') {
                const fileData: PastPaperFile = {
                  id: key,
                  name: data.name || 'Unknown File',
                  displayName: this.formatDisplayName(data.name || 'Unknown File'),
                  description: this.getDescriptionFromSubject(data.subject),
                  category: this.mapSubjectToCategory(data.subject),
                  subject: data.subject || 'Unknown',
                  grade: data.grade?.toString() || 'Unknown',
                  examPeriod: data.examPeriod || 'Unknown',
                  year: this.extractYearFromData(data),
                  downloadURL: data.url || '#',
                  uploadedAt: new Date()
                };
                
                processedFiles.push(fileData);
                console.log(`✅ Processed file ${key}:`, fileData);
              } else {
                console.log(`❌ Invalid data structure for key ${key}:`, data);
              }
            }
            
            this.files = processedFiles;
            foundData = true;
            
            console.log(`🎉 Successfully processed ${processedFiles.length} files from Firebase`);
          } else {
            console.log('❌ Uploads data is not an object:', uploadsData);
          }
        } else {
          console.log('❌ No data exists at uploads path');
        }
        
      } catch (dbError) {
        console.error('❌ Raw database access error:', dbError);
        
        // Fallback to Angular Fire methods
        console.log('🔄 Falling back to AngularFire methods...');
        
        try {
          const uploadsRef = this.database.list('uploads');
          const uploadsSnapshot = await Promise.race([
            uploadsRef.snapshotChanges().toPromise(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('AngularFire timeout')), 5000))
          ]);
          
          if (uploadsSnapshot && Array.isArray(uploadsSnapshot) && uploadsSnapshot.length > 0) {
            console.log(`Found ${uploadsSnapshot.length} items via AngularFire`);
            
            const processedFiles = uploadsSnapshot.map((item, index) => {
              const key = item.key;
              const data = item.payload.val() as any;
              
              if (data && typeof data === 'object') {
                return {
                  id: key || `fallback_${index}`,
                  name: data.name || 'Unknown File',
                  displayName: this.formatDisplayName(data.name || 'Unknown File'),
                  description: this.getDescriptionFromSubject(data.subject),
                  category: this.mapSubjectToCategory(data.subject),
                  subject: data.subject || 'Unknown',
                  grade: data.grade?.toString() || 'Unknown',
                  examPeriod: data.examPeriod || 'Unknown',
                  year: this.extractYearFromData(data),
                  downloadURL: data.url || '#',
                  uploadedAt: new Date()
                };
              }
              return null;
            }).filter(file => file !== null);
            
            this.files = processedFiles;
            foundData = true;
            
            console.log(`🎉 Fallback successful: processed ${processedFiles.length} files`);
          }
        } catch (fallbackError) {
          console.error('❌ AngularFire fallback also failed:', fallbackError);
        }
      }
      
      // Check if we found any data
      if (!foundData) {
        console.log('No data found in Firebase Realtime Database');
        this.showToast('No past papers found in database. Check if data exists in Firebase.', 'warning');
        this.files = [];
        this.filteredFiles = [];
      } else {
        // Sort and filter the loaded files
        this.files.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        this.filterFiles();
        
        console.log('Successfully loaded', this.files.length, 'past papers from Firebase');
        // this.showToast(`Loaded ${this.files.length} past papers from database`, 'success');
      }
      
    } catch (error) {
      console.error('=== CRITICAL ERROR IN LOADFILES ===');
      console.error('Error:', error);
      
      this.showToast('Critical error loading files from Firebase: ' + error.message, 'danger');
      this.files = [];
      this.filteredFiles = [];
      
    } finally {
      // Clear the timeout and stop loading
      clearTimeout(loadingTimeout);
      this.loading = false;
      console.log('Loading process completed');
    }
  }

  async testBasicConnection(): Promise<boolean> {
    try {
      console.log('Testing basic database connection...');
      
      // Use the raw database instance for more reliable connection testing
      const database = this.database.database;
      const rootRef = database.ref('/');
      
      const snapshot = await Promise.race([
        rootRef.once('value'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 5000))
      ]) as any;
      
      const connected = snapshot.exists();
      console.log('Connection test result:', connected);
      return connected;
      
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  filterFiles() {
    console.log('=== STARTING FILTER PROCESS ===');
    console.log('Current filters:', {
      searchTerm: this.searchTerm,
      category: this.selectedCategory,
      grade: this.selectedGrade,
      examPeriod: this.selectedExamPeriod,
      year: this.selectedYear
    });
    console.log('Total files before filtering:', this.files.length);

    this.filteredFiles = this.files.filter(file => {
      console.log('\nChecking file:', file.name);
      
      // Search term filter
      const searchMatch = !this.searchTerm || 
        file.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        file.subject?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        file.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
      console.log('Search match:', searchMatch);

      // Category filter
      const categoryMatch = this.selectedCategory === 'all' || 
        (file.category?.toLowerCase() === this.selectedCategory.toLowerCase()) ||
        (file.subject?.toLowerCase() === this.selectedCategory.toLowerCase());
      console.log('Category match:', categoryMatch, {
        fileCategory: file.category,
        fileSubject: file.subject,
        selectedCategory: this.selectedCategory
      });

      // Grade filter
      const gradeMatch = this.selectedGrade === 'all' || 
        file.grade === this.selectedGrade;
      console.log('Grade match:', gradeMatch, {
        fileGrade: file.grade,
        selectedGrade: this.selectedGrade
      });

      // Exam Period filter
      const examPeriodMatch = this.selectedExamPeriod === 'all' || 
        file.examPeriod?.toLowerCase() === this.selectedExamPeriod.toLowerCase();
      console.log('Exam period match:', examPeriodMatch, {
        fileExamPeriod: file.examPeriod,
        selectedExamPeriod: this.selectedExamPeriod
      });

      // Year filter
      const yearMatch = this.selectedYear === 'all' || 
        file.year === this.selectedYear;
      console.log('Year match:', yearMatch, {
        fileYear: file.year,
        selectedYear: this.selectedYear
      });

      const finalMatch = searchMatch && categoryMatch && gradeMatch && examPeriodMatch && yearMatch;
      console.log('Final match:', finalMatch);
      
      return finalMatch;
    });

    console.log(`\n=== FILTER RESULTS ===`);
    console.log(`Found ${this.filteredFiles.length} matching files out of ${this.files.length} total`);
    if (this.filteredFiles.length === 0) {
      console.log('No matches found with current filters');
    }
  }

  async downloadFile(file: PastPaperFile) {
    this.downloadingFiles.add(file.name);
    
    try {
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = file.downloadURL;
      link.download = file.displayName || file.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.showToast(`Downloading ${file.displayName || file.name}`, 'success');
    } catch (error) {
      console.error('Error downloading file:', error);
      this.showToast('Error downloading file', 'danger');
    } finally {
      this.downloadingFiles.delete(file.name);
    }
  }

  async shareFile(file: PastPaperFile) {
    try {
      if (navigator.share) {
        await navigator.share({
          title: file.displayName || file.name,
          text: `Check out this past paper: ${file.displayName || file.name}`,
          url: file.downloadURL
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(file.downloadURL);
        this.showToast('Download link copied to clipboard!', 'success');
      }
    } catch (error) {
      console.log('Error sharing file:', error);
      this.showToast('Error sharing file', 'danger');
    }
  }

  async viewFileDetails(file: PastPaperFile) {
    const alert = await this.alertController.create({
      header: file.displayName || file.name,
      message: `
        <strong>Subject:</strong> ${file.subject || file.category || 'General'}<br>
        <strong>Grade:</strong> ${this.getGradeDisplayName(file.grade)}<br>
        <strong>Exam Period:</strong> ${file.examPeriod || 'N/A'}<br>
        <strong>Year:</strong> ${file.year || 'N/A'}<br>
        <strong>File Size:</strong> ${this.getFileSize(file.size)}<br>
        <strong>Description:</strong> ${file.description || 'Examination paper'}
      `,
      buttons: [
        {
          text: 'Download',
          handler: () => {
            this.downloadFile(file);
          }
        },
        {
          text: 'Close',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  async uploadFile() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Upload Past Paper',
      buttons: [
        {
          text: 'Choose File',
          icon: 'document',
          handler: () => {
            this.selectFileToUpload();
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  selectFileToUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt';
    
    input.onchange = async (event: any) => {
      const file = event.target.files[0];
      if (file) {
        await this.uploadFileToStorage(file);
      }
    };
    
    input.click();
  }

  async uploadFileToStorage(file: File) {
    const loading = await this.loadingController.create({
      message: 'Uploading file...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `past_papers/${fileName}`;
      const uploadTask = this.storage.upload(filePath, file);
      
      await uploadTask;
      await loading.dismiss();
      
      this.showToast('File uploaded successfully!', 'success');
      this.loadFiles(); // Refresh the list
    } catch (error) {
      await loading.dismiss();
      console.error('Error uploading file:', error);
      this.showToast('Error uploading file', 'danger');
    }
  }

  async refreshFiles(event?: any) {
    console.log('🔄 Manually refreshing files...');
    
    try {
      // Reset state
      this.files = [];
      this.filteredFiles = [];
      this.loading = true;
      
      // Test connection first
      console.log('Testing connection before refresh...');
      const isConnected = await this.testBasicConnection();
      
      if (isConnected) {
        console.log('✅ Connection good, loading files...');
        await this.loadFiles();
      } else {
        console.log('❌ Connection failed');
        this.showToast('Connection failed - check Firebase configuration', 'danger');
      }
      
    } catch (error) {
      console.error('❌ Refresh failed:', error);
      this.showToast('Refresh failed: ' + error.message, 'danger');
    } finally {
      this.loading = false;
      if (event) event.target.complete();
    }
  }

  clearAllFilters() {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.selectedGrade = 'all';
    this.selectedExamPeriod = 'all';
    this.selectedYear = 'all';
    this.filterFiles();
    this.showToast('All filters cleared', 'success');
  }

  checkUploadPermissions() {
    // Check if user has upload permissions (implement your logic here)
    // For now, set to false. You can implement admin role checking
    this.canUpload = false;
  }

  async checkDatabaseConnection() {
    try {
      console.log('=== CHECKING FIREBASE CONFIGURATION ===');
      
      // Check Firebase configuration
      const database = this.database.database;
      console.log('Firebase database instance:', database);
      console.log('Firebase database URL:', database.ref().toString());
      
      // Check if the database reference is valid
      const rootRef = database.ref('/');
      console.log('Root reference:', rootRef.toString());
      
      // Try to access the database to verify connection
      console.log('Testing database connection...');
      const testRef = this.database.object('/');
      const testData = await Promise.race([
        testRef.valueChanges().toPromise(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 5000))
      ]);
      
      console.log('Test data result:', testData);
      this.databaseConnected = testData !== null;
      
      if (this.databaseConnected) {
        console.log('✅ Firebase Realtime Database connection successful');
        
        // Now specifically test the uploads path
        console.log('Testing uploads path...');
        const uploadsRef = database.ref('uploads');
        console.log('Uploads reference:', uploadsRef.toString());
        
        const uploadsSnapshot = await uploadsRef.once('value');
        console.log('Uploads snapshot exists:', uploadsSnapshot.exists());
        
        if (uploadsSnapshot.exists()) {
          const uploadsData = uploadsSnapshot.val();
          // console.log('Uploads data:', uploadsData);
          // console.log('Uploads data type:', typeof uploadsData);
          // console.log('Uploads data keys:', Object.keys(uploadsData || {}));
        } else {
          // this.showToast('Connected to Firebase but no data found in uploads path', 'warning');
        }
      } else {
        // console.log('❌ Database connection failed');
        // this.showToast('Database connection failed', 'danger');
      }
      
    } catch (error) {
      // console.error('❌ Firebase connection error:', error);
      // console.error('Error details:', error.message);
      this.databaseConnected = false;
      // this.showToast('Database connection failed: ' + error.message, 'danger');
    }
  }

  showConsoleMessage() {
 
    
    // this.showToast('Debug info logged to console - open developer tools (F12)', 'primary');
  }

  stopLoading() {
    // console.log('=== MANUALLY STOPPING LOADING ===');
    this.loading = false;
    // this.showToast('Loading stopped manually. Try refreshing or check Firebase connection.', 'warning');
    
    // Clear arrays if no files are loaded
    if (this.files.length === 0) {
      this.files = [];
      this.filteredFiles = [];
    }
  }

  // Test method to manually trigger loading
  testLoader() {
    // console.log('🧪 Testing loader - setting loading to true');
    this.loading = true;
    
    // Show loader for 3 seconds
    setTimeout(() => {
      // console.log('🧪 Test complete - setting loading to false');
      this.loading = false;
      // this.showToast('Loader test completed', 'success');
    }, 3000);
  }

  // Helper methods for database structure
  getDescriptionFromSubject(subject: string): string {
    if (!subject) return 'Examination paper';
    
    const subjectLower = subject.toLowerCase();
    switch (subjectLower) {
      case 'mathematics':
      case 'math':
      case 'maths':
        return 'Mathematics examination paper';
      case 'physics':
      case 'phys':
        return 'Physics examination paper';
      case 'chemistry':
      case 'chem':
        return 'Chemistry examination paper';
      case 'biology':
      case 'bio':
      case 'life science':
        return 'Biology examination paper';
      case 'science':
      case 'sci':
        return 'Science examination paper';
      case 'english':
      case 'eng':
      case 'language':
        return 'English examination paper';
      case 'history':
      case 'hist':
        return 'History examination paper';
      case 'geography':
      case 'geo':
        return 'Geography examination paper';
      default:
        return `${subject} examination paper`;
    }
  }

  mapSubjectToCategory(subject: string): string {
    if (!subject) return 'other';
    
    const subjectLower = subject.toLowerCase();
    switch (subjectLower) {
      case 'mathematics':
      case 'math':
      case 'maths':
        return 'mathematics';
      case 'physics':
      case 'phys':
        return 'physics';
      case 'chemistry':
      case 'chem':
        return 'chemistry';
      case 'biology':
      case 'bio':
      case 'life science':
        return 'biology';
      case 'science':
      case 'sci':
        return 'science';
      case 'english':
      case 'eng':
      case 'language':
        return 'english';
      case 'history':
      case 'hist':
        return 'history';
      case 'geography':
      case 'geo':
        return 'geography';
      default:
        return 'other';
    }
  }

  extractYearFromData(data: any): string {
    // Try to extract year from exam period or filename
    if (data.examPeriod) {
      const yearMatch = data.examPeriod.match(/20\d{2}/);
      if (yearMatch) return yearMatch[0];
    }
    
    if (data.name) {
      const yearMatch = data.name.match(/20\d{2}/);
      if (yearMatch) return yearMatch[0];
    }
    
    return new Date().getFullYear().toString();
  }

  // Helper methods
  formatDisplayName(fileName: string): string {
    // Remove timestamp prefix and file extension for display
    let displayName = fileName
      .replace(/^\d+_/, '') // Remove timestamp prefix
      .replace(/\.[^/.]+$/, '') // Remove file extension
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/-/g, ' ') // Replace hyphens with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim(); // Remove leading/trailing spaces
    
    // Capitalize first letter of each word
    displayName = displayName.replace(/\b\w/g, l => l.toUpperCase());
    
    return displayName || fileName;
  }

  getFileDescription(fileName: string): string {
    const name = fileName.toLowerCase();
    
    // Mathematics
    if (name.includes('math') || name.includes('maths') || name.includes('mathematics')) {
      return 'Mathematics examination paper';
    }
    
    // Physics
    if (name.includes('physics') || name.includes('phys')) {
      return 'Physics examination paper';
    }
    
    // Chemistry
    if (name.includes('chemistry') || name.includes('chem')) {
      return 'Chemistry examination paper';
    }
    
    // Biology
    if (name.includes('biology') || name.includes('bio') || name.includes('life science')) {
      return 'Biology examination paper';
    }
    
    // Science (general)
    if (name.includes('science') || name.includes('sci')) {
      return 'Science examination paper';
    }
    
    // English
    if (name.includes('english') || name.includes('eng') || name.includes('language')) {
      return 'English examination paper';
    }
    
    // History
    if (name.includes('history') || name.includes('hist')) {
      return 'History examination paper';
    }
    
    // Geography
    if (name.includes('geography') || name.includes('geo')) {
      return 'Geography examination paper';
    }
    
    return 'Examination paper';
  }

  getFileCategory(fileName: string): string {
    const name = fileName.toLowerCase();
    
    // Mathematics variations
    if (name.includes('math') || name.includes('maths') || name.includes('mathematics')) {
      return 'mathematics';
    }
    
    // Physics variations
    if (name.includes('physics') || name.includes('phys')) {
      return 'physics';
    }
    
    // Chemistry variations
    if (name.includes('chemistry') || name.includes('chem')) {
      return 'chemistry';
    }
    
    // Biology variations
    if (name.includes('biology') || name.includes('bio') || name.includes('life science')) {
      return 'biology';
    }
    
    // Science variations (general)
    if (name.includes('science') || name.includes('sci')) {
      return 'science';
    }
    
    // English variations
    if (name.includes('english') || name.includes('eng') || name.includes('language')) {
      return 'english';
    }
    
    // History variations
    if (name.includes('history') || name.includes('hist')) {
      return 'history';
    }
    
    // Geography variations
    if (name.includes('geography') || name.includes('geo')) {
      return 'geography';
    }
    
    return 'other';
  }

  extractYear(fileName: string): string {
    // Look for 4-digit year patterns (2000-2099)
    const yearMatch = fileName.match(/20\d{2}/);
    if (yearMatch) {
      return yearMatch[0];
    }
    
    // Look for 2-digit year patterns (assume 2000s)
    const shortYearMatch = fileName.match(/\b(\d{2})\b/);
    if (shortYearMatch) {
      const year = parseInt(shortYearMatch[1]);
      if (year >= 0 && year <= 30) { // Assume 2000-2030
        return `20${shortYearMatch[1]}`;
      }
    }
    
    return new Date().getFullYear().toString();
  }

  extractGrade(fileName: string): string {
    const name = fileName.toLowerCase();
    
    // Grade 8 patterns
    if (name.includes('grade 8') || name.includes('gr8') || name.includes('g8') || 
        name.includes('grade8') || name.match(/\b8\b/)) {
      return '8';
    }
    
    // Grade 9 patterns
    if (name.includes('grade 9') || name.includes('gr9') || name.includes('g9') || 
        name.includes('grade9') || name.match(/\b9\b/)) {
      return '9';
    }
    
    // Grade 10 patterns
    if (name.includes('grade 10') || name.includes('gr10') || name.includes('g10') || 
        name.includes('grade10') || name.match(/\b10\b/)) {
      return '10';
    }
    
    // Grade 11 patterns
    if (name.includes('grade 11') || name.includes('gr11') || name.includes('g11') || 
        name.includes('grade11') || name.match(/\b11\b/)) {
      return '11';
    }
    
    // Grade 12 patterns
    if (name.includes('grade 12') || name.includes('gr12') || name.includes('g12') || 
        name.includes('grade12') || name.match(/\b12\b/)) {
      return '12';
    }
    
    // Matric patterns
    if (name.includes('matric') || name.includes('matriculation')) {
      return 'matric';
    }
    
    // NSC patterns
    if (name.includes('nsc') || name.includes('national senior certificate')) {
      return 'nsc';
    }
    
    // University patterns
    if (name.includes('university') || name.includes('uni') || name.includes('college') || 
        name.includes('tertiary')) {
      return 'university';
    }
    
    return 'all';
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'document-text';
      case 'doc':
      case 'docx': return 'document';
      case 'txt': return 'document-outline';
      default: return 'document';
    }
  }

  getFileColor(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'danger';
      case 'doc':
      case 'docx': return 'primary';
      case 'txt': return 'medium';
      default: return 'medium';
    }
  }

  getCategoryColor(category: string): string {
    switch (category?.toLowerCase()) {
      case 'mathematics': return 'primary';
      case 'physics': return 'tertiary';
      case 'chemistry': return 'success';
      case 'biology': return 'warning';
      case 'science': return 'success';
      case 'english': return 'secondary';
      case 'history': return 'danger';
      case 'geography': return 'dark';
      default: return 'medium';
    }
  }

  getFileSize(bytes?: number): string {
    if (!bytes) return 'Unknown size';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  getGradeDisplayName(grade?: string): string {
    if (!grade || grade === 'all') return 'N/A';
    
    switch (grade.toLowerCase()) {
      case '8': return 'Grade 8';
      case '9': return 'Grade 9';
      case '10': return 'Grade 10';
      case '11': return 'Grade 11';
      case '12': return 'Grade 12';
      case 'matric': return 'Matric';
      case 'nsc': return 'NSC';
      case 'university': return 'University';
      default: return grade;
    }
  }

  private async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  // Enhanced database debugging
  async debugDatabaseStructure() {
    // console.log('=== DEBUGGING DATABASE STRUCTURE ===');
    
    try {
      // Test if user is authenticated
      const userId = await this.authService.getCurrentUserId();
      // console.log('Current user:', userId ? 'Authenticated' : 'Not authenticated');
      
      // Check database rules and permissions
      // console.log('Testing database permissions...');
      const database = this.database.database;
      // console.log('Database URL:', database.ref().toString());
      
      // Test root level access first
      // console.log('1. Testing root access...');
      const rootRef = database.ref('/');
      const rootSnapshot = await rootRef.once('value');
      
      if (rootSnapshot.exists()) {
        const rootData = rootSnapshot.val();
          // console.log('Root data exists:', rootData);
          // console.log('Root data type:', typeof rootData);
        
        if (rootData && typeof rootData === 'object') {
          const rootKeys = Object.keys(rootData);
          // console.log('Root level keys:', rootKeys);
          
          // Check if uploads key exists
          if (rootKeys.includes('uploads')) {
            // console.log('✅ uploads key found at root level');
          } else {
            // console.log('❌ uploads key NOT found at root level');
            // console.log('Available keys:', rootKeys);
          }
        }
      } else {
        // console.log('❌ Root data does not exist');
      }
      
      // Test uploads path specifically
      // console.log('2. Testing uploads path...');
      const uploadsRef = database.ref('uploads');
      const uploadsSnapshot = await uploadsRef.once('value');
      
      if (uploadsSnapshot.exists()) {
        // console.log('✅ Uploads data exists');
        const uploadsData = uploadsSnapshot.val();
        // console.log('Uploads data:', uploadsData);
        // console.log('Uploads data type:', typeof uploadsData);
        
        if (uploadsData && typeof uploadsData === 'object') {
          const uploadsKeys = Object.keys(uploadsData);
          // console.log('Found', uploadsKeys.length, 'items in uploads');
          
          if (uploadsKeys.length > 0) {
            // console.log('First item key:', uploadsKeys[0]);
            // console.log('First item data:', uploadsData[uploadsKeys[0]]);
            
            // Validate structure
            const firstItem = uploadsData[uploadsKeys[0]];
            if (firstItem && typeof firstItem === 'object') {
              // console.log('Item structure validation:');
              // console.log('- name:', firstItem.name);
              // console.log('- subject:', firstItem.subject);
              // console.log('- grade:', firstItem.grade);
              // console.log('- examPeriod:', firstItem.examPeriod);
              // console.log('- url:', firstItem.url);
            }
          }
        }
      } else {
        //
      }
      
      // Test other possible paths
      console.log('3. Testing alternative paths...');
      const altPaths = ['files', 'documents', 'papers', 'pastPapers'];
      
      for (const path of altPaths) {
        try {
          const altRef = database.ref(path);
          const altSnapshot = await altRef.once('value');
          
          if (altSnapshot.exists()) {
            // console.log(`✅ Found data at path: ${path}`);
            const altData = altSnapshot.val();
            // console.log(`${path} data:`, altData);
          } else {
            // console.log(`❌ No data at path: ${path}`);
          }
        } catch (error) {
          // console.log(`Error testing path ${path}:`, error.message);
        }
      }
      
      this.showToast('Database structure debug completed - check console', 'primary');
      
    } catch (error) {
      console.error('Database debugging error:', error);
      this.showToast('Database debugging failed: ' + error.message, 'danger');
    }
  }

  // Manual test function for debugging
  testDatabaseAccess() {
    // console.log('=== MANUAL DATABASE TEST ===');
    
    // Test different access methods
    this.testDatabaseMethods();
  }

  async testSpecificDataPath() {
    // console.log('=== TESTING SPECIFIC DATA PATH ===');
    
    try {
      const database = this.database.database;
      
      // Test the exact path from the user's screenshot
      const uploadsRef = database.ref('uploads');
      const snapshot = await uploadsRef.once('value');
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        // console.log('Data found at uploads path:', data);
        
        // Look for the specific key from the screenshot
        const keys = Object.keys(data);
        // console.log('Keys found:', keys);
        
        // Check if any key matches the pattern from screenshot
        const sampleKey = keys.find(key => key.startsWith('-M'));
        if (sampleKey) {
          // console.log('Found Firebase key:', sampleKey);
          // console.log('Sample data:', data[sampleKey]);
          
          // Check the structure
          const item = data[sampleKey];
          if (item && item.name && item.subject && item.grade) {
            // console.log('✅ Data structure looks correct!');
            return true;
          } else {
            // console.log('❌ Data structure is missing required fields');
          }
        } else {
          // console.log('❌ No Firebase-generated keys found');
        }
      } else {
        // console.log('❌ No data found at uploads path');
      }
      
      return false;
      
    } catch (error) {
      // console.error('Error testing specific path:', error);
      return false;
    }
  }

  async testAndLoadData() {
    // console.log('🧪 TESTING AND LOADING DATA DIRECTLY...');
    
    this.loading = true;
    
    try {
      // Direct Firebase connection test
      const database = this.database.database;
      // console.log('Firebase URL:', database.ref().toString());
      
      // Test uploads path directly
      const uploadsRef = database.ref('uploads');
      const snapshot = await uploadsRef.once('value');
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        // console.log('✅ Raw data from Firebase:', data);
        
        if (data && typeof data === 'object') {
          const keys = Object.keys(data);
          // console.log(`Found ${keys.length} items`);
          
          // Process immediately
          this.files = [];
          
          for (const key of keys) {
            const item = data[key];
            if (item && typeof item === 'object') {
              this.files.push({
                id: key,
                name: item.name || 'Unknown File',
                displayName: this.formatDisplayName(item.name || 'Unknown File'),
                description: this.getDescriptionFromSubject(item.subject),
                category: this.mapSubjectToCategory(item.subject),
                subject: item.subject || 'Unknown',
                grade: item.grade?.toString() || 'Unknown',
                examPeriod: item.examPeriod || 'Unknown',
                year: this.extractYearFromData(item),
                downloadURL: item.url || '#',
                uploadedAt: new Date()
              });
            }
          }
          
          this.filterFiles();
          // console.log(`✅ Successfully processed ${this.files.length} files`);
          this.showToast(`Successfully loaded ${this.files.length} files from Firebase!`, 'success');
        }
      } else {
        // console.log('❌ No data at uploads path');
        this.showToast('No data found at uploads path in Firebase', 'warning');
      }
      
    } catch (error) {
      // console.error('❌ Test and load failed:', error);
      this.showToast('Failed to load data: ' + error.message, 'danger');
    } finally {
      this.loading = false;
    }
  }

  async testDatabaseMethods() {
    // console.log('=== COMPREHENSIVE DATABASE TESTING ===');
    
    try {
      // Method 1: Direct object access
        //
      const objRef = this.database.object('uploads');
      const objData = await Promise.race([
        objRef.valueChanges().toPromise(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
      ]);
      // console.log('Object data:', objData);
      
      if (objData && typeof objData === 'object') {
        const keys = Object.keys(objData);
        // console.log('Found object keys:', keys);
        if (keys.length > 0) {
          // console.log('Sample data structure:', objData[keys[0]]);
        }
      }
      
      // Method 2: List access with keys
      // console.log('Method 2: Testing list access with keys...');
      const listRef = this.database.list('uploads');
      const listData = await Promise.race([
        listRef.snapshotChanges().toPromise(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
      ]);
      // console.log('List data with keys:', listData);
      
      if (listData && Array.isArray(listData) && listData.length > 0) {
        // console.log('Sample list item:', listData[0]);
      }
      
      // Method 3: List access without keys
      // console.log('Method 3: Testing list access without keys...');
      const listValues = await Promise.race([
        listRef.valueChanges().toPromise(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
      ]);
      // console.log('List values:', listValues);
      
      // Method 4: Raw database access
      // console.log('Method 4: Testing raw database access...');
      const database = this.database.database;
      const ref = database.ref('uploads');
      const snapshot = await Promise.race([
        ref.once('value'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
      ]) as any;
      // console.log('Raw snapshot exists:', snapshot.exists());
      // console.log('Raw snapshot value:', snapshot.val());
      
      // Method 5: Test root access
      // console.log('Method 5: Testing root database access...');
      const rootRef = database.ref('/');
      const rootSnapshot = await Promise.race([
        rootRef.once('value'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
      ]) as any;
      console.log('Root snapshot exists:', rootSnapshot.exists());
      if (rootSnapshot.exists()) {
        const rootData = rootSnapshot.val();
        console.log('Root keys:', Object.keys(rootData || {}));
      }
      
      this.showToast('Database test completed - check console for details', 'success');
      
    } catch (error) {
      console.error('Database test error:', error);
      this.showToast('Database test failed: ' + error.message, 'danger');
    }
  }

  async openFilterModal() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      componentProps: {
        filters: {
          category: this.selectedCategory,
          grade: this.selectedGrade,
          examPeriod: this.selectedExamPeriod,
          year: this.selectedYear
        }
      },
      cssClass: 'filter-modal'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.selectedCategory = data.category;
      this.selectedGrade = data.grade;
      this.selectedExamPeriod = data.examPeriod;
      this.selectedYear = data.year;
      this.filterFiles();
    }
  }

  hasActiveFilters(): boolean {
    return this.selectedCategory !== 'all' ||
           this.selectedGrade !== 'all' ||
           this.selectedExamPeriod !== 'all' ||
           this.selectedYear !== 'all';
  }
} 