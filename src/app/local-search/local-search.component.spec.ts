import { LocalSearchComponent } from './local-search.component';
import { FormControl } from '@angular/forms';
import { SearchResult } from '../shared/search-result';
import { Image } from '../shared/image';
import { ResultContent } from '../shared/result-content';

describe('LocalSearchComponent', () => {
  let component: LocalSearchComponent;
  let persistenceService;
  let firstInput;
  let secondInput;
  beforeEach(() => {
    persistenceService = jasmine.createSpyObj(["save", "getPersistedData", "getPersistedKeys"]);
    component = new LocalSearchComponent(persistenceService);

    firstInput = new FormControl();
    secondInput = new FormControl();

    firstInput.setValue('first');
    secondInput.setValue('second');

    component.inputs = [
      firstInput,
      secondInput
    ];

  });

  describe('search', () => {
    it('should return union of results when called with "OR"', () => {
      let firstSearchResult: SearchResult = new SearchResult();
      let secondSearchResult: SearchResult = new SearchResult();
      let firstImage = new Image('1');
      let secondImage = new Image('2');
      let expectedResult = new SearchResult();

      expectedResult.photos = new ResultContent();
      expectedResult.photos.photo = [firstImage, secondImage];

      firstSearchResult.photos = new ResultContent();
      firstSearchResult.photos.photo = [firstImage];

      secondSearchResult.photos = new ResultContent();
      secondSearchResult.photos.photo = [secondImage];

      persistenceService.getPersistedData.and.returnValues(firstSearchResult, secondSearchResult);

      spyOn(component.onSearchResults, 'emit');

      component.search('OR');
      expect(component.onSearchResults.emit).toHaveBeenCalledWith(expectedResult);
    });


    it('should return intersection of results when called with "AND"', () => {
      let firstSearchResult: SearchResult = new SearchResult();
      let secondSearchResult: SearchResult = new SearchResult();
      let firstImage = new Image('1');
      let secondImage = new Image('2');
      let thirdImage = new Image('1');
      let expectedResult = new SearchResult();

      expectedResult.photos = new ResultContent();
      expectedResult.photos.photo = [firstImage];

      firstSearchResult.photos = new ResultContent();
      firstSearchResult.photos.photo = [firstImage];

      secondSearchResult.photos = new ResultContent();
      secondSearchResult.photos.photo = [firstImage, secondImage, thirdImage];

      persistenceService.getPersistedData.and.returnValues(firstSearchResult, secondSearchResult);

      spyOn(component.onSearchResults, 'emit');

      component.search('AND');
      expect(component.onSearchResults.emit).toHaveBeenCalledWith(expectedResult);
    });


    it('should return empty result when called with "AND" and no intersection', () => {
      let firstSearchResult: SearchResult = new SearchResult();
      let secondSearchResult: SearchResult = new SearchResult();
      let firstImage = new Image('1');
      let secondImage = new Image('2');
      let expectedResult = new SearchResult();

      expectedResult.photos = new ResultContent();
      expectedResult.photos.photo = [];

      firstSearchResult.photos = new ResultContent();
      firstSearchResult.photos.photo = [firstImage];

      secondSearchResult.photos = new ResultContent();
      secondSearchResult.photos.photo = [secondImage];

      persistenceService.getPersistedData.and.returnValues(firstSearchResult, secondSearchResult);

      spyOn(component.onSearchResults, 'emit');

      component.search('AND');
      expect(component.onSearchResults.emit).toHaveBeenCalledWith(expectedResult);
    });


    it('should do nothing when called with empty terms', () => {
      firstInput.setValue('');
      secondInput.setValue('');

      spyOn(component.onSearchResults, 'emit');

      component.search('AND');
      expect(component.onSearchResults.emit).not.toHaveBeenCalled();
      expect(persistenceService.getPersistedData).not.toHaveBeenCalled();
    });
  });

  describe('updateOptions', () => {
    it('should update options', () => {
      persistenceService.getPersistedKeys.and.returnValue(['1', '2', '3']);
      component.updateOptions();
      expect(persistenceService.getPersistedKeys).toHaveBeenCalled();
      expect(component.options).toEqual(['1', '2', '3']);
    });
  })

  describe('add', () => {
    it('should add input', () => {
      let inputsLength = component.inputs.length;
      component.add();
      expect(component.inputs.length).toBe(inputsLength + 1);
    });
  });

  describe('remove', () => {
    it('should remove input', () => {
      let formControl = new FormControl();
      component.remove(formControl);
      expect(component.inputs).not.toContain(formControl);
    })
  })

  describe('onInit', () => {
    it('should init options and add one input', () => {
      component.inputs = [];
      persistenceService.getPersistedKeys.and.returnValue(['1', '2', '3']);
      component.ngOnInit();
      expect(component.inputs.length).toBe(1);
      expect(persistenceService.getPersistedKeys).toHaveBeenCalled();
      expect(component.options).toEqual(['1', '2', '3']);
    });
  })
});
