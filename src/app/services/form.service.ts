import { Injectable } from "@angular/core";
import { FieldConfig, FormGroupConfig } from "../models/form.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class FormService {
    generateForm(form: FormGroup, fields?: FieldConfig[], groups?: FormGroupConfig[]) {
        fields?.forEach((field) => {
            this.generateField(field, form)
          })
        groups?.forEach((group) => {
            group.fields.forEach((field) => {
              this.generateField(field, form)
            })
        })
    }

    fillAllFields(form: FormGroup, fields?: FieldConfig[], groups?: FormGroupConfig[]) {
        fields?.forEach((field) => {
            this.fillField(field, form)
        })
        groups?.forEach((group) => {
            group.fields.forEach((field) => {
                this.fillField(field, form)
            })
        })  
    }

    private generateField(field: FieldConfig, form: FormGroup) {
        form.addControl(field.name, new FormControl())
        if (field.type == 'custom') {
            field.validations?.forEach((validation) => {
                switch (validation.type) {
                    case 'required': 
                        form.controls[field.name].addValidators([Validators.required])
                        break
                    case 'email':
                        form.controls[field.name].addValidators([Validators.email])
                        break
                    case 'minlength':
                        form.controls[field.name].addValidators([Validators.minLength(validation.value)])
                        break
                    case 'maxlength':
                        form.controls[field.name].addValidators([Validators.maxLength(validation.value)])
                        break
                    case 'pattern':
                        form.controls[field.name].addValidators([Validators.pattern(validation.value)])
                        break
                    default: 
                        break
                }
            })
        }
    }

    private fillField(field: FieldConfig, form: FormGroup) {
        for (const [key, value] of Object.entries(form.value)) {
            if (key == field.name) {
            field.value = value as string
            }
        }
    }
}