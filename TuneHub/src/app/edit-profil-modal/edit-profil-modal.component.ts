import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Users from '../Models/Users';
import { UsersService } from '../Services/users.service';
import { FileUtilsService } from '../Services/fileutils.service';

@Component({
  selector: 'app-edit-profil-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.css']
})
export class EditProfilModalComponent implements OnInit {
  @Input() profileData!: Users;
  @Output() close = new EventEmitter<void>();

  editForm!: FormGroup;
  selectedFile: File | null = null;
  profilePreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _usersService: UsersService,
    public fileUtilsService: FileUtilsService
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      name: [this.profileData?.name || '', Validators.required],
      email: [this.profileData?.email || '', [Validators.required, Validators.email]],
      city: [this.profileData?.city || ''],
      country: [this.profileData?.country || ''],
      description: [this.profileData?.description || '']
    });

    const url = this.fileUtilsService.getImageUrl(this.profileData.imageProfilePath);
    this.profilePreviewUrl = typeof url === 'string' ? url : null;
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
    if (this.editForm.invalid) return;

    const updatedData = { ...this.editForm.value };
    this._usersService.updateUser(this.profileData.id!, updatedData, this.selectedFile!).subscribe({
      next: () => this.close.emit(),
      error: (err) => console.error('Error updating profile', err)
    });
  }

  cancel(): void {
    this.close.emit();
  }


}
