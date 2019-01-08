import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SearchResult } from './shared/search-result';
import { catchError, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { debounceTime } from "rxjs/operators";


const API_KEY: String = 'bac9f1ccfd854f27894fd47c4f01b1e8';
const BASE_URL: String = "https://api.flickr.com/services/rest/";

@Injectable({
  providedIn: 'root'
})

export class ImageSearchService {
  constructor(private http: HttpClient) {
  }

  getImages(term: string, page: Number = 1): Observable<SearchResult> {
    let url = this.constructUrl(term);
    return this.http.get<SearchResult>(url)
      .pipe(catchError(this.handleError<SearchResult>('getImages', new SearchResult())));
  }

  private constructUrl(text: string, page: Number = 1): string {
    return BASE_URL + "?method=flickr.photos.search" +
      "&safe_search=1" +
      "&format=json" +
      "&nojsoncallback=1" +
      "&api_key=" + API_KEY +
      "&content_type=1" +
      "&is_getty=1" +
      "&text=" + text +
      "&page=" + page;
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}
