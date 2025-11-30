import { Component, OnInit, inject, EventEmitter, Output, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UploadSheetMusicService } from '../../../Services/uploadsheetmusic.service';
import { SheetMusicService } from '../../../Services/sheetmusic.service';
import { InstrumentsService } from '../../../Services/instrument.service';
import { SheetMusicCategoryService } from '../../../Services/sheetmusiccategory.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SheetMusicResponseAI, InstrumentResponseDTO, SheetMusicCategoryResponseDTO } from '../../../Models/SheetMusicResponseAI';
import { DifficultyLevel } from '../../../Models/SheetMusic';
import SheetMusicCategory from '../../../Models/SheetMusicCategory';
import Instrument from '../../../Models/Instrument';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-upload-sheet-music',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './upload-sheet-music.component.html',
  styleUrl: './upload-sheet-music.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadSheetMusicComponent implements OnInit {

  private fb = inject(FormBuilder);
  private sheetMusicService = inject(SheetMusicService);
  public uploadSheetMusicService = inject(UploadSheetMusicService);
  private instrumentService = inject(InstrumentsService);
  private categoryService = inject(SheetMusicCategoryService);
  private sanitizer = inject(DomSanitizer);

  @Output() uploadSuccess = new EventEmitter<void>();
  @ViewChild('fileInput') fileInput!: ElementRef;

  uploadForm!: FormGroup;
  selectedFile: File | null = null;
  selectedImageCover: File | null = null;
  imageCoverUrl: string | ArrayBuffer | null = null;
  pdfBase64: string | ArrayBuffer | null = null;
  pdfUrl: SafeResourceUrl | null = null;
  isLoading: boolean = false;
  uploadError: string | null = null;
  aiDataAnalyzed: boolean = false;

  categories: SheetMusicCategory[] = [];
  instrumentsList: Instrument[] = [];
  difficultyLevels = Object.values(DifficultyLevel);
  scaleOptions = ['C_MAJOR', 'A_MINOR', 'G_MAJOR', 'F_MAJOR', 'E_MINOR', 'C', 'D', 'E', 'F', 'G', 'A', 'B'];

  ngOnInit() {
    this.initForm();

  }

  initForm(): void {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      scale: ['', Validators.required],
      categories: [[], Validators.required],
      instruments: [[], Validators.required],
      level: ['', Validators.required],
      composer: [''],
      lyricist: [''],
      description: [''],
      file: [null, Validators.required]
    });
    this.disableAIFields();
  }



  loadDependenciesAfterAI(): void {
  this.categoryService.getSheetMusicCategories().subscribe({
    next: data => this.categories = data,
    error: err => console.error('Failed to load categories', err)
  });

  this.instrumentService.getInstruments().subscribe({
    next: data => this.instrumentsList = data,
    error: err => console.error('Failed to load instruments', err)
  });
}


  disableAIFields(): void {
    ['title', 'scale', 'categories', 'instruments', 'level', 'composer', 'lyricist'].forEach(field => {
      this.uploadForm.get(field)?.disable();
    });
  }

  enableAIFields(): void {
    ['title', 'scale', 'categories', 'instruments', 'level', 'composer', 'lyricist'].forEach(field => {
      this.uploadForm.get(field)?.enable();
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.handleFile(event.target.files[0]);
    }
  }
 
  handleFile(file: File): void {
    if (file.type !== 'application/pdf') {
      this.uploadError = 'Only PDF files are supported.';
      return;
    }
    this.selectedFile = file;
    this.uploadError = null;
    this.aiDataAnalyzed = false;
    this.disableAIFields();

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.pdfBase64 = e.target.result;
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
    };
    reader.readAsDataURL(file);

    this.uploadForm.patchValue({ file: file });
    this.uploadForm.get('file')?.markAsTouched();
  }

 

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }


   onImageSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.selectedImageCover = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageCoverUrl = reader.result;
      reader.readAsDataURL(this.selectedImageCover!);
    } else {
      this.selectedImageCover = null;
      this.imageCoverUrl = null;
    }
  }

  analyzePDF(): void {
    if (!this.selectedFile) return;
    this.isLoading = true;
    this.uploadError = null;
    this.sheetMusicService.analyzePDF(this.selectedFile).subscribe({
      next: (aiResponse: SheetMusicResponseAI) => {
        this.isLoading = false;
        this.aiDataAnalyzed = true;
            this.loadDependenciesAfterAI();
        this.enableAIFields();
        this.applyAIResponseToForm(aiResponse);
        
      },
      error: (err) => {
        console.error('AI analysis failed:', err);
        this.uploadError = 'AI analysis failed. Please fill in the fields manually.';
        this.isLoading = false;
        this.aiDataAnalyzed = false;
        this.enableAIFields();
      }
    });
  }

  applyAIResponseToForm(aiResponse: SheetMusicResponseAI): void {
    const suggestedCategoriesIds = aiResponse.suggestedCategory?.map(cat => cat.id) || [];
    const instrumentsIds = aiResponse.instruments?.map(inst => inst.id) || [];


    this.uploadForm.patchValue({
      title: aiResponse.title,
      scale: aiResponse.scale,
      level: aiResponse.difficulty,
      composer: aiResponse.composer,
      lyricist: aiResponse.lyricist,
      categories: suggestedCategoriesIds,
      instruments: instrumentsIds
    });

    this.uploadForm.markAllAsTouched();
  }

  onCancel(): void {
    this.uploadSheetMusicService.close();
    this.uploadForm.reset();
    this.selectedFile = null;
    this.selectedImageCover = null;
    this.pdfUrl = null;
    this.imageCoverUrl = null;
    this.isLoading = false;
    this.uploadError = null;
    this.aiDataAnalyzed = false;
    this.disableAIFields();
  }

  onSubmit(): void {
  this.uploadError = null;
  this.uploadForm.markAllAsTouched();

  if (!this.uploadForm.valid || !this.selectedFile) {
    this.uploadError = 'Please fill out all required fields and select a PDF file.';
    return;
  }

  this.isLoading = true;
  const formValue = this.uploadForm.getRawValue();

  // המרה של קטגוריות וכלים ל-IDs בלבד
  const categoriesIds = formValue.categories?.map((cat: any) => Number(cat)) || [];
  const instrumentIds = formValue.instruments?.map((instr: any) => Number(instr)) || [];

  const uploadDto = {
    title: formValue.title,
    level: formValue.level,
    scale: formValue.scale,
    composer: formValue.composer,
    lyricist: formValue.lyricist,
    categories: categoriesIds.map((id: Number) => ({ id })), // רק IDs
    instruments: instrumentIds.map((id: Number) => ({ id })), // רק IDs
    // user נשאר מחוץ ל-DTO
  };
const formData = new FormData();
console.log(this.selectedFile)
if (this.selectedFile) {  // זה חייב להיות PDF
    formData.append('file', this.selectedFile);
} else {
    // אם אין PDF, עצור את השליחה
    this.uploadError = "Please select a PDF file!";
    
    return;
}
        // חובה
if (this.selectedImageCover) {
  formData.append('image', this.selectedImageCover); // אופציונלי
}
const blob = new Blob([JSON.stringify(uploadDto)], { type: 'application/json' });
formData.append('data', blob);                       // JSON עם שדות


  this.sheetMusicService.uploadSheetMusic(formData).subscribe({
    next: () => {
      this.uploadSuccess.emit();
      this.onCancel();
    },
    error: (err) => {
      console.error('Upload failed:', err);
      this.uploadError = err.error?.message || 'Upload failed.';
      this.isLoading = false;
    }
  });
}


 
}








