// src/app/app.component.ts

import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // נחוץ עבור <router-outlet>
import { MatSidenavModule } from '@angular/material/sidenav'; // נחוץ עבור mat-sidenav-container
import { HeaderComponent } from './Components/Shared/header/header.component';
import { FooterComponent } from './Components/Shared/footer/footer.component';
import { SidebarComponent } from './Components/Shared/sidebar/sidebar.component';
import { SidebarService } from './Services/sidebar.service'; // הנתיב לפי התמונה

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TuneHub';
  // sidebarService חייב להיות מוגדר כדי שה-HTML יקרא ל-isOpen()
  sidebarService = inject(SidebarService); 
}