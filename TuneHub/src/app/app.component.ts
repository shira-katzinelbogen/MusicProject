import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { HeaderComponent } from './Components/Shared/header/header.component';
import { FooterComponent } from './Components/Shared/footer/footer.component';
import { SidebarComponent } from './Components/Shared/sidebar/sidebar.component';
import { SidebarService } from './Services/sidebar.service'; 
import { LoginWindowComponent } from './Components/Users/login-window/login-window.component';
import { UploadSheetMusicComponent } from "./Components/SheetMusic/upload-sheet-music/upload-sheet-music.component";
import { ChatBotComponent } from './Components/Chat/chat-bot/chat-bot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    HeaderComponent,
    FooterComponent,
    ChatBotComponent,
    SidebarComponent,
    LoginWindowComponent,
    UploadSheetMusicComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TuneHub';
  // sidebarService חייב להיות מוגדר כדי שה-HTML יקרא ל-isOpen()
  sidebarService = inject(SidebarService); 
}