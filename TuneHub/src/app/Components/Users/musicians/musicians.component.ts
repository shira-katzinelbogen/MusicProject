import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Users from '../../../Models/Users';
import { UsersService } from '../../../Services/users.service';
import { FileUtilsService } from '../../../Services/fileutils.service';
import { SafeUrl } from '@angular/platform-browser';
import { NavigationService } from '../../../Services/navigation.service';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-musicians',
  standalone: true,
  imports: [RouterModule, MatIcon],
  templateUrl: './musicians.component.html',
  styleUrl: './musicians.component.css'
})
export class MusiciansComponent implements OnInit{


  public users: Users[] = [];
  public isShowDetails: boolean = false;
  public selectedUser!: Users;
  showFilters: boolean = false; // אפשר להתחיל עם false אם רוצים שיהיה מקופל בהתחלה
  public user!: Users;


  constructor(private router: Router, private _usersService: UsersService, public fileUtilsService: FileUtilsService,public navigationService:NavigationService) { }

  ngOnInit(): void {
    this._usersService.getMusicians().subscribe({
      next: (res) => {
        this.users = res;
        console.log('נתונים הגיעו בהצלחה:', this.users); // הדפיסי לוודא
      },
      error: (err) => {
        console.log(err);
        // alert('שגיאה בהבאת נתונים');
      }
    });

  }

 



  // פונקציה להחלפת המצב (toggle) בלחיצה על כפתור הפילטרים
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
}
