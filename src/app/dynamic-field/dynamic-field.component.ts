import { Component, input } from '@angular/core';
import { FieldConfig } from '../models/form.model';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-dynamic-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatRadioModule],
  templateUrl: './dynamic-field.component.html',
  styleUrl: './dynamic-field.component.scss'
})
export class DynamicFieldComponent {
  field = input<FieldConfig>();
  control = input<FormControl>();

  getFirstError(control: AbstractControl, validations: any[]) {
    if (control?.errors) {
      for (let validation of validations) {
        if (control.hasError(validation.type.toLowerCase())) {
          return validation.message;
        }
      }
    }
    return null;
  }
}