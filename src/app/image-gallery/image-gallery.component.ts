import { Component, OnInit, ViewChild } from '@angular/core';
import { Image } from '../shared/image';
import { SearchResult } from '../shared/search-result';
import { Subject, of } from 'rxjs';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
})
export class ImageGalleryComponent implements OnInit {
  imagesList: Image[] = [];
  @ViewChild(SearchComponent) searchComponent :SearchComponent;

  updateResults(results:SearchResult){
    this.imagesList = this.imagesList.concat(results.photos.photo);
  }

  onScrollDown(){
    this.searchComponent.subscribeTosearch();
  }

  onScrollUp(){
    console.log("scroll up");
  }

  ngOnInit() {
    this.imagesList = [];
  }

}
