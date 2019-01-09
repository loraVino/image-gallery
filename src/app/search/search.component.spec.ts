import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ImageSearchService } from '../services/image-search.service';
import { PersistenceService } from '../services/persistence.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let mockSearchService;
  let mockPersestenceService;

  let mockResponse = {
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

  beforeEach(() => {
    mockSearchService = jasmine.createSpyObj(["getImages"]);
    mockPersestenceService = jasmine.createSpyObj(["save", "getPersistedData", "getPersistedKeys"])
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      providers: [
        { provide: ImageSearchService, useValue: mockSearchService },
        { provide: PersistenceService, useValue: mockPersestenceService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('#search', () => {
    it('keyup should getImages', fakeAsync(() => {
      const searchValue = 'value';
      const searchInput = fixture.debugElement.query(By.css('input'));

      mockSearchService.getImages.and.returnValue(of(mockResponse));
      mockPersestenceService.save.and.callThrough();

      searchInput.triggerEventHandler('keyup', { 'target': { 'value': searchValue } });
      tick(400);
      expect(mockSearchService.getImages).toHaveBeenCalledWith(searchValue);
    }));

    it('keyup should save results', fakeAsync(() => {
      const searchValue = 'value';
      const searchInput = fixture.debugElement.query(By.css('input'));

      mockSearchService.getImages.and.returnValue(of(mockResponse));
      mockPersestenceService.save.and.callThrough();

      searchInput.triggerEventHandler('keyup', { 'target': { 'value': searchValue } });
      tick(400);
      expect(mockPersestenceService.save).toHaveBeenCalledWith(searchValue, mockResponse);
    }));


    it('keyup should search the latest value', fakeAsync(() => {
      const searchValue = 'value';
      const searchInput = fixture.debugElement.query(By.css('input'));

      mockSearchService.getImages.and.returnValue(of(mockResponse));
      mockPersestenceService.save.and.callThrough();

      searchInput.triggerEventHandler('keyup', { 'target': { 'value': 'va' } });
      searchInput.triggerEventHandler('keyup', { 'target': { 'value': searchValue } });

      tick(400);
      expect(mockSearchService.getImages).toHaveBeenCalledWith(searchValue);
      expect(mockSearchService.getImages).not.toHaveBeenCalledWith('va');
    }));

    it('keyup should search multiple distinct values', fakeAsync(() => {
      const searchValue = 'value';
      const searchInput = fixture.debugElement.query(By.css('input'));

      mockSearchService.getImages.and.returnValue(of(mockResponse));
      mockPersestenceService.save.and.callThrough();

      searchInput.triggerEventHandler('keyup', { 'target': { 'value': 'ba' } });
      searchInput.triggerEventHandler('keyup', { 'target': { 'value': searchValue } });

      tick(400);
      expect(mockSearchService.getImages).toHaveBeenCalledWith(searchValue);
      expect(mockSearchService.getImages).not.toHaveBeenCalledWith('ba');
    }));


  });

});
