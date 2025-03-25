import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { DynamicFieldComponent } from './dynamic-field.component';
import { FormService } from '../services/form.service';
import { DependencyService } from '../services/dependency.service';
import { FieldConfig } from '../models/form.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DynamicFieldComponent', () => {
  let component: DynamicFieldComponent;
  let fixture: ComponentFixture<DynamicFieldComponent>;
  let mockFormService: jasmine.SpyObj<FormService>;
  let mockDependencyService: jasmine.SpyObj<DependencyService>;

  const mockFieldConfig: FieldConfig = {
    type: 'text',
    name: 'testField',
    label: 'Test Field',
    value: '',
    validations: [
      { type: 'required', message: 'Field is required' }
    ],
    dependencies: []
  };

  beforeEach(async () => {
    mockFormService = jasmine.createSpyObj('FormService', ['']);
    mockDependencyService = jasmine.createSpyObj('DependencyService', ['fieldDependencies']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DynamicFieldComponent, BrowserAnimationsModule],
      providers: [
        { provide: FormService, useValue: mockFormService },
        { provide: DependencyService, useValue: mockDependencyService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFieldComponent);
    component = fixture.componentInstance;

    // Directly assign to the input properties
    (component.field as any) = () => mockFieldConfig;
    (component.control as any) = () => new FormControl('');
    
    const parentForm = new FormGroup({
      testField: new FormControl('')
    });
    (component.parentForm as any) = () => parentForm;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getFirstError', () => {
    it('should return first validation error message', () => {
      const control = new FormControl('');
      control.setErrors({ required: true });

      const error = component.getFirstError(control, mockFieldConfig.validations!);
      expect(error).toBe('Field is required');
    });

    it('should return null when no errors', () => {
      const control = new FormControl('test');
      const error = component.getFirstError(control, mockFieldConfig.validations!);
      expect(error).toBeNull();
    });
  });

  describe('evaluateDependencies', () => {
    it('should set isHidden to false when no dependencies', () => {
      const fieldConfig: FieldConfig = { ...mockFieldConfig, dependencies: [] };
      (component.field as any) = () => fieldConfig;
      
      component.evaluateDependencies();
      expect(component.isHidden).toBeFalse();
    });

    it('should call dependencyService for field dependencies', () => {
      const fieldConfig: FieldConfig = { 
        ...mockFieldConfig, 
        dependencies: [{ type: 'AND', dependencies: [] }] 
      };
      (component.field as any) = () => fieldConfig;
      mockDependencyService.fieldDependencies.and.returnValue(true);

      component.evaluateDependencies();
      
      expect(mockDependencyService.fieldDependencies).toHaveBeenCalledWith(
        fieldConfig, 
        component.parentForm()!
      );
      expect(component.isHidden).toBeTrue();
    });
  });
});