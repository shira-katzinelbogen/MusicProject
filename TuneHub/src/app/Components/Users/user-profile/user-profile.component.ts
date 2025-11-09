import { Component } from '@angular/core';
  import {  OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// // ממשק לדוגמה לנתוני הפרופיל 
// interface Profile {
//   id: number;
//   name: string;
//   handle: string;
//   city: string;
//   country: string;
//   website?: string;
//   coverImagePath: string ;
//   imageProfilePath: string;
//   // ... נתונים נוספים
// }

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
 



  // profileId: number | null = null;
  // profileData: Profile | null = null;
  // isCurrentUserProfile: boolean = false; // שולט בהצגת כפתור Edit
  // isFollowing: boolean = false; // שולט בטקסט של כפתור Follow

  // constructor(
  //   private route: ActivatedRoute,
  //   private router: Router
  // ) {}

  // ngOnInit(): void {
  //   // קבלת ה-ID מה-URL
  //   this.route.paramMap.subscribe(params => {
  //     this.profileId = Number(params.get('id'));
  //     if (this.profileId) {
  //       this.loadProfileData(this.profileId);
  //     }
  //   });
  // }

  // // פונקציה לדוגמה לטעינת הנתונים (תוחלף בקריאת API)
  // loadProfileData(id: number): void {
  //   // נתונים סטטיים לצורך דוגמה
  //   this.profileData = {
  //     id: id,
  //     name: 'Sarah Johnson',
  //     handle: 'sarahjmusic',
  //     city: 'New York',
  //     country: 'NY',
  //     website: 'www.sarahjohnsonmusic.com',
  //     coverImagePath: 'assets/cover.jpg', // יש להחליף בנתיב תקין
  //     imageProfilePath: 'assets/profile-pic.jpg', // יש להחליף בנתיב תקין
  //   };
    
  //   // בדיקה אם המשתמש הוא בעל הפרופיל (לדוגמה: אם ה-ID שלו תואם)
  //   this.isCurrentUserProfile = (id === 1); 
  // }

  // // פונקציות פעולה
  // goBack(): void {
  //   this.router.navigate(['/musician-finder']);
  // }

  // editProfile(): void {
  //   console.log('Editing profile...');
  //   // לוגיקה לעריכת פרופיל
  // }

  // sendMessage(): void {
  //   console.log(`Sending message to ${this.profileData?.name}`);
  //   // לוגיקה לשליחת הודעה
  // }

  // followUser(): void {
  //   this.isFollowing = !this.isFollowing;
  //   console.log(`Follow status changed to: ${this.isFollowing}`);
  //   // לוגיקה לשליחת בקשת Follow לשרת
  // }


}
