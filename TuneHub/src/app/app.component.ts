import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './Components/Shared/navbar/navbar.component';
import { SidebarComponent } from './Components/Shared/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NavbarComponent,SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TuneHub';
}
