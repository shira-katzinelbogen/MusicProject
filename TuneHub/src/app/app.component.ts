import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { HeaderComponent } from './Components/Shared/header/header.component';
import { FooterComponent } from './Components/Shared/footer/footer.component';
import { SidebarComponent } from './Components/Shared/sidebar/sidebar.component';
import { SidebarService } from './Services/sidebar.service'; 
import { LoginWindowComponent } from './Components/Users/login-window/login-window.component';
import { UploadSheetMusicComponent } from "./Components/SheetMusic/upload-sheet-music/upload-sheet-music.component";
import { ChatBotComponent } from './Components/Chat/chat-bot/chat-bot.component';
import { Observable } from 'rxjs';
import { FavoritesService } from './Services/favorites.service';
import { MatIcon } from "@angular/material/icon";
import { FavoritesComponent } from "./Components/Users/favorites/favorites.component";
import { AsyncPipe, CommonModule } from '@angular/common';
import { GlobalSearchComponent } from "./Components/Shared/global-search/global-search.component";

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
    // UploadSheetMusicComponent,
    MatIcon,
    FavoritesComponent,
    AsyncPipe,
    CommonModule,
    // GlobalSearchComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'TuneHub';
  // sidebarService חייב להיות מוגדר כדי שה-HTML יקרא ל-isOpen()
  sidebarService = inject(SidebarService); 

  isFavoritesOpen$!: Observable<boolean>; // מצב הפאנל כ-Observable

  constructor(private favoritesService: FavoritesService) {}
@ViewChild(HeaderComponent) header!: HeaderComponent;

  ngOnInit(): void {
    // הרשמה למצב הנוכחי של החלונית
    this.isFavoritesOpen$ = this.favoritesService.isFavoritesOpen$;
  }

  // פונקציה להפעלת הטוגל
  toggleFavorites(): void {
    this.favoritesService.toggleFavorites();
  }
  
}