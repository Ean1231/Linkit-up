export class Aps{
    University: string;
    aps: any;
    Field: string;
    QualificationType: string;
    City: string;
    img: string;
    bursaries: string[];
    contact:any = {
        
    };
    Apply: string;
    description: string;
    

    constructor(University, aps , QualificationType, Field, City, img, contact, Apply, description, bursaries) {

    this.University = University;
    this.aps = aps;
    this.Field = Field;
    this.QualificationType = QualificationType;
    this.City = City;
    this.img = img;
    this.contact = contact;
    this.Apply = Apply;
    this.description = description;
    this.bursaries = bursaries;
}
}
