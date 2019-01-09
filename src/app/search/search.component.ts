import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ImageSearchService } from '../services/image-search.service';
import { SearchResult } from '../shared/search-result';
import { FormControl } from '@angular/forms';
import { PersistenceService } from '../services/persistence.service';
import { debounceTime, distinctUntilChanged, switchMap, startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchControl: FormControl;
  searchTerm$ = new BehaviorSubject<string>('');
  page = 0;
  
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
  }

 subscribeTosearch(){
    this.getImages(this.searchTerm$)
            .subscribe(results => {
              this.saveResults(this.searchTerm$.value,results);
              this.onSearchResults.emit(results);
    });
  }

 private getImages(searchTerms:Observable<string>): Observable<SearchResult>{
    return (searchTerms)
     .pipe(debounceTime(400),
       distinctUntilChanged(),
        switchMap((term) => this.imageSearchService.getImages(term,this.page)));
  }

  private saveResults(key:string, data:SearchResult){
    this.persistenceService.save(key,data);
  }

}
