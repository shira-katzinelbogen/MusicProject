import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Components/Shared/header/header.component';
// import { SidebarComponent } from './Components/Shared/sidebar/sidebar.component';

// --- ייבוא חובה של Material ---
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { FooterComponent } from './Components/Shared/footer/footer.component';
// --------------------------------

// ודא שגם הקומפוננטות שלך מיובאות אם הן Standalone:
@Component({
  selector: 'app-root',
<<<<<<< HEAD
  imports: [RouterOutlet,HeaderComponent],
=======
  imports: [RouterOutlet,NavbarComponent,SidebarComponent,MatSidenavModule,FooterComponent],
>>>>>>> 35b7a2fb90870dfb5dd081af2bade7c52cc80355
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TuneHub';
}
