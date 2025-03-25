import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from './dynamic-form.component';
import { FormService } from '../services/form.service';
import { DependencyService } from '../services/dependency.service';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { DestroyRef } from '@angular/core';
import { FormConfig } from '../models/form.model';

describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;
  let mockFormService: jasmine.SpyObj<FormService>;
  let mockDependencyService: jasmine.SpyObj<DependencyService>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;
  let mockDestroyRef: jasmine.SpyObj<DestroyRef>;

  const mockFormConfig: FormConfig = {
    fields: [],
    groups: []
  };

  beforeEach(async () => {
    mockFormService = jasmine.createSpyObj('FormService', ['generateForm', 'fillAllFields']);
    mockDependencyService = jasmine.createSpyObj('DependencyService', ['groupDependencies']);
    mockApiService = jasmine.createSpyObj('ApiService', ['autofill', 'autoFillFromLocalStorage']);
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get']);
    mockDestroyRef = jasmine.createSpyObj('DestroyRef', ['onDestroy']);

    mockHttpClient.get.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
        ReactiveFormsModule, 
        DynamicFormComponent
      ],
      providers: [
        { provide: FormService, useValue: mockFormService },
        { provide: DependencyService, useValue: mockDependencyService },
        { provide: ApiService, useValue: mockApiService },
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: DestroyRef, useValue: mockDestroyRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;

    // Mock input signal
    (component.jsonForm as any) = () => mockFormConfig;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should generate form and evaluate dependencies', () => {
      expect(mockFormService.generateForm).toHaveBeenCalledWith(
        component.dynamicForm, 
        mockFormConfig.fields, 
        mockFormConfig.groups
      );
      expect(mockHttpClient.get).toHaveBeenCalledWith('http://localhost:3000/data');
    });
  });

  describe('updateAutosave', () => {
    it('should update localStorage with autosave value', () => {
      spyOn(localStorage, 'setItem');
      component.autoSaveForm.controls.autosave.setValue(true);
      component.updateAutosave();
      expect(localStorage.setItem).toHaveBeenCalledWith('autosave', 'true');
    });
  });

  describe('autoFillForm', () => {
    it('should call apiService autofill', () => {
      component.fetchedData = { test: 'data' };
      component.autoFillForm();
      expect(mockApiService.autofill).toHaveBeenCalledWith(component.dynamicForm, component.fetchedData);
    });
  });

  describe('evaluateGroupDependencies', () => {
    it('should hide groups based on dependencies', () => {
      const mockGroups = [
        { 
          dependencies: [{ field: 'test', value: 'value' }],
          isHidden: false 
        }
      ];
      mockDependencyService.groupDependencies.and.returnValue(true);
      
      (component.jsonForm as any) = () => ({ groups: mockGroups });
      
      component.evaluateGroupDependencies();
      
      expect(mockDependencyService.groupDependencies).toHaveBeenCalled();
      expect(mockGroups[0].isHidden).toBeTrue();
    });
  });
});