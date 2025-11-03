import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'  // זמין בכל האפליקציה
})
export class SidebarService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  public isOpen$ = this.isOpenSubject.asObservable();  //הזרקה-לצפיה בשינויים

  constructor() { }

  toggle(): void {
    this.isOpenSubject.next(!this.isOpenSubject.value);  //פונקציה שהופכת את המצצב הנוכחי
  }

  open(): void {
    this.isOpenSubject.next(true); 
  }

  close(): void {
    this.isOpenSubject.next(false);
  }
}