
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { UploadSheetMusicService } from '../../../Services/uploadsheetmusic.service';
import { SheetMusicService } from '../../../Services/sheetmusic.service';

@Component({
  selector: 'app-upload-sheet-music',
  standalone:true,
  imports: [ReactiveFormsModule],
  templateUrl: './upload-sheet-music.component.html',
  styleUrl: './upload-sheet-music.component.css'
})
export class UploadSheetMusicComponent implements OnInit {
  uploadForm!: FormGroup;
  selectedFile: File | null = null; // הקובץ (PDF/תמונה) שהמשתמש בחר

  // נניח שהשירותים מוזרקים ככה:
  constructor(
    private fb: FormBuilder,
    private sheetMusicService: SheetMusicService,
    public uploadSheetMusicService:UploadSheetMusicService
    // private authService: AuthService // דוגמה לשירות שמביא ID משתמש
  ) { }

  ngOnInit() {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      key: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      instruments: [[]], // בחירה מרובה
      level: ['', Validators.required], // ⬅️ נוסף
    });
  }

  // שמירת הקובץ שנבחר
  onFileSelect(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      console.log('Selected file:', this.selectedFile!.name);
    }
  }

  // טיפול בגרירת קבצים
  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
      console.log('Dropped file:', this.selectedFile.name);
    }
  }

  onFileDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  // 📝 פונקציית השליחה המרכזית (onSubmit)
  onSubmit(): void {

    if (this.uploadForm.valid && this.selectedFile) {

      // *** 1. קבלת ID המשתמש המחובר ***
      // הערה: נניח שאתה מקבל את ה-ID דרך שירות כלשהו
      const currentUserId = 1; // ⬅️ יש להחליף בלוגיקה אמיתית

      // *** 2. בניית אובייקט ה-DTO לשליחה ***
      const data = {
        // שדות הטופס
        ...this.uploadForm.value,
        // אובייקט המשתמש כפי שנדרש ב-Java DTO
        user: { id: currentUserId }
      };

      // *** 3. שליחה באמצעות SheetMusicService ***
      this.sheetMusicService.uploadSheetMusic(data, this.selectedFile).subscribe({
        next: () => {
          console.log('Upload successful!');
          alert('התווים הועלו בהצלחה!');
          this.uploadForm.reset();
                this.selectedFile = null;
          // this.uploadSheetMusicService.close();
        },
        error: () => {
          console.error('Upload failed:');
          alert('שגיאה בהעלאת התווים.');
        }
      });
    } else {
      alert('אנא מלא את כל השדות החובה ובחר קובץ להעלאה.');
      this.uploadForm.markAllAsTouched();
    }
  }

}
