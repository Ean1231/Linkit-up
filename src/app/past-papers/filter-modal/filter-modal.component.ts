import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Filter Past Papers</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="filter-modal-content">
        <!-- Subject Categories -->
        <div class="filter-section">
          <div class="filter-header">
            <ion-icon name="book-outline" color="primary"></ion-icon>
            <h4>Subjects</h4>
          </div>
          <ion-segment [(ngModel)]="filters.category" (ionChange)="filterChanged()" scrollable="true">
            <ion-segment-button value="all">
              <ion-label>All</ion-label>
            </ion-segment-button>
            <ion-segment-button value="mathematics">
              <ion-label>Mathematics</ion-label>
            </ion-segment-button>
            <ion-segment-button value="science">
              <ion-label>Science</ion-label>
            </ion-segment-button>
            <ion-segment-button value="english">
              <ion-label>English</ion-label>
            </ion-segment-button>
            <ion-segment-button value="physics">
              <ion-label>Physics</ion-label>
            </ion-segment-button>
            <ion-segment-button value="chemistry">
              <ion-label>Chemistry</ion-label>
            </ion-segment-button>
            <ion-segment-button value="biology">
              <ion-label>Biology</ion-label>
            </ion-segment-button>
          </ion-segment>
        </div>

        <!-- Grade Levels -->
        <div class="filter-section">
          <div class="filter-header">
            <ion-icon name="school-outline" color="primary"></ion-icon>
            <h4>Grades</h4>
          </div>
          <ion-segment [(ngModel)]="filters.grade" (ionChange)="filterChanged()" scrollable="true">
            <ion-segment-button value="all">
              <ion-label>All</ion-label>
            </ion-segment-button>
            <ion-segment-button value="8">
              <ion-label>Grade 8</ion-label>
            </ion-segment-button>
            <ion-segment-button value="9">
              <ion-label>Grade 9</ion-label>
            </ion-segment-button>
            <ion-segment-button value="10">
              <ion-label>Grade 10</ion-label>
            </ion-segment-button>
            <ion-segment-button value="11">
              <ion-label>Grade 11</ion-label>
            </ion-segment-button>
            <ion-segment-button value="12">
              <ion-label>Grade 12</ion-label>
            </ion-segment-button>
          </ion-segment>
        </div>

        <!-- Exam Period -->
        <div class="filter-section">
          <div class="filter-header">
            <ion-icon name="calendar-outline" color="primary"></ion-icon>
            <h4>Exam Period</h4>
          </div>
          <ion-segment [(ngModel)]="filters.examPeriod" (ionChange)="filterChanged()" scrollable="true">
            <ion-segment-button value="all">
              <ion-label>All</ion-label>
            </ion-segment-button>
            <ion-segment-button value="jan-june">
              <ion-label>Jan/June</ion-label>
            </ion-segment-button>
            <ion-segment-button value="june-nov">
              <ion-label>June/Nov</ion-label>
            </ion-segment-button>
          </ion-segment>
        </div>

        <!-- Year Selection -->
        <div class="filter-section">
          <div class="filter-header">
            <ion-icon name="time-outline" color="primary"></ion-icon>
            <h4>Year</h4>
          </div>
          <ion-segment [(ngModel)]="filters.year" (ionChange)="filterChanged()" scrollable="true">
            <ion-segment-button value="all">
              <ion-label>All</ion-label>
            </ion-segment-button>
            <ion-segment-button value="2024">
              <ion-label>2024</ion-label>
            </ion-segment-button>
            <ion-segment-button value="2023">
              <ion-label>2023</ion-label>
            </ion-segment-button>
            <ion-segment-button value="2022">
              <ion-label>2022</ion-label>
            </ion-segment-button>
            <ion-segment-button value="2021">
              <ion-label>2021</ion-label>
            </ion-segment-button>
            <ion-segment-button value="2020">
              <ion-label>2020</ion-label>
            </ion-segment-button>
          </ion-segment>
        </div>

        <!-- Action Buttons -->
        <div class="filter-actions">
          <ion-button expand="block" (click)="applyFilters()">
            Apply Filters
          </ion-button>
          <ion-button expand="block" fill="clear" (click)="clearFilters()">
            Clear All
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .filter-modal-content {
      padding: 16px;
    }

    .filter-section {
      margin-bottom: 24px;
    }

    .filter-header {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      gap: 8px;

      ion-icon {
        font-size: 24px;
      }

      h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--ion-color-dark);
      }
    }

    ion-segment {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 4px;

      ion-segment-button {
        --background: #ffffff;
        --background-checked: var(--ion-color-primary);
        --color: var(--ion-color-medium);
        --color-checked: #ffffff;
        --indicator-color: transparent;
        min-height: 36px;
        font-size: 14px;
        text-transform: none;
        border-radius: 6px;
        margin: 2px;

        &::part(indicator) {
          display: none;
        }
      }
    }

    .filter-actions {
      margin-top: 32px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  `]
})
export class FilterModalComponent implements OnInit {
  filters = {
    category: 'all',
    grade: 'all',
    examPeriod: 'all',
    year: 'all'
  };

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  filterChanged() {
    // Optional: Add any immediate filter change handling here
  }

  applyFilters() {
    this.modalCtrl.dismiss(this.filters);
  }

  clearFilters() {
    this.filters = {
      category: 'all',
      grade: 'all',
      examPeriod: 'all',
      year: 'all'
    };
    this.filterChanged();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
} 