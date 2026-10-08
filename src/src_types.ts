export type Language = 'fr' | 'en';

export type AccountStatus = 'available' | 'reserved';

export type StreamingPlatform = 
  | 'Netflix'
  | 'Spotify'
  | 'Disney+'
  | 'Prime Video'
  | 'YouTube Premium'
  | 'Apple TV+'
  | 'Canal+'
  | 'Crunchyroll'
  | 'Deezer'
  | 'HBO Max'
  | 'Autre';

export interface Account {
  id: string;
  name: string;
  platform: string;
  price: number; // en FCFA
  description: string;
  status: AccountStatus;
  imageUrl: string;
  quality?: string;
  profilesCount?: number;
  features?: string[];
  slotsAvailable?: number;
  slotsTotal?: number;
  category?: 'video' | 'music' | 'anime' | 'other';
  createdAt: number;
  updatedAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  phoneNumber?: string;
  createdAt: number;
}

export type ReservationStatus = 'active' | 'ended';

export interface Reservation {
  id: string;
  userId: string;
  accountId: string;
  accountName: string;
  reservedAt: number;
  status: ReservationStatus;
  userName?: string;
  userEmail?: string;
  platform?: string;
  price?: number;
  expiresAt?: number;
}

export type SortOption = 'price_asc' | 'price_desc' | 'newest';
export type FilterCategory = 'Tous' | 'Netflix' | 'Spotify' | 'Disney+' | 'Autres';