import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Favorite, FavoriteType } from '../../../Models/favorite';
import { FavoritesService } from '../../../Services/favorites.service';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs'; 
import { RouterModule } from '@angular/router';
import { InteractionService } from '../../../Services/interaction.service';


type DisplayCategory = 'Post' | 'Sheet Music';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, RouterModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {

  @Input() isOpen: boolean | null = false;

  readonly categories: DisplayCategory[] = ['Post', 'Sheet Music'];

  selectedCategory: DisplayCategory = 'Post';
  currentFavorites: Favorite[] = [];
  isLoading: boolean = false;
  searchText: string = '';

  constructor(private InteractionService: InteractionService) { }

  ngOnInit(): void {
    this.loadFavorites();
  }
  getUsername(item: Favorite): string {
    if (item.details && item.details.username) {
      return item.details.username;
    }
    return '';
  }

  selectCategory(category: DisplayCategory): void {
    this.selectedCategory = category;
    this.loadFavorites();
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'Sheet Music':
        return 'description';
      case 'Posts':
        return 'library_music';
      case 'Musicians':
        return 'people';
      case 'Challenges':
        return 'emoji_events';
      default:
        return 'category';
    }
  }

  onSearch(event: Event): void {
    this.searchText = (event.target as HTMLInputElement).value;
    this.loadFavorites();
  }

  private getTargetTypeForServer(displayCategory: DisplayCategory): string {
    switch (displayCategory) {
      case 'Post':
        return 'POST';
      case 'Sheet Music':
        return 'SHEET_MUSIC';
      default:
        return '';
    }
  }

  loadFavorites(): void {
    this.isLoading = true;

    const serverType = this.getTargetTypeForServer(this.selectedCategory);

    if (!serverType) {
      this.isLoading = false;
      return;
    }

    this.InteractionService.getFavoritesByType(serverType as FavoriteType, this.searchText).subscribe({
      next: (data) => {
        this.currentFavorites = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.currentFavorites = [];
      }
    });
  }

  getFavoriteName(item: Favorite): string {

    if (item.targetType === 'POST' && item.details && item.details.title) {
      return item.details.title;
    }

    if (item.targetType === 'SHEET_MUSIC' && item.details && item.details.title) {
      return item.details.title;
    }

    if (item.targetType === 'USER' && item.details && item.details.name) {
      return item.details.name;
    }

    return `[${item.targetType}] ID: ${item.targetId}`; 
  }

  getPostContentSnippet(item: Favorite): string {
    if (item.targetType === 'POST' && item.details && item.details.content) {
      const content = item.details.content;
      if (content.length > 100) {
        return content.substring(0, 100) + '...';
      }
      return content;
    }
    return '';
  }
  getPostLink(item: Favorite): string {
    if (item.targetType === 'POST' && item.details && item.details.id) {
      return `/posts/${item.details.id}`;
    }
    return '#';
  }

  getComposerOrActor(item: Favorite): string {
    if (item.targetType === 'SHEET_MUSIC' && item.details) {
      return item.details.composer || item.details.actorName || '';
    }
    return '';
  }

  getLevel(item: Favorite): string {
    if (item.targetType === 'SHEET_MUSIC' && item.details && item.details.level) {
      return item.details.level;
    }
    return '';
  }


}