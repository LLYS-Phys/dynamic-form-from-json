import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { helperFunctions } from '../helpers/helper.functions';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockHelperFunctions: jasmine.SpyObj<helperFunctions>;

  beforeEach(async () => {
    // Create a mock helperFunctions with spy methods
    mockHelperFunctions = jasmine.createSpyObj('helperFunctions', [
      'formatJson', 
      'isJsonString'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HomeComponent // For standalone component
      ],
      providers: [
        { provide: helperFunctions, useValue: mockHelperFunctions }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load initial form from localStorage when available', () => {
      // Prepare mock localStorage data
      const mockInitialForm = '{"some": "json"}';
      const formattedJson = '{"formatted": "json"}';

      // Setup localStorage spy
      spyOn(localStorage, 'getItem').and.returnValue(mockInitialForm);
      
      // Setup helperFunctions mock
      mockHelperFunctions.formatJson.and.returnValue(formattedJson);

      // Trigger ngOnInit
      component.ngOnInit();

      // Expectations
      expect(localStorage.getItem).toHaveBeenCalledWith('initialForm');
      expect(mockHelperFunctions.formatJson).toHaveBeenCalledWith(mockInitialForm);
      expect(component.jsonForm.controls.json.value).toBe(formattedJson);
      expect(component.generatedFormJson).toEqual(JSON.parse(formattedJson));
    });

    it('should do nothing if no initial form in localStorage', () => {
      // Setup localStorage spy to return null
      spyOn(localStorage, 'getItem').and.returnValue(null);

      // Trigger ngOnInit
      component.ngOnInit();

      // Expectations
      expect(localStorage.getItem).toHaveBeenCalledWith('initialForm');
      expect(component.jsonForm.controls.json.value).toBe('');
      expect(component.generatedFormJson).toBeNull();
    });
  });

  describe('valueChanged', () => {
    it('should reset invalidJson to false', () => {
      component.invalidJson = true;
      component.valueChanged();
      expect(component.invalidJson).toBeFalse();
    });
  });

  describe('submitJSON', () => {
    it('should set invalidJson to true for invalid JSON', () => {
      // Prepare form with value
      const mockJsonValue = 'invalid json';
      component.jsonForm.controls.json.setValue(mockJsonValue);

      // Mock isJsonString to return false
      mockHelperFunctions.isJsonString.and.returnValue(false);

      // Create mock event
      const mockEvent = new Event('submit');
      spyOn(mockEvent, 'preventDefault');

      // Call submit method
      component.submitJSON(mockEvent);

      // Expectations
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockHelperFunctions.isJsonString).toHaveBeenCalledWith(mockJsonValue);
      expect(component.invalidJson).toBeTrue();
      expect(component.generatedFormJson).toBeNull();
    });

    it('should parse and set generatedFormJson for valid JSON', () => {
      // Prepare valid JSON
      const validJsonString = '{"key": "value"}';
      component.jsonForm.controls.json.setValue(validJsonString);

      // Mock isJsonString to return true
      mockHelperFunctions.isJsonString.and.returnValue(true);

      // Create mock event
      const mockEvent = new Event('submit');
      spyOn(mockEvent, 'preventDefault');

      // Call submit method
      component.submitJSON(mockEvent);

      // Expectations
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockHelperFunctions.isJsonString).toHaveBeenCalledWith(validJsonString);
      expect(component.invalidJson).toBeFalse();
      expect(component.generatedFormJson).toEqual(JSON.parse(validJsonString));
    });
  });

  describe('Form Validation', () => {
    it('should require json control to have a value', () => {
      const jsonControl = component.jsonForm.controls.json;
      
      // Test initial state
      expect(jsonControl.valid).toBeFalse();
      
      // Set a value
      jsonControl.setValue('{}');
      expect(jsonControl.valid).toBeTrue();
      
      // Clear value
      jsonControl.setValue('');
      expect(jsonControl.valid).toBeFalse();
    });
  });
});