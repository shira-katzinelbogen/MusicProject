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
import { Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from '../../../Services/sidebar.service';
import { ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatListModule, MatIconModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  // encapsulation: ViewEncapsulation.None
})
export class SidebarComponent {
  sidebarService = inject(SidebarService);
  private router = inject(Router);

  navigateTo(path: string) {
    this.sidebarService.close();
    this.router.navigate([path]);
  }

}