// import { Component, OnInit, inject, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common'; 
// import { UploadSheetMusicService } from '../../../Services/uploadsheetmusic.service';
// import { SheetMusicService } from '../../../Services/sheetmusic.service';
// import { InstrumentsService } from '../../../Services/instrument.service';
// // ודא שאתה מייבא רק את המודל/שירות שיש לך
// import Users from '../../../Models/Users'; // נניח שזה מודל המשתמש הקיים שלך
// import { UsersService } from '../../../Services/users.service'; // נניח שיש שירות משתמשים כללי
// import { DifficultyLevel } from '../../../Models/SheetMusic'; // Enum או מחרוזות לרמות קושי


// // *** נתונים סטטיים זמניים במקום שירות קטגוריות ***
// // עד שתגדיר את SheetMusicCategoryService ואת מודל Category
// interface TempCategory {
//     id: number; // 👈 עדיף שיהיה number
//     name: string;
// }

// const STATIC_CATEGORIES: TempCategory[] = [
//     { id: 1, name: 'Classical' }, // 👈 החלף ל-ID מספרי אמיתי מה-DB
//     { id: 2, name: 'Jazz' },
//     { id: 3, name: 'Pop' },
//     { id: 4, name: 'Rock' },
// ];

// const STATIC_INSTRUMENTS: TempCategory[] = [ // נניח שגם הכלים סטטיים כרגע
//     { id: 1, name: 'Piano' },
//     { id: 2, name: 'Guitar' },
//     { id: 3 , name: 'Bass' },
//     { id: 4 , name: 'Drums' },
//     { id: 5 , name: 'Flute' },
//     { id: 6 , name: 'Violin' },
// ];
// // **********************************************


// @Component({
//   selector: 'app-upload-sheet-music',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule],
//   templateUrl: './upload-sheet-music.component.html',
//   styleUrl: './upload-sheet-music.component.css'
// })
// export class UploadSheetMusicComponent implements OnInit {

