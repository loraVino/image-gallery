import { Component, OnInit, ViewChild } from '@angular/core';
import { Image } from '../shared/image';
import { SearchResult } from '../shared/search-result';
import { ImageSearchService } from '../services/image-search.service';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
})
export class ImageGalleryComponent implements OnInit {
  @ViewChild(SearchComponent) searchComponent: SearchComponent;
  imagesList: Image[] = [];
  page: number = 1;
  currentResult: SearchResult;

  constructor(private searchService: ImageSearchService) {

  }

  updateResults(results: SearchResult) {
    this.currentResult = results;
    this.imagesList = results.photos.photo;
  }

  ngOnInit() {
    this.imagesList = [];
  }

  onScroll() {
    if (this.page < this.currentResult.photos.pages)
      this.searchService.getImages(this.searchComponent.searchTerm$.value, this.page++).subscribe((results) => {
        this.currentResult = results;
        this.imagesList = this.imagesList.concat(results.photos.photo);
      });
  }

}
