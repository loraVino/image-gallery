import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ImageSearchService } from './image-search.service';
import { SearchResult } from '../shared/search-result';

describe('ImageSearchService', () => {
  let searchService: ImageSearchService;
  let httpMock: HttpTestingController;
  let searchTerm: string = "search";
  let url: string;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        ImageSearchService
      ]
    });
    searchService = TestBed.get(ImageSearchService);
    httpMock = TestBed.get(HttpTestingController);

    url = searchService.BASE_URL + "?method=flickr.photos.search" +
      "&safe_search=1" +
      "&format=json" +
      "&nojsoncallback=1" +
      "&api_key=" + searchService.API_KEY +
      "&content_type=1" +
      "&is_getty=1" +
      "&text=" + searchTerm +
      "&page=1";
  });

  describe('getImages', () => {

    it('should return images', () => {
      searchService.getImages(searchTerm).subscribe((response: any) => {
        expect(response).toBe('../assets/test/mockResponse.json');
      });
      let request = httpMock.expectOne(url);
      expect(request.request.method).toBe('GET');

      request.flush('../assets/test/mockResponse.json');
      httpMock.verify();
    });

    it('should return empty response on error', () => {
      searchService.getImages(searchTerm).subscribe((response: any) => {
        expect(response).toBe(new SearchResult());

        let request = httpMock.expectOne(url);
        expect(request.request.method).toBe('GET');
        request.error(new ErrorEvent('error'));
      });
    });
  });
});
