import { Component } from '@angular/core';

@Component({
  selector: 'app-teacher-list',
  imports: [],
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.css'
})
export class TeacherListComponent {

    showFilters: boolean = false; // אפשר להתחיל עם false אם רוצים שיהיה מקופל בהתחלה

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
}
