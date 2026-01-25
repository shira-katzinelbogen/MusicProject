import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FavoritesService } from '../../../Services/favorites.service';
import { ChatBotService } from '../../../Services/chatBot.service';

@Component({
  selector: 'app-footer',
  imports: [MatIconModule, RouterModule,],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})

export class FooterComponent {

  constructor(
    public favoritesService: FavoritesService,
    public chatBotService: ChatBotService
  ) { }

}
