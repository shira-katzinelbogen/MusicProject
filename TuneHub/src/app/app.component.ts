import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './Components/Shared/sidebar/sidebar.component';

// --- ייבוא חובה של Material ---
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { FooterComponent } from './Components/Shared/footer/footer.component';
import { HeaderComponent } from './Components/Shared/header/header.component';
// --------------------------------

// ודא שגם הקומפוננטות שלך מיובאות אם הן Standalone:
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,SidebarComponent,MatSidenavModule,FooterComponent,HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TuneHub';
}
