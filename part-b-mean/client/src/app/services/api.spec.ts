import { TestBed } from '@angular/core/testing';
import { Api } from './api';

/**
 * Basic unit test for the Api service.
 * This is the default Angular "service should be created" smoke test:
 * - sets up the testing module
 * - injects the service
 * - verifies it exists
 */
describe('Api', () => {
  // The service instance under test
  let service: Api;

  beforeEach(() => {
    /**
     * Configure Angular's testing module.
     * If Api depends on other providers (HttpClient, interceptors, etc.),
     * you would add them here.
     */
    TestBed.configureTestingModule({});

    // Inject the service from Angular's DI container
    service = TestBed.inject(Api);
  });

  it('should be created', () => {
    // Smoke test: service instance exists
    expect(service).toBeTruthy();
  });
});
