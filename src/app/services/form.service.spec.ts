import { TestBed } from "@angular/core/testing";
import { FormService } from "./form.service";
import { FormGroup, FormControl } from "@angular/forms";
import { FieldConfig, FormGroupConfig } from "../models/form.model";

describe("FormService", () => {
    let service: FormService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FormService);
    });

    describe("generateForm", () => {
        it("should add controls to the form for each field", () => {
            const form = new FormGroup({});
            const fields: FieldConfig[] = [{ type: 'text', label: 'Test Field', value: '', name: "testField" }];
            service.generateForm(form, fields);
            expect(form.contains("testField")).toBeTrue();
        });
    });

    describe("fillAllFields", () => {
        it("should update field values from the form", () => {
            const form = new FormGroup({ testField: new FormControl("testValue") });
            const fields: FieldConfig[] = [{ type: 'text', label: 'Test Field', name: "testField", value: "" }];
            service.fillAllFields(form, fields);
            expect(fields[0].value).toBe("testValue");
        });
    });

    describe("generateField", () => {
        it("should add a control with validators when type is 'custom'", () => {
            const form = new FormGroup({});
            const field: FieldConfig = {
                name: "emailField",
                label: 'Email Field',
                value: '',
                type: "custom",
                validations: [{ type: "email", message: 'Error Message' }],
            };
            service["generateField"](field, form);
            const control = form.get("emailField");
            expect(control).toBeTruthy();
            expect(control?.validator).toBeTruthy();
        });
    });

    describe("fillField", () => {
        it("should update the field value from the form control", () => {
            const form = new FormGroup({ testField: new FormControl("filledValue") });
            const field: FieldConfig = { type: "text", label: "Test Field", name: "testField", value: "" };
            service["fillField"](field, form);
            expect(field.value).toBe("filledValue");
        });
    });
});