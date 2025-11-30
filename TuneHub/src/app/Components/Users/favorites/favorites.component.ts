import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'; 

// הגדרת סוגי היעד למועדפים
type FavoriteType = 'Posts' | 'Sheet Music' | 'Teachers' | 'Musicians';

@Component({
  selector: 'app-favorites',
  standalone: true,
  // ודא שאתה מייבא את כל המודולים הדרושים לעיצוב ולפונקציונליות
  imports: [CommonModule, MatIconModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  
  // קלט (Input) שקובע אם החלונית פתוחה או סגורה
  // ב-favorites-panel.component.ts

@Input() isOpen: boolean | null = false; // 👈 שנה את הטיפוס לקבלת null

  // כפתורים של סיווג המועדפים
  readonly categories: FavoriteType[] = ['Posts', 'Sheet Music', 'Teachers', 'Musicians'];
  
  // קטגוריה שנבחרה כרגע (ברירת מחדל)
  selectedCategory: FavoriteType = 'Posts';

  // טקסט חיפוש
  searchText: string = '';

  // 1. שינוי קטגוריה
  selectCategory(category: FavoriteType): void {
    this.selectedCategory = category;
    // כאן תוכל להפעיל פונקציית טעינה / סינון של הנתונים
    this.loadFavorites();
  }

  // 2. פונקציית חיפוש
  onSearch(event: Event): void {
    this.searchText = (event.target as HTMLInputElement).value;
    // כאן תוכל להפעיל פונקציית טעינה / סינון של הנתונים
    this.loadFavorites();
  }

  // 3. פונקציית טעינת מועדפים (צריך לממש שירות FavoritesService)
  loadFavorites(): void {
    console.log(`Loading: ${this.selectedCategory}, Search: ${this.searchText}`);
    // הטמע כאן לוגיקה לקריאה לשירות ה-API עם ה-selectedCategory וה-searchText
  }
}