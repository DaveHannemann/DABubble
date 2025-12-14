export type SearchCollection = 'users' | 'channels';

export interface SearchResult<T = any> {
  id: string;
  collection: SearchCollection;
  data: T;
}