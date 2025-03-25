import { TestBed } from "@angular/core/testing";
import { FormControl, FormGroup } from "@angular/forms";
import { DependencyService } from "./dependency.service";
import { FieldConfig, FormGroupConfig } from "../models/form.model";

describe("DependencyService", () => {
  let service: DependencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DependencyService);
  });

  describe("groupDependencies", () => {
    it("should return true if there are no dependencies", () => {
      const group: FormGroupConfig = { title: 'Group', isHidden: false, dependencies: [], fields: [{
        type: 'text',
        label: 'Text Field',
        name: 'textField',
        value: '',
        dependencies: [{
          type: 'OR',
          dependencies: [
            { field: 'email', type: 'email' }
          ]
        }]
      }] };
      const form = new FormGroup({});
      expect(service.groupDependencies(group, form)).toBeTrue();
    });
  });

  describe("fieldDependencies", () => {
    it("should return true if there are no dependencies", () => {
      const field: FieldConfig = { 
        type: 'text',
        label: 'Text Field',
        name: 'textField',
        value: '',
        dependencies: [] };
      const form = new FormGroup({});
      expect(service.fieldDependencies(field, form)).toBeTrue();
    });
  });

  describe("checkGroupDependency", () => {
    it("should return true when a dependent field meets the required condition", () => {
      const form = new FormGroup({
        testField: new FormControl("testValue"),
      });
      const dependency = { field: "testField", value: "testValue" };
      expect(service["checkGroupDependency"](dependency, form)).toBeTrue();
    });
  });

  describe("checkFieldDependency", () => {
    it("should return true when a field meets the required dependency condition", () => {
      const form = new FormGroup({
        testField: new FormControl("testValue"),
      });
      const dependency = { field: "testField", value: "testValue" };
      expect(service["checkFieldDependency"](dependency, form)).toBeTrue();
    });
  });
});