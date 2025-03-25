import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let formBuilder: FormBuilder;
  let testForm: FormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [ApiService, FormBuilder]
    });

    service = TestBed.inject(ApiService);
    formBuilder = TestBed.inject(FormBuilder);
  });

  describe('autofill method', () => {
    beforeEach(() => {
      testForm = formBuilder.group({
        name: [''],
        email: [''],
        age: ['']
      });
    });

    it('should autofill form controls matching data keys', () => {
      const fetchedData = [
        { name: 'John Doe', email: 'john@example.com', age: 30 },
        { other: 'irrelevant data' }
      ];

      service.autofill(testForm, fetchedData);

      expect(testForm.get('name')?.value).toBe('John Doe');
      expect(testForm.get('email')?.value).toBe('john@example.com');
      expect(testForm.get('age')?.value).toBe(30);
    });

    it('should handle empty fetchedData array', () => {
      const emptyData: object[] = [];

      service.autofill(testForm, emptyData);

      expect(testForm.get('name')?.value).toBe('');
      expect(testForm.get('email')?.value).toBe('');
      expect(testForm.get('age')?.value).toBe('');
    });
  });

  describe('autoFillFromLocalStorage method', () => {
    beforeEach(() => {
      testForm = formBuilder.group({
        name: [''],
        email: [''],
        age: ['']
      });
    });

    it('should autofill form controls from localStorage data', () => {
      const localStorageData = {
        fields: [
          { name: 'name', value: 'Jane Doe' },
          { name: 'email', value: 'jane@example.com' },
          { name: 'age', value: 25 }
        ]
      };

      service.autoFillFromLocalStorage(testForm, localStorageData);

      expect(testForm.get('name')?.value).toBe('Jane Doe');
      expect(testForm.get('email')?.value).toBe('jane@example.com');
      expect(testForm.get('age')?.value).toBe(25);
    });

    it('should handle empty fields array', () => {
      const emptyData = { fields: [] };

      service.autoFillFromLocalStorage(testForm, emptyData);

      expect(testForm.get('name')?.value).toBe('');
      expect(testForm.get('email')?.value).toBe('');
      expect(testForm.get('age')?.value).toBe('');
    });
  });
});