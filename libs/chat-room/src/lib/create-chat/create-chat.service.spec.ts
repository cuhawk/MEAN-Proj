import { TestBed } from '@angular/core/testing';

import { CreateChatService } from './create-chat.service';

describe('CreateChatService', () => {
  let service: CreateChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
