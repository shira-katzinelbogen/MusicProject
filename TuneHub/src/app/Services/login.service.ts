import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private _isOpen = signal(false);
  isOpen = this._isOpen.asReadonly();

  toggle() { this._isOpen.update(v => !v); }
  open() { this._isOpen.set(true); }
  close() { this._isOpen.set(false); }
}