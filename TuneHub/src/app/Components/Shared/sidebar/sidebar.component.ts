import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [ CommonModule,
    RouterModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  encapsulation: ViewEncapsulation.None  // 🔑 זה חובה כדי שה-CSS ידרוס את Material
})
export class SidebarComponent {
  constructor(private router: Router) {} // הזרקה נכונה
@ViewChild('sidenav') sidenav!: MatSidenav; // התייחסות לסיידבר מהטמפלייט

  closeSidebar() {
    this.sidenav.close(); // סוגר את הסיידבר – הוא ייעלם והתוכן יופיע מיד מתחתיו (ברוחב מלא)
  }
 
}
