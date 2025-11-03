import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from '../../../Services/sidebar.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-sidebar',
  imports: [ CommonModule,
    RouterModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  encapsulation: ViewEncapsulation.None  // זה חובה כדי שה-CSS ידרוס את Material
})
export class SidebarComponent {

  
isMenuOpen: boolean = false;
  private subscription: Subscription = new Subscription();  //מטעמי בטיחות
  constructor(private router: Router,private sidebarService: SidebarService) {} 
  
  closeMenu() {  // 🔑 חדש: שינוי לשם closeMenu() כדי להתאים ל-HTML
    this.isMenuOpen = false;
  }

  

  ngOnInit() {
    // 🔑 חדש: קישור למצב הסרוויס
    this.subscription.add(
      this.sidebarService.isOpen$.subscribe(isOpen => {
        this.isMenuOpen = isOpen;
      })
    );
  }

 
}
