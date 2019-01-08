import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { ImageSearchService } from '../image-search.service';
import { SearchResult } from '../shared/search-result';
import { FormControl } from '@angular/forms';
import { PersistenceService } from '../persistence.service';
import { debounceTime, distinctUntilChanged, switchMap, startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchControl:FormControl;
  searchTerm$ = new BehaviorSubject<string>('');
  
  @Input() scrollEvent:Observable<Number>;
  @Output() onSearchResults = new EventEmitter<SearchResult>();
  
  constructor(
    private imageSearchService: ImageSearchService,
    private persistenceService: PersistenceService
    ) {
  }

  ngOnInit() {
    this.searchControl = new FormControl();
    this.subscribeTosearch();
    this.subscribeToScroll();
  }

  private subscribeTosearch(page:Number=1){
    this.getImages(this.searchTerm$,page)
            .subscribe(results => {
              this.saveResults(this.searchTerm$.value,results);
              this.onSearchResults.emit(results);
    });
  }

  getImages(searchTerms:Observable<string>,page:Number): Observable<SearchResult>{
    return (searchTerms)
     .pipe(debounceTime(400),
       distinctUntilChanged(),
        switchMap((term,page) => this.imageSearchService.getImages(term,page)));
  }

  private saveResults(key:string, data:SearchResult){
    this.persistenceService.save(key,data);
  }

  private subscribeToScroll(){
  
  }

}
