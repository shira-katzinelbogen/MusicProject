import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchStateService {
  private isSearchOpenSubject = new BehaviorSubject<boolean>(false);
  isSearchOpen$ = this.isSearchOpenSubject.asObservable();

  setSearchOpen(isOpen: boolean): void {
    this.isSearchOpenSubject.next(isOpen);
  }

  getSearchOpen(): boolean {
    return this.isSearchOpenSubject.value;
  }
}
