import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from './Components/Shared/header/header.component';
import { FooterComponent } from './Components/Shared/footer/footer.component';
import { SidebarComponent } from './Components/Shared/sidebar/sidebar.component';
import { SidebarService } from './Services/sidebar.service';
import { LoginWindowComponent } from './Components/Users/login-window/login-window.component';
import { ChatBotComponent } from './Components/Chat/chat-bot/chat-bot.component';
import { FavoritesService } from './Services/favorites.service';
import { MatIcon } from "@angular/material/icon";
import { FavoritesComponent } from "./Components/Users/favorites/favorites.component";
import { CommonModule } from '@angular/common';
import { UserStateService } from './Services/user-state.service';
import { AddCommentComponent } from "./Components/Comments/add-comment/add-comment.component";
import { CommentModalService } from './Services/CommentModalService';

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
    MatIcon,
    FavoritesComponent,
    CommonModule,
    AddCommentComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'TuneHub';

  constructor(
    public favoritesService: FavoritesService,
    public sidebarService: SidebarService,
    public commentModal: CommentModalService,
    private _userStateService: UserStateService) { }
  @ViewChild(HeaderComponent) header!: HeaderComponent;

  ngOnInit(): void {
    this._userStateService.loadCurrentUser();
  }

}