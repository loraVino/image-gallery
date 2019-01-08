import { Injectable } from '@angular/core';
import { SearchResult } from './shared/search-result';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {

  constructor() { }

  save(key: string, data: any): void {
    try{
      if(key && key.trim().length > 0){
        localStorage.removeItem(key);
        localStorage.setItem(key, JSON.stringify(data));
      }
    }
    catch(error){
      console.log(error);
    }
  }

  getPersistedData(key: string): SearchResult {
    try{
      if (localStorage.getItem(key)) {
        return JSON.parse(localStorage.getItem(key));
      }
    }
    catch(error){
      console.log(error);
    }
    return new SearchResult();
  }

  getPersistedKeys(): string[] {
    return Object.keys(localStorage);
  }
}
