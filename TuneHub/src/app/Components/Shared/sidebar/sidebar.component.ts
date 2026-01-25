import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from '../../../Services/sidebar.service';
import { FavoritesService } from '../../../Services/favorites.service';
import { ChatBotService } from '../../../Services/chatBot.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatListModule, MatIconModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})

export class SidebarComponent {
  constructor(
    public sidebarService: SidebarService,
    public favoritesService: FavoritesService,
    public chatBotService: ChatBotService,
  ) { }
  
}
