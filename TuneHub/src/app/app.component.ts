import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './Components/Shared/navbar/navbar.component';
import { SidebarComponent } from './Components/Shared/sidebar/sidebar.component';

// --- ייבוא חובה של Material ---
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { FooterComponent } from './Components/Shared/footer/footer.component';
// --------------------------------

// ודא שגם הקומפוננטות שלך מיובאות אם הן Standalone:
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NavbarComponent,SidebarComponent,MatSidenavModule,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TuneHub';
}
