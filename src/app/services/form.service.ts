import { Injectable } from "@angular/core";
import { FieldConfig, FormConfig } from "../models/form.model";
import { FormControl, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class FormService {
    generateForm(form: FormGroup, fields?: FieldConfig[], groups?: {title: string, fields: FieldConfig[]}[]) {
        fields?.forEach((field) => {
            this.generateField(field, form)
          })
        groups?.forEach((group) => {
            group.fields.forEach((field) => {
              this.generateField(field, form)
            })
        })
    }

    fillAllFields(form: FormGroup, fields?: FieldConfig[], groups?: {title: string, fields: FieldConfig[]}[]) {
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
    }

    private fillField(field: FieldConfig, form: FormGroup) {
        for (const [key, value] of Object.entries(form.value)) {
            if (key == field.name) {
            field.value = value as string
            }
        }
    }
}