import { PersistenceService } from './persistence.service';
import { SearchResult } from '../shared/search-result';

describe('PersistanceService', () => {
  let mockStorage = [];
  let service = new PersistenceService();
  const mockData = { "mock": "data" };
  const testKey = "test";


  beforeEach(() => {
    mockStorage = [];
  });

  describe('save', () => {
    it('should save results', () => {
      const testKey = "test";
      const expectedData = { 'expected': 'data' };

      spyOn(localStorage, 'setItem').and.callFake((key, value) => {
        mockStorage[key] = value;
      });

      service.save(testKey, expectedData);
      expect(mockStorage[testKey]).toBe(JSON.stringify(expectedData));
    });

    it('should do nothing when expcetion thrown', () => {
      spyOn(localStorage, 'setItem').and.throwError("error");

      expect(service.save).not.toThrow();
    });

    it('should do nothing when called with empty key', () => {
      spyOn(localStorage, 'setItem').and.callFake((key, value) => {
        mockStorage[key] = value;
      });

      service.save('', mockData);

      expect(mockStorage['']).toBe(undefined);
      expect(mockStorage.length).toBe(0);
    });

    it('should do nothing when called with null key', () => {
      spyOn(localStorage, 'setItem').and.callFake((key, value) => {
        mockStorage[key] = value;
      });

      service.save(null, mockData);
      expect(service.save).not.toThrow();
      expect(mockStorage.length).toBe(0);
    });

    it('should do nothing when called with undefined key', () => {
      spyOn(localStorage, 'setItem').and.callFake((key, value) => {
        mockStorage[key] = value;
      });

      service.save(undefined, mockData);
      expect(service.save).not.toThrow();
      expect(mockStorage.length).toBe(0);
    });

    it('should overwrite existing results when called with existing key', () => {
      const expectedData = { 'expected': 'data' };

      mockStorage[testKey] = mockData;
      spyOn(localStorage, 'setItem').and.callFake((key, value) => {
        mockStorage[key] = value;
      });
      spyOn(localStorage, 'removeItem').and.callFake((key) => {
        mockStorage[key] = null;
      });

      service.save(testKey, expectedData);

      expect(mockStorage[testKey]).toBe(JSON.stringify(expectedData));
    });
  });


  describe('getPersistedData', () => {
    it('should return results', () => {
      mockStorage[testKey] = JSON.stringify(new SearchResult());
      spyOn(localStorage, 'getItem').and.callFake((key) => {
        return mockStorage[key];
      });

      let actualData = service.getPersistedData(testKey);

      expect(JSON.stringify(actualData)).toBe(mockStorage[testKey]);
    });

    it('should return empty result when exception thrown', () => {
      const mockData = "data";
      spyOn(localStorage, 'getItem').and.throwError('error');

      let actualData = service.getPersistedData(testKey);
      expect(service.save).not.toThrowError();
      expect(JSON.stringify(actualData)).toBe(JSON.stringify(new SearchResult()));
    });

    it('should return empty result when called with non existing key', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      let actualData = service.getPersistedData(testKey);

      expect(service.save).not.toThrowError();
      expect(JSON.stringify(actualData)).toBe(JSON.stringify(new SearchResult()));
    });
  })
});
