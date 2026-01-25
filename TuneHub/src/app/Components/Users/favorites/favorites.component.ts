import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { FavoritesService } from '../../../Services/favorites.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InteractionService } from '../../../Services/interaction.service';
import { UserStateService } from '../../../Services/user-state.service';
import { UsersProfileDTO } from '../../../Models/Users';
import { HighlightPipe } from "../../../Pipes/highlight.pipe";
import { NoResultsComponent } from "../../Shared/no-results/no-results.component";
import { Favorite, FavoriteType } from '../../../Models/Favorite';

type DisplayCategory = 'Post' | 'Sheet Music';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, RouterModule, HighlightPipe, NoResultsComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {


  readonly categories: DisplayCategory[] = ['Post', 'Sheet Music'];

  selectedCategory: DisplayCategory = 'Post';
  currentFavorites: Favorite[] = [];
  postCount = 0;
  sheetCount = 0;
  isLoading: boolean = false;
  searchText: string = '';
  currentUser!: UsersProfileDTO | null;

  constructor(
    private _interactionService: InteractionService,
    private _userStateService: UserStateService,
    public favoritesService: FavoritesService,
    private router: Router) { }

  ngOnInit(): void {
    this._userStateService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadFavorites();
  }

  getUsername(item: Favorite): string {
    return this.currentUser?.name ?? '';
  }

  selectCategory(category: DisplayCategory): void {
    this.selectedCategory = category;
    this.loadFavorites();
  }

  getCategoryIcon(category: DisplayCategory): string {
    switch (category) {
      case 'Post':
        return 'library_music';
      case 'Sheet Music':
        return 'description';
    }
  }

  onSearch(event: Event): void {
    this.searchText = (event.target as HTMLInputElement).value;
    this.loadFavorites();
  }

  private getTargetTypeForServer(displayCategory: DisplayCategory): FavoriteType {
    switch (displayCategory) {
      case 'Post':
        return 'POST';
      case 'Sheet Music':
        return 'SHEET_MUSIC';
    }
  }


  loadFavorites(): void {
    this.isLoading = true;

    const serverType = this.getTargetTypeForServer(this.selectedCategory);

    if (!serverType) {
      this.isLoading = false;
      return;
    }

    this._interactionService.getFavoritesByType(serverType as FavoriteType, this.searchText).subscribe({
      next: (data) => {
        this.currentFavorites = data;
        this.isLoading = false;
        if (serverType === "POST") {
          this.postCount = data.length;
        } else {
          this.sheetCount = data.length;
        }
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

  removeFavorite(item: Favorite) {
    if (!item.targetId) return;

    this._interactionService.removeFavorite(item.targetType, item.targetId).subscribe({
      next: () => {
        this.currentFavorites = this.currentFavorites.filter(fav => fav !== item);
        if (item.targetType === "POST") {
          this.postCount -= 1;
        } else {
          this.sheetCount -= 1;
        }
      },
      error: (err) => {
        console.error('Error removing favorite:', err);
      }
    });
  }

  goToItem(item: Favorite) {
    if (!item.targetId) return;
    this.favoritesService.close();
    const singleItemList = [item];
    switch (item.targetType) {
      case 'POST':
        this.router.navigate(['/posts'], { state: { items: singleItemList } });
        break;
      case 'SHEET_MUSIC':
        this.router.navigate([`/sheet-music/${item.targetId}`], { state: { items: singleItemList } });
        break;
    }
  }

  count(cat: string): number {
    if (cat === "Post") {
      return this.postCount;
    }
    return this.sheetCount;
  }
}