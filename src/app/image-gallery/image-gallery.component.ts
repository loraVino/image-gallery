import { Component, OnInit } from '@angular/core';
import { Image } from '../shared/image';
import { SearchResult } from '../shared/search-result';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
})
export class ImageGalleryComponent implements OnInit {
  private eventsSubject: Subject<void> = new Subject<void>();
  imagesList: Image[];

  updateResults(results:SearchResult){
    this.imagesList = results.photos.photo;
  }

  onScrollDown(){
    this.eventsSubject.next();
  }

  onScrollUp(){
    console.log("scroll up");
  }

  ngOnInit() {
  }

}
