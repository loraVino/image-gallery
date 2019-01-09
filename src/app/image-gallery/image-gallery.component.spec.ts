import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageGalleryComponent } from './image-gallery.component';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ImageGalleryItemComponent } from '../image-gallery-item/image-gallery-item.component';

describe('ImageGalleryComponent', () => {
  let component: ImageGalleryComponent;
  let fixture: ComponentFixture<ImageGalleryComponent>;

  let mockResults = {
    "photos": {
      "page": 1,
      "pages": 3393,
      "perpage": 100,
      "total": "339278",
      "photo": [
        {
          "id": "9632611459",
          "owner": "50121543@N07",
          "secret": "3c04d29bf7",
          "server": "7448",
          "farm": 8,
          "title": "Good morning Galaxidi",
          "ispublic": 1,
          "isfriend": 0,
          "isfamily": 0
        }
      ]
    }
  };

  @Component({
    selector: 'app-search',
    template: '<p>Mock</p>'
  })
  class MockSearchComponent { }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImageGalleryComponent, MockSearchComponent, ImageGalleryItemComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should update image list on search results event', () => {
    const searchInput = fixture.debugElement.query(By.directive(MockSearchComponent));

    searchInput.triggerEventHandler('onSearchResults', mockResults);
    fixture.detectChanges();
    let images = fixture.debugElement.queryAll(By.directive(ImageGalleryItemComponent));

    expect(component.imagesList).toBe(mockResults.photos.photo);
    expect(images.length).toBe(mockResults.photos.photo.length);
  });

});