//   // הזרקות
//   private fb = inject(FormBuilder);
//   private sheetMusicService = inject(SheetMusicService);
//   public uploadSheetMusicService = inject(UploadSheetMusicService);
//   // private instrumentService = inject(InstrumentService); // הוסר, נשתמש בנתונים סטטיים
//   private usersService = inject(UsersService); // שימוש בשירות משתמשים קיים (דוגמה)

//   @Output() uploadSuccess = new EventEmitter<void>();
//   @ViewChild('fileInput') fileInput!: ElementRef; 

//   uploadForm!: FormGroup;
//   selectedFile: File | null = null;
//   isLoading: boolean = false;
//   uploadError: string | null = null;

//   // נתונים סטטיים
//   categories: TempCategory[] = STATIC_CATEGORIES;
//   instrumentsList: TempCategory[] = STATIC_INSTRUMENTS; 
//   difficultyLevels = Object.values(DifficultyLevel); 
//   scaleOptions = ['C', 'Am', 'G', 'F', 'Other'];

//   ngOnInit() {
//     this.initForm();
//     // אין צורך ב-loadDependencies אם הנתונים סטטיים
//   }

//   initForm(): void {
//     this.uploadForm = this.fb.group({
//       title: ['', Validators.required],
//       key: ['', Validators.required],
//       category: ['', Validators.required], // ערך קטגוריה (ID או מחרוזת)
//       description: [''],
//       instruments: [[]], // מערך של ערכי כלים
//       level: ['', Validators.required],
//     });
//   }
  
//   onFileSelect(event: any): void {
//     if (event.target.files && event.target.files.length > 0) {
//       this.selectedFile = event.target.files[0];
//       this.uploadError = null;
//     }
//   }

//   onFileDrop(event: DragEvent): void {
//     event.preventDefault();
//     event.stopPropagation();
//     if (event.dataTransfer && event.dataTransfer.files.length > 0) {
//       this.selectedFile = event.dataTransfer.files[0];
//       this.uploadError = null;
//     }
//   }

//   onFileDragOver(event: DragEvent): void {
//     event.preventDefault();
//     event.stopPropagation();
//   }
  
//   onCancel(): void {
//     this.uploadSheetMusicService.close();
//     this.uploadForm.reset();
//     this.selectedFile = null;
//     this.isLoading = false;
//     this.uploadError = null;
//   }

//   onSubmit(): void {
//     this.uploadError = null;
//     this.uploadForm.markAllAsTouched();

//     if (!this.uploadForm.valid || !this.selectedFile) {
//       this.uploadError = 'Please fill out all required fields and select a file.';
//       return;
//     }

//     this.isLoading = true;
//     const formValue = this.uploadForm.value;
    
//     // *** לוגיקה זמנית לקבלת ID משתמש (יש להחליף בשיטה אמיתית) ***
//     // נניח שזה מקבל את ה-ID של המשתמש המחובר מהסרביס הקיים
//     const currentUserId = 1; // ⬅️ יש לשנות ל: this.usersService.getCurrentUser().id
//     // אם אין לך פונקציה שמחזירה את המשתמש הנוכחי, השאר 1 לבדיקות

//     // *** מיפוי מדויק ל-SheetMusicUploadDTO ***
//     const uploadDto: any = {
//       name: formValue.title, 
//       level: formValue.level, // Enum EDifficultyLevel (מחרוזת)
//       scale: formValue.key, // Enum EScale (מחרוזת)
      
//       // DTO מצפה לאובייקט קטגוריה (עם ID)
//       category: { 
//         id: Number(formValue.category) // מכיוון שהנתונים סטטיים, זה עשוי להיות מחרוזת
//       }, 
      
//       // DTO מצפה לרשימת אובייקטי כלים (עם ID)
//       instruments: formValue.instruments.map((instrumentValue: any) => ({ 
//         id: Number(instrumentValue) // מכיוון שהנתונים סטטיים, זה עשוי להיות מחרוזת
//       })),
//       
//       // DTO מצפה לאובייקט משתמש (עם ID)
//       user: { 
//         id: currentUserId 
//       },
//     };
//     console.log("UPLOAD DTO SENT →", uploadDto);
// console.log("SELECTED FILE →", this.selectedFile);

//     this.sheetMusicService.uploadSheetMusic(uploadDto, this.selectedFile).subscribe({
//       next: () => {
//         this.uploadSuccess.emit();
//         this.onCancel(); 
//       },
//       error: (err) => {
//         console.error('Upload failed:', err);
//         this.uploadError = err.error?.message || 'Upload failed. Please check your data.';
//         this.isLoading = false; 
//       }
//     });
//   }
// }