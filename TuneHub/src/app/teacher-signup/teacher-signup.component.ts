import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../Services/users.service'; // לשירות משתמשים/מורים
import Instrument from '../Models/Instrument'; // נניח שיש לך מודל כלי נגינה
import { InstrumentsService } from '../Services/instrument.service'; // שירות לכלי נגינה
import Teacher from '../Models/Teacher';

@Component({
  selector: 'app-teacher-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterModule],
  templateUrl: './teacher-signup.component.html',
  styleUrls: ['./teacher-signup.component.css']
})
export class TeacherSignupComponent implements OnInit {

  userId: number | null = null;
  instrumentsList: Instrument[] = []; // רשימת כל כלי הנגינה האפשריים
  
  // ✅ המודל שנשלח לשרת
 teacherData: Teacher = {
    pricePerLesson: 0,
    experience: 0,
    lessonDuration: 60,
    instrumentsIds: [] // ✅ תיקון: שימוש בשם השדה החדש
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService, // או TeacherService
    private instrumentsService: InstrumentsService 
  ) {}

  ngOnInit(): void {
    // 1. קבלת ID של המשתמש מה-URL
    this.route.paramMap.subscribe(params => {
      this.userId = Number(params.get('id'));
      if (!this.userId) {
        alert('שגיאה: חסר מזהה משתמש.');
        this.router.navigate(['/profile']); // חזרה לפרופיל אם אין ID
      }
    });

    // 2. טעינת רשימת כלי הנגינה
    this.loadInstruments();
  }

  loadInstruments(): void {
    this.instrumentsService.getInstruments().subscribe({
      next: (instrumentsIds: Instrument[]) => {
        this.instrumentsList = instrumentsIds;
      },
      error: (err: any) => {
        console.error('Error loading instruments:', err);
      }
    });
  }

  // ----------------------------------------------------------------
  // 🎯 ניהול בחירת כלי נגינה מרובים
  // ----------------------------------------------------------------
toggleInstrument(instrumentId: number): void {
    // ודא ש-instrumentId הוא מספר תקין
    if (!instrumentId) return;

    const instrumentsArray = this.teacherData.instrumentsIds || []; // ודא שיש מערך לעבוד איתו
    const index = instrumentsArray.indexOf(instrumentId);
    
    if (index > -1) {
      // אם הכלי כבר נבחר, הסר אותו
      instrumentsArray.splice(index, 1);
    } else {
      // אם הכלי לא נבחר, הוסף אותו
      instrumentsArray.push(instrumentId);
    }
    // אם instrumentsIds הוא undefined, זה יוודא שהוא מוגדר כעת
    this.teacherData.instrumentsIds = instrumentsArray; 
  }
  // ----------------------------------------------------------------
  // 🎯 שליחת הטופס לשרת
  // ----------------------------------------------------------------
  onSubmit(): void {
    if (!this.userId) return;

    // ✅ תיקון: בדיקה על השדה הנכון
    if ((this.teacherData.instrumentsIds || []).length === 0) {
      alert('יש לבחור לפחות כלי נגינה אחד שאתה מלמד.');
      return;
    }

    // ⚠️ השתמש ב-Service המתאים שייצרתם לצורך שליחה
    this.usersService.signUpAsTeacher(this.userId, this.teacherData).subscribe({
      next: (res) => {
        alert('ברכות! הצטרפת בהצלחה כ:מורה למוזיקה.');
        // ניווט חזרה לדף הפרופיל (שם יופיעו פרטי המורה החדשים)
        this.router.navigate(['/profile', this.userId]); 
      },
      error: (err) => {
        // אם השרת החזיר שגיאת 400 עקב חוסר ב city/country/description, היא תופיע כאן
        console.error('Teacher signup failed:', err);
        alert(`הרישום כמורה נכשל. בדוק את הפרטים. שגיאה: ${err.error || err.message}`);
      }
    });
  }
}