export type SearchCollection = 'users' | 'channels' | 'messages';

export interface SearchResult<T = any> {
  id: string;
  collection: SearchCollection;
  data: T;
  channelId?: string;
  channelTitle?: string;
}

export interface MessageDoc {
  text: string;
  authorName: string;
  authorPhotoUrl?: string;
}