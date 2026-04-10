import { afterNextRender, Component, Inject, OnInit, Optional } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginwindowService } from '../../../Services/loginwindow.service';
import { CommonModule } from '@angular/common';
import { SignupService } from '../../../Services/signup.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserStateService } from '../../../Services/user-state.service';
import { UsersService } from '../../../Services/users.service';
import { UsersProfileDTO } from '../../../Models/Users';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthService, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { MatIcon } from "@angular/material/icon";

type AuthMode = 'login' | 'signup';

@Component({
  selector: 'app-login-window',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, GoogleSigninButtonModule],
  templateUrl: './login-window.component.html',
  styleUrl: './login-window.component.css'
})

export class LoginWindowComponent implements OnInit {


  constructor(
    private fb: FormBuilder,
    private userStateService: UserStateService,
    public loginwindowService: LoginwindowService,
    private usersService: UsersService,
    private signupService: SignupService,
    private router: Router,
    private authService: SocialAuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    afterNextRender(() => {
      this.authService.authState.subscribe((user) => {
        if (user && user.idToken) {
          console.log('Google User detected:', user);
          this.sendTokenToServer(user.idToken);
        }
      });
    });
  }

  // Forms
  loginForm!: FormGroup;
  signupForm!: FormGroup;

  // State
  currentMode: AuthMode = 'login';
  signupErrorMessage: string | null = null;
  signupSuccessMessage: string | null = null;
  selectedFile: File | null = null;
  profilePreviewUrl: string | ArrayBuffer | null = null;

  // Error Handling
  serverError: string | null = null
  usernameError: string | null = null
  passwordError: string | null = null


  // Methods
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });

    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      agreeToTerms: [false, Validators.requiredTrue]
    },
    );

    this.authService.authState.subscribe((user) => {
      if (user) {
        console.log('Google user:', user);
        this.sendTokenToServer(user.idToken!);
      }
    });

    if (isPlatformBrowser(this.platformId) && this.authService) {
      this.authService.authState.subscribe((user) => {
        if (user) {
          console.log('Google user:', user);
          this.sendTokenToServer(user.idToken!);
        }
      });
    }
  }


  sendTokenToServer(token: string) {
    this.usersService.loginWithGoogle(token).subscribe({
      next: (userProfile) => {
        console.log('Successfully logged in through server!', userProfile);
        this.userStateService.currentUserSubject.next(userProfile);
        this.goToHomePage();
      },
      error: (err) => console.error('Server login failed', err)
    });
  }


  navigateTo(path: string) {
    this.loginwindowService.close();
    this.router.navigate([path]);
  }

  setMode(mode: AuthMode): void {
    this.currentMode = mode;
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
      const { name, password } = this.loginForm.value;

      this.usersService.signIn({ name, password }).subscribe({
        next: (response: UsersProfileDTO) => {
          this.serverError = null;
          this.usernameError = null;
          this.passwordError = null;
          this.userStateService.loadCurrentUser();
          this.closeWindow();
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.log(error);
          if (error.status === 404) {
            this.usernameError = 'User not found. Please check your username.';
          } else if (error.status === 401) {
            this.passwordError = 'Incorrect password. Please try again.';
          } else {
            this.serverError = 'A server error occurred. Please try again later.';
          }
        }
      });
    }
  }

  onSignupSubmit(): void {
    this.signupErrorMessage = null;
    this.signupSuccessMessage = null;

    if (this.signupForm.valid) {
      const formValue = this.signupForm.value;

      const signupData = {
        name: formValue.fullName,
        password: formValue.password,
        email: formValue.email,
        imageProfilePath: null
      };

      console.log('Signup Data:', signupData);
      this.signupService.signup(signupData, this.selectedFile).subscribe({
        next: (response) => {
          console.log('Signup Successful!', response);
          this.signupSuccessMessage = 'Registration successful! You can now log in.';
          this.setMode('login');
          this.signupForm.reset();
        },
        error: (error) => {
          console.error('Signup Failed:', error);
          if (error.status === 409) {
            this.signupErrorMessage = 'This username is already taken.Please choose another one.';
          } else {
            this.signupErrorMessage = 'Registration failed. Please try again later.';
          }
        }
      });
    } else {
      this.signupErrorMessage = 'Please fill in all required fields and agree to the terms.';
    }

    this.selectedFile = null;
    this.profilePreviewUrl = null;
  }


  closeWindow(): void {
    this.loginwindowService.close();
  }

  goToHomePage() {
    this.closeWindow();
    this.router.navigate(['/home-page']);
  }


  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeWindow();
    }
  }

  upload(): void {
    const formData = new FormData();
    formData.append('file', this.selectedFile!, this.selectedFile!.name);
  }
}