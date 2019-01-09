import { Component, OnInit, Input } from '@angular/core';
import { Image } from '../shared/image';

@Component({
  selector: 'app-image-gallery-item',
  templateUrl: './image-gallery-item.component.html',
  styleUrls: ['./image-gallery-item.component.scss']
})
export class ImageGalleryItemComponent implements OnInit {
  @Input() image: Image;
  url: String;

  constructor() { }

  ngOnInit() {
    this.url = this.buildUrl();
  }

  private buildUrl() {
    return "https://farm" + this.image.farm +
      ".staticflickr.com/" + this.image.server +
      "/" + this.image.id + "_" +
      this.image.secret + ".jpg"
  }
}
