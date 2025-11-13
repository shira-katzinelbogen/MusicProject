import { Component, OnInit, inject, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { UploadSheetMusicService } from '../../../Services/uploadsheetmusic.service';
import { SheetMusicService } from '../../../Services/sheetmusic.service';
import { InstrumentsService } from '../../../Services/instrument.service';
// ודא שאתה מייבא רק את המודל/שירות שיש לך
import Users from '../../../Models/Users'; // נניח שזה מודל המשתמש הקיים שלך
import { UsersService } from '../../../Services/users.service'; // נניח שיש שירות משתמשים כללי
import { DifficultyLevel } from '../../../Models/SheetMusic'; // Enum או מחרוזות לרמות קושי


// *** נתונים סטטיים זמניים במקום שירות קטגוריות ***
// עד שתגדיר את SheetMusicCategoryService ואת מודל Category
interface TempCategory {
    id: number; // 👈 עדיף שיהיה number
    name: string;
}

const STATIC_CATEGORIES: TempCategory[] = [
    { id: 1, name: 'Classical' }, // 👈 החלף ל-ID מספרי אמיתי מה-DB
    { id: 2, name: 'Jazz' },
    { id: 3, name: 'Pop' },
    { id: 4, name: 'Rock' },
];

const STATIC_INSTRUMENTS: TempCategory[] = [ // נניח שגם הכלים סטטיים כרגע
    { id: 1, name: 'Piano' },
    { id: 2, name: 'Guitar' },
    { id: 3 , name: 'Bass' },
    { id: 4 , name: 'Drums' },
    { id: 5 , name: 'Flute' },
    { id: 6 , name: 'Violin' },
];
// **********************************************


@Component({
  selector: 'app-upload-sheet-music',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './upload-sheet-music.component.html',
  styleUrl: './upload-sheet-music.component.css'
})
export class UploadSheetMusicComponent implements OnInit {

  // הזרקות
  private fb = inject(FormBuilder);
  private sheetMusicService = inject(SheetMusicService);
  public uploadSheetMusicService = inject(UploadSheetMusicService);
  // private instrumentService = inject(InstrumentService); // הוסר, נשתמש בנתונים סטטיים
  private usersService = inject(UsersService); // שימוש בשירות משתמשים קיים (דוגמה)

  @Output() uploadSuccess = new EventEmitter<void>();
  @ViewChild('fileInput') fileInput!: ElementRef; 

  uploadForm!: FormGroup;
  selectedFile: File | null = null;
  isLoading: boolean = false;
  uploadError: string | null = null;

  // נתונים סטטיים
  categories: TempCategory[] = STATIC_CATEGORIES;
  instrumentsList: TempCategory[] = STATIC_INSTRUMENTS; 
  difficultyLevels = Object.values(DifficultyLevel); 
  scaleOptions = ['C', 'Am', 'G', 'F', 'Other'];

  ngOnInit() {
    this.initForm();
    // אין צורך ב-loadDependencies אם הנתונים סטטיים
  }

  initForm(): void {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      key: ['', Validators.required],
      category: ['', Validators.required], // ערך קטגוריה (ID או מחרוזת)
      description: [''],
      instruments: [[]], // מערך של ערכי כלים
      level: ['', Validators.required],
    });
  }
  
  onFileSelect(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.uploadError = null;
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
      this.uploadError = null;
    }
  }

  onFileDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }
  
  onCancel(): void {
    this.uploadSheetMusicService.close();
    this.uploadForm.reset();
    this.selectedFile = null;
    this.isLoading = false;
    this.uploadError = null;
  }

  onSubmit(): void {
    this.uploadError = null;
    this.uploadForm.markAllAsTouched();

    if (!this.uploadForm.valid || !this.selectedFile) {
      this.uploadError = 'Please fill out all required fields and select a file.';
      return;
    }

    this.isLoading = true;
    const formValue = this.uploadForm.value;
    
    // *** לוגיקה זמנית לקבלת ID משתמש (יש להחליף בשיטה אמיתית) ***
    // נניח שזה מקבל את ה-ID של המשתמש המחובר מהסרביס הקיים
    const currentUserId = 1; // ⬅️ יש לשנות ל: this.usersService.getCurrentUser().id
    // אם אין לך פונקציה שמחזירה את המשתמש הנוכחי, השאר 1 לבדיקות

    // *** מיפוי מדויק ל-SheetMusicUploadDTO ***
    const uploadDto: any = {
      name: formValue.title, 
      level: formValue.level, // Enum EDifficultyLevel (מחרוזת)
      scale: formValue.key, // Enum EScale (מחרוזת)
      
      // DTO מצפה לאובייקט קטגוריה (עם ID)
      category: { 
        id: Number(formValue.category) // מכיוון שהנתונים סטטיים, זה עשוי להיות מחרוזת
      }, 
      
      // DTO מצפה לרשימת אובייקטי כלים (עם ID)
      instruments: formValue.instruments.map((instrumentValue: any) => ({ 
        id: Number(instrumentValue) // מכיוון שהנתונים סטטיים, זה עשוי להיות מחרוזת
      })),
      
      // DTO מצפה לאובייקט משתמש (עם ID)
      user: { 
        id: currentUserId 
      },
    };
    console.log("UPLOAD DTO SENT →", uploadDto);
console.log("SELECTED FILE →", this.selectedFile);

    this.sheetMusicService.uploadSheetMusic(uploadDto, this.selectedFile).subscribe({
      next: () => {
        this.uploadSuccess.emit();
        this.onCancel(); 
      },
      error: (err) => {
        console.error('Upload failed:', err);
        this.uploadError = err.error?.message || 'Upload failed. Please check your data.';
        this.isLoading = false; 
      }
    });
  }
}