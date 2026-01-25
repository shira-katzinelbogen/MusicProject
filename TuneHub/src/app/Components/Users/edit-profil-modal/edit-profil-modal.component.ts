import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Users from '../../../Models/Users';
import { UsersService } from '../../../Services/users.service';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { UserStateService } from '../../../Services/user-state.service';

@Component({
  selector: 'app-edit-profil-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profil-modal.component.html',
  styleUrls: ['./edit-profil-modal.component.css']
})

export class EditProfilModalComponent implements OnInit, OnDestroy {

  profileData!: Users;
  @Output() close = new EventEmitter<void>();

  editForm!: FormGroup;
  selectedFile: File | null = null;
  profilePreviewUrl: string | null = null;
  errorMsg: string | null = null;

  private routeSub!: Subscription;
  private currentProfileId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private _usersService: UsersService,
    public fileUtilsService: FileUtilsService,
    private route: ActivatedRoute,
    private router: Router,
    private _userStateService: UserStateService
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const userIdParam = Number(params.get('id'));
      if (userIdParam) {
        this.loadUserById(userIdParam);
      }
    });
  }

  private loadUserById(userId: number) {
    this._usersService.getCurrentUserMusicianDetails().subscribe({
      next: (user: Users) => {
        console.log("user", user);
        this.profileData = user;
        this.currentProfileId = userId;
        this.initializeForm();
      },
      error: (err) => {
        console.error('Error loading user by ID:', err);
        this.router.navigate(['/musicians']);
      }
    });
  }


  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      name: [this.profileData?.profile?.name || '', Validators.required],
      email: [this.profileData?.email || '', [Validators.required, Validators.email]],
      city: [this.profileData?.city || ''],
      country: [this.profileData?.country || ''],
      description: [this.profileData?.description || ''],
      imageProfilePath: [this.profileData?.profile?.imageProfilePath || '']
    });

    const url = this.fileUtilsService.getImageUrl(this.profileData!.profile!.imageProfilePath);
    this.profilePreviewUrl = typeof url === 'string' ? url : null;


    if (this.editForm.invalid) {
      console.warn('EDIT FORM INITIALIZED AS INVALID. Checking controls for errors:');
      Object.keys(this.editForm.controls).forEach(key => {
        const control = this.editForm.get(key);
        if (control && control.errors) {
          console.error(`Validation Error on ${key}:`, control.errors);
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.profilePreviewUrl = reader.result as string;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveChanges(): void {
    if (this.editForm.invalid) {
      console.error('Save failed: Form is invalid.');
      return;
    }

    const updatedData: Partial<Users> = { ...this.editForm.value };
    const fileToUpload: File | undefined = this.selectedFile || undefined;

    const nameChanged = updatedData.name !== this.profileData?.profile?.name;
    const imageChanged = !!fileToUpload || updatedData.imageProfilePath !== this.profileData?.profile?.imageProfilePath;


    this._usersService.updateUser(updatedData, fileToUpload).subscribe({
      next: (userDto: Users) => {
        if (nameChanged || imageChanged) {
          this._userStateService.clear();
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/user-profile', userDto.id]);
        }
      },
      error: (err) => {
        if (err.status === 409) {
          this.errorMsg = 'The username is already in use. Please choose a different one.';
        } else {
          this.errorMsg = 'An error occurred while updating the profile. Please try again later.';
        }
      }
    });
  }


  cancel(): void {
    if (this.currentProfileId) {
      this.router.navigate(['/user-profile', this.currentProfileId]);
    } else {
      this.router.navigate(['/musicians']);
    }
  }
}
