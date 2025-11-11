import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UploadSheetMusicService {
  // החלף את ה-Signal במשתנה בוליאני רגיל
  private _isOpen: boolean = false;

  // החלף את ה-asReadonly() ב-Getter פשוט
  public get isOpen(): boolean {
    return this._isOpen;
  }

  // שמור את הלוגיקה פשוטה:
  toggle() { this._isOpen = !this._isOpen; }
  open() { this._isOpen = true; }
  close() { this._isOpen = false; }
}