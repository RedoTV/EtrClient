import { TestBed } from '@angular/core/testing';

import { ProblemsService } from './problems.service';

describe('ProblemService', () => {
  let service: ProblemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProblemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
