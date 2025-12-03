import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UsersService } from '../../../Services/users.service';


@Component({
  selector: 'app-home-page',
  imports: [MatIcon],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})

export class HomePageComponent {
  // activeUsersCount: number = 0;

  // constructor(private usersService: UsersService, private router: Router) { }

    constructor( private router: Router) { }
  // ngOnInit(): void {
  //   this.usersService.getActiveUsersCount().subscribe({
  //     next: (count) => this.activeUsersCount = count,
  //     error: (err) => console.error('Failed to load active users count', err)
  //   });
  // }
  goToSignUp() {
    this.router.navigate(['/signup']);
  }
  goToEditProfile() {
    this.router.navigate(['/edit-profil-modal']);
  }
}

