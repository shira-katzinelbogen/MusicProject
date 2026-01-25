import { Component } from '@angular/core';
import {  MatIconModule } from '@angular/material/icon';
import { UsersService } from '../../../Services/users.service';
import { take } from 'rxjs';
import { LoginwindowService } from '../../../Services/loginwindow.service';


@Component({
  selector: 'app-home-page',
  imports: [MatIconModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})


export class HomePageComponent {
  activeUsersCount: number = 0;

  constructor(
    private _loginwindowService: LoginwindowService,
    private _usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this._usersService.getActiveUsersCount()
      .pipe(take(1))
      .subscribe({
        next: count => this.activeUsersCount = count,
        error: () => this.activeUsersCount = 0
      });
  }

  goToLogInWindow() {
    this._loginwindowService.open();
  }
}

