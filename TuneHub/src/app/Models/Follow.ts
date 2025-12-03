
export enum EFollowStatus {
  NONE = 'NONE',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED'
}

export default interface Follow {
  id?: number;            
  followerId: number;     
  followingId: number;     
  status: EFollowStatus;   
  createdAt?: string;      
}
