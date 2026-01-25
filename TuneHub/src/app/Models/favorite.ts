export type FavoriteType = 'POST' | 'SHEET_MUSIC'; 

export interface Favorite {
  id: number; 
  targetType: FavoriteType; 
  targetId: number; 
  createdAt: Date; 
  details: any; 
}