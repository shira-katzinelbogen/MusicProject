
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
