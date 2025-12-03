import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UploadSheetMusicService {
  private _isOpen: boolean = false;

  public get isOpen(): boolean {
    return this._isOpen;
  }

  toggle() { this._isOpen = !this._isOpen; }
  open() { this._isOpen = true; }
  close() { this._isOpen = false; }
}
