import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Favorite, FavoriteType } from '../Models/favorite';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  constructor(private _httpClient: HttpClient) { }
  private favoritesOpen = new BehaviorSubject<boolean>(false);

  isFavoritesOpen$: Observable<boolean> = this.favoritesOpen.asObservable();

  openFavorites(): void {
    this.favoritesOpen.next(true);
  }

  closeFavorites(): void {
    this.favoritesOpen.next(false);
  }

  toggleFavorites(): void {
    this.favoritesOpen.next(!this.favoritesOpen.value);
  }



}
