import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SearchResult } from '../shared/search-result';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ImageSearchService {

  API_KEY: String = 'bac9f1ccfd854f27894fd47c4f01b1e8';
  BASE_URL: String = "https://api.flickr.com/services/rest/";

  constructor(private http: HttpClient) {
  }

  getImages(term: string): Observable<SearchResult> {
    let url = this.constructUrl(term);
    return this.http.get<SearchResult>(url)
      .pipe(catchError(this.handleError<SearchResult>('getImages', new SearchResult())));
  }

  private constructUrl(text: string): string {
    return this.BASE_URL + "?method=flickr.photos.search" +
      "&safe_search=1" +
      "&format=json" +
      "&nojsoncallback=1" +
      "&api_key=" + this.API_KEY +
      "&content_type=1" +
      "&is_getty=1" +
      "&text=" + text +
      "&page=1";
  }

  handleError<T>(method = 'method', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}
