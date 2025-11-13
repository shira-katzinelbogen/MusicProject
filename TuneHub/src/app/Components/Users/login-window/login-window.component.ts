import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginwindowService } from '../../../Services/loginwindow.service';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../Services/login.service';
import { SignupService } from '../../../Services/signup.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserProfile, UserStateService } from '../../../Services/user-state.service';

type AuthMode = 'login' | 'signup';

@Component({
  selector: 'app-login-window',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login-window.component.html',
  styleUrl: './login-window.component.css'
})
export class LoginWindowComponent {

  userStateService: UserStateService;
  loginwindowService = inject(LoginwindowService);
  loginService = inject(LoginService);
  signupService = inject(SignupService);
  private router = inject(Router);
  signupErrorMessage: string | null = null;
  signupSuccessMessage: string | null = null;
  navigateTo(path: string) {
    this.loginwindowService.close();
    this.router.navigate([path]);
  }

  currentMode: AuthMode = 'login';

  loginForm!: FormGroup;
  signupForm!: FormGroup;
  selectedFile: File | null = null;

  profilePreviewUrl: string | ArrayBuffer | null = null;

  // פונקציה שמטפלת בבחירת קובץ (יש לחבר אותה לאירוע change ב-HTML)

  constructor(private fb: FormBuilder, http: HttpClient) {
    this.userStateService = inject(UserStateService);
  }

  ngOnInit(): void {
    // אתחול טופס כניסה
    this.loginForm = this.fb.group({
      name: ['', [Validators.required]],
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

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.profilePreviewUrl = reader.result;
      reader.readAsDataURL(this.selectedFile!);
    } else {
      this.selectedFile = null;
      this.profilePreviewUrl = null;
    }
  }

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      // 1. הוצאת הנתונים מהטופס
      const { name, password } = this.loginForm.value;

      // 2. קריאה לשירות ה-Login
      this.loginService.signin({ name, password }).subscribe({
        next: (response: any) => {
          const userProfile: UserProfile = {
            name: response.username,
            hasProfilePicture: !!response.imagePath,
            profilePictureUrl: response.imagePath ? 'http://localhost:8080/images/' + response.imagePath : undefined,
            roles: response.roles   // ← חשוב!
          };

          this.userStateService.setUser(userProfile); // 👈 עדכון המצב
          this.closeWindow();
          this.router.navigate(['/home']); // או נתיב אחר
        },
        error: (error) => {
          // 💡 כישלון: 401, 403, 500, או בעיית רשת.
          //  console.error('Login Failed:', error);

          // הצגת הודעה כללית למשתמש
          let errorMessage = 'Login failed. Please check your email and password.';
          if (error.status === 401 || error.status === 403) {
            errorMessage = 'Invalid credentials. Please try again.';
          }
          alert(errorMessage);
        }
      });
    }
  }
  // לוגיקה לשליחת טופס הרשמה
  onSignupSubmit(): void {
    // איפוס הודעות
    this.signupErrorMessage = null;
    this.signupSuccessMessage = null;

    if (this.signupForm.valid) {
      // 1. חילוץ נתונים
      const formValue = this.signupForm.value;

      // ⚠️ הערה חשובה: בקשת Spring Boot signUp מצפה ל-Users object.
      // נניח שהשדות הנדרשים הם name, password, email (במקום fullName)
      const signupData = {
        name: formValue.fullName, // ⚠️ שיניתי fullName ל-name, כי השרת מצפה ל-name
        password: formValue.password,
        email: formValue.email,
        imageProfilePath: null
      };
      // 2. קריאה לשירות ההרשמה
      console.log('Signup Data:', signupData);
      this.signupService.signup(signupData, this.selectedFile).subscribe({
        next: (response) => {
          // 💡 הצלחה: השרת החזיר 201 Created
          console.log('Signup Successful!', response);
          this.signupSuccessMessage = 'Registration successful! You can now log in.';

          // אופציונלי: העברה אוטומטית למצב Login
          this.setMode('login');
          this.signupForm.reset();
        },
        error: (error) => {
          // 💡 כישלון: 400 (שם משתמש תפוס), 500 (שגיאת שרת)
          console.error('Signup Failed:', error);

          if (error.status === 400) {
            // זה הסטטוס ש-Spring Boot מחזיר אם השם תפוס
            this.signupErrorMessage = 'This username is already taken. Please choose another one.';
          } else {
            this.signupErrorMessage = 'Registration failed. Please try again later.';
          }
        }
      });
    } else {
      // אם הטופס לא תקין (והמערכת לא מונעת שליחה)
      this.signupErrorMessage = 'Please fill in all required fields and agree to the terms.';
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

  // selectedFile: File | null = null;
  // data = { name: '' }; // נתונים נוספים לשליחה

  // // constructor(private http: HttpClient) {}

  // onFileSelected(event: any): void {
  //   this.selectedFile = event.target.files[0] as File;
  // }

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
    // formData.append('name', this.data.name);
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