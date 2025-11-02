// import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
// import { MatIconModule } from '@angular/material/icon';
// import { MatListModule } from '@angular/material/list';
// import { Router, RouterModule } from '@angular/router';
// import { SidebarService } from '../../../Services/sidebar.service';
// import { Observable } from 'rxjs';

// @Component({
//   selector: 'app-sidebar',
//   imports: [ CommonModule,
//     RouterModule,
//     MatSidenavModule,
//     MatIconModule,
//     MatListModule],
//   templateUrl: './sidebar.component.html',
//   styleUrl: './sidebar.component.css',
//   encapsulation: ViewEncapsulation.None  // 🔑 זה חובה כדי שה-CSS ידרוס את Material
// })
// export class SidebarComponent {
//     isOpen$!: Observable<boolean>;
//   constructor(public sidebarService: SidebarService) {}
// //   constructor(private router: Router) {} // הזרקה נכונה
// // @ViewChild('sidenav') sidenav!: MatSidenav; // התייחסות לסיידבר מהטמפלייט

// //   closeSidebar() {
// //     this.sidenav.close(); // סוגר את הסיידבר – הוא ייעלם והתוכן יופיע מיד מתחתיו (ברוחב מלא)
// //   }

//   ngOnInit(): void {
//     this.isOpen$ = this.sidebarService.isOpen$;
//   }
  
// }

import { Component, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../../Services/sidebar.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    AsyncPipe,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isOpen$!: Observable<boolean>;

  constructor(public sidebarService: SidebarService) {
    this.isOpen$ = this.sidebarService.isOpen$;
  }

  ngAfterViewInit(): void {
    this.isOpen$.subscribe(isOpen => {
      isOpen ? this.sidenav.open() : this.sidenav.close();
    });
  }
}