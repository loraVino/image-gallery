import { Component, OnInit } from '@angular/core';
import { Image } from '../shared/image';
import { SearchResult } from '../shared/search-result';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
})
export class ImageGalleryComponent implements OnInit {
  imagesList: Image[] = [];

  updateResults(results: SearchResult) {
    this.imagesList = results.photos.photo;
  }

  ngOnInit() {
    this.imagesList = [];
  }

}
