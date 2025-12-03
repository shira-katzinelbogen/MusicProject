import { Component } from '@angular/core';
import { PostService } from '../../../Services/post.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostResponseDTO, PostUploadDTO } from '../../../Models/Post';
import { Router } from '@angular/router';

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


  constructor(private postService: PostService, private router: Router) { }





  onSubmit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    console.log(currentUser);

    if (!currentUser || !currentUser.id) {
      return;
    }

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
        this.onUploadComplete(response); 

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
  onFileChange(event: any, type: 'images' | 'audio' | 'video'): void {
    const files = event.target.files;

    if (files && files.length > 0) {
      if (type === 'images') {
        this.selectedImages = Array.from(files);

        this.imagePreviews = [];
        for (let file of this.selectedImages) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imagePreviews.push(e.target.result);
          };
          reader.readAsDataURL(file);
        }

      } else if (type === 'audio') {
        this.selectedAudio = files[0];

        if (this.selectedAudio) {
          this.audioPreviewUrl = URL.createObjectURL(this.selectedAudio);
        }

      } else if (type === 'video') {
        this.selectedVideo = files[0];

        if (this.selectedVideo) {
          this.videoPreviewUrl = URL.createObjectURL(this.selectedVideo);
        }
      }
    } else {
      if (type === 'images') {
        this.selectedImages = [];
        this.imagePreviews = [];
      } else if (type === 'audio') {
        this.selectedAudio = null;
        this.audioPreviewUrl = null;
      } else if (type === 'video') {
        this.selectedVideo = null;
        this.videoPreviewUrl = null;
      }
    }
  }


  onUploadComplete(post: any) {
    this.uploadedPost = post;
    this.uploadSuccess = true;

    this.router.navigate(['/posts']); 
  }


}
