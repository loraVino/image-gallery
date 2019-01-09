import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PersistenceService } from '../services/persistence.service';
import { FormControl } from '@angular/forms';
import { SearchResult } from '../shared/search-result';
import { Image } from '../shared/image';
import { ResultContent } from '../shared/result-content';

@Component({
  selector: 'app-local-search',
  templateUrl: './local-search.component.html',
  styleUrls: ['./local-search.component.scss']
})
export class LocalSearchComponent implements OnInit {
  options: string[];
  inputs: FormControl[] = [];
  @Output() onSearchResults = new EventEmitter<SearchResult>();

  constructor(private persistenceService: PersistenceService) {
  }

  ngOnInit() {
    this.add();
    this.updateOptions();
  }

  updateOptions(): void {
    this.options = this.persistenceService.getPersistedKeys();
  }

  add(): void {
    this.inputs.push(new FormControl());
  }

  remove(toRemove: FormControl): void {
    this.inputs = this.inputs.filter((input) => input != toRemove);
  }

  search(searchMode: string): void {
    let searchResult: SearchResult = new SearchResult();
    let searchTerms: string[] = this.getSearchTerms();
    let allResults: SearchResult[];
    let photosFlatArray: Image[] = [];
    searchResult.photos = new ResultContent();

    if (searchTerms.length > 0) {
      allResults = this.getAllResults(searchTerms);
      if (searchMode === 'AND') {
        photosFlatArray = this.searchIntersection(allResults);
      }
      else {
        photosFlatArray = this.unionResults(allResults);
      }
      searchResult.photos.photo = photosFlatArray;
      this.onSearchResults.emit(searchResult);
    }
  }

  private getSearchTerms() {
    return this.inputs.filter((input) => input.value).map((input) => input.value);
  }

  private getAllResults(terms: string[]): SearchResult[] {
    return terms
      .filter((term) => term.trim() != '')
      .map((term) => this.persistenceService.getPersistedData(term));
  }

  private unionResults(results: SearchResult[]): Image[] {
    let images: Image[][] = results.map((result) => result.photos.photo);

    return [].concat(...images);
  }

  private searchIntersection(results: SearchResult[]): Image[] {
    let intersected: Image[] = [];
    if (results.length === 1) {
      intersected = results[0].photos.photo;
    }
    else {
      let first = results.shift();
      intersected = first.photos.photo.filter((photo) => this.inEveryResult(photo, results));
    }
    return intersected;
  }

  private inEveryResult(image: Image, results: SearchResult[]): boolean {
    let inResults: boolean = true;
    if (results.length == 0)
      return false;

    results.forEach(result => {
      if (!this.inResults(image, result)) {
        inResults = false;
        return;
      }
    });
    return inResults;
  }

  private inResults(image: Image, result: SearchResult): boolean {
    if (result.photos.photo.length === 0)
      return false;

    return result.photos.photo
      .filter((resultImage) => image.id === resultImage.id).length != 0;
  }
}
