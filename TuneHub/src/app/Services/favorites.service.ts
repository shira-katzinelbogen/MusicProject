import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  // BehaviorSubject מאפשר לשמור את המצב הנוכחי
  private favoritesOpen = new BehaviorSubject<boolean>(false); 
  
  // Observable לקריאה על ידי קומפוננטות אחרות
  isFavoritesOpen$: Observable<boolean> = this.favoritesOpen.asObservable();

  constructor() { }

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