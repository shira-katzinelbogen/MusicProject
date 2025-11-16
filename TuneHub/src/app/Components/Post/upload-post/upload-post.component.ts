import { Component } from '@angular/core';
import { PostService } from '../../../Services/post.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostResponseDTO, PostUploadDTO } from '../../../Models/Post';

@Component({
  selector: 'app-upload-post',
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-post.component.html',
  styleUrl: './upload-post.component.css'
})
export class UploadPostComponent {

  postData: PostUploadDTO = {
    title: '',
    content: ''
  };

  selectedImages: File[] = [];
  selectedAudio: File | null = null;
  selectedVideo: File | null = null;
  imagePreviews: string[] = []
  audioPreviewUrl: string | null = null
  videoPreviewUrl: string | null = null
  isUploading: boolean = false;
  uploadSuccess: boolean = false;
  uploadError: boolean = false;
  uploadedPost: PostResponseDTO | null = null;


  constructor(private postService: PostService) { }


  onFileChange(event: any, type: 'images' | 'audio' | 'video'): void {
    const files = event.target.files;

    if (files && files.length > 0) {
      if (type === 'images') {
        // עבור תמונות, שומרים רשימה
        this.selectedImages = Array.from(files);
      } else if (type === 'audio') {
        // עבור אודיו ווידאו, שומרים קובץ יחיד
        this.selectedAudio = files[0];
      } else if (type === 'video') {
        this.selectedVideo = files[0];
      }
    } else {
      // אם אין קבצים שנבחרו (ביטול בחירה), מאפסים את המשתנה הרלוונטי
      if (type === 'images') {
        this.selectedImages = [];
      } else if (type === 'audio') {
        this.selectedAudio = null;
      } else if (type === 'video') {
        this.selectedVideo = null;
      }
    }
  }


  onSubmit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    console.log(currentUser);

    if (!currentUser || !currentUser.id) {
      console.error('❌ לא נמצא משתמש מחובר או שאין לו id!');
      return;
    }

    // יוצרים DTO חדש שמתאים ל־Java
    const dtoToSend = {
      title: this.postData.title,
      content: this.postData.content,
    };

    this.isUploading = true;
    this.uploadSuccess = false;
    this.uploadError = false;

    this.postService.uploadPost(
      dtoToSend,
      this.selectedImages,
      this.selectedAudio,
      this.selectedVideo
    ).subscribe({
      next: (response) => {
        this.uploadedPost = response;
        this.uploadSuccess = true;
        this.isUploading = false;
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.uploadError = true;
        this.isUploading = false;
      }
    });
  }

}
