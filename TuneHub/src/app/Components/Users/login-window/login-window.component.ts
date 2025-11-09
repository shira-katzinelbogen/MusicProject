import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginwindowService } from '../../../Services/loginwindow.service';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../Services/login.service';
import { SignupService } from '../../../Services/signup.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

type AuthMode = 'login' | 'signup';

@Component({
  selector: 'app-login-window',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login-window.component.html',
  styleUrl: './login-window.component.css'
})
export class LoginWindowComponent {

  loginwindowService = inject(LoginwindowService);
  // loginService = inject(LoginService);
  // signupService = inject(SignupService);
  private router = inject(Router);

  navigateTo(path: string) {
    this.loginwindowService.close();
    this.router.navigate([path]);
  }

  currentMode: AuthMode = 'login';

  loginForm!: FormGroup;
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, http: HttpClient) { }

  ngOnInit(): void {
    // אתחול טופס כניסה
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    // אתחול טופס הרשמה
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue]
    }, { validator: this.passwordMatchValidator });
  }

  // פונקציה למעבר בין המצבים
  setMode(mode: AuthMode): void {
    this.currentMode = mode;
  }

  // פונקציה לבדיקת התאמת סיסמאות (בטופס ההרשמה)
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // לוגיקה לשליחת טופס כניסה
  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login Data:', this.loginForm.value);
      // כאן תוסיף קריאה לשירות האימות שלך
    }
  }

  // לוגיקה לשליחת טופס הרשמה
  onSignupSubmit(): void {
    if (this.signupForm.valid) {
      console.log('Signup Data:', this.signupForm.value);
      // כאן תוסיף קריאה לשירות ההרשמה שלך
    }
  }

  /**
   * סוגר את חלון המודאל באמצעות השירות.
   */
  closeWindow(): void {
    this.loginwindowService.close();
  }

  /**
   * סוגר את חלון המודאל אם הלחיצה הייתה על האוברליי (הרקע).
   * @param event אירוע הלחיצה
   */
  onOverlayClick(event: MouseEvent): void {
    // בודק שהלחיצה בוצעה ישירות על רכיב האוברליי ולא על האלמנטים הפנימיים שלו
    if (event.target === event.currentTarget) {
      this.closeWindow();
    }
  }

  selectedFile: File | null = null;
  data = { name: '' }; // נתונים נוספים לשליחה

  // constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
  }

  upload(): void {
    if (!this.selectedFile) {
      alert('נא לבחור קובץ!');
      return;
    }

    // 1. יצירת אובייקט FormData
    const formData = new FormData();

    // 2. הוספת קובץ התמונה תחת מפתח 'file' (זה חייב להתאים למה ש-Spring Boot מצפה לו)
    formData.append('file', this.selectedFile, this.selectedFile.name);

    // 3. הוספת נתונים נוספים (אפשר גם להעביר נתונים מורכבים כמחרוזת JSON)
    formData.append('name', this.data.name);
    // או עבור אובייקט:
    // formData.append('metadata', JSON.stringify(this.data));


    // 4. שליחת הבקשה
    // this.http.post('http://localhost:8080/api/upload', formData).subscribe(
    //   (response) => {
    //     console.log('העלאה הצליחה', response);
    //   },
    //   (error) => {
    //     console.error('שגיאה בהעלאה', error);
    //   }
    // );

  }
}