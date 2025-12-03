import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home-page',
  imports: [MatIcon],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
constructor(private router: Router) {}

goToSignUp() {
  this.router.navigate(['/signup']); 
}
goToEditProfile() {
  this.router.navigate(['/edit-profil-modal']); 
}
}

