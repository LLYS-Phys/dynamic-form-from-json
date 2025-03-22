import { Component, input } from '@angular/core';
import { FieldConfig } from '../models/form.model';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { FormService } from '../services/form.service';

@Component({
  selector: 'app-dynamic-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatRadioModule, CommonModule],
  templateUrl: './dynamic-field.component.html',
  styleUrl: './dynamic-field.component.scss'
})
export class DynamicFieldComponent {
  constructor(private formService: FormService) {}

  field = input.required<FieldConfig>();
  control = input.required<FormControl>();
  parentForm = input<FormGroup>();
  isHidden = false;

  get dependencyStatus(): boolean {
    return this.isHidden;
  }

  ngOnInit() {
    this.evaluateDependencies();
    
    if (this.parentForm()) {
      this.parentForm()!.valueChanges.subscribe(() => {
        this.evaluateDependencies();
      });
    }
  }

  getFirstError(control: AbstractControl, validations: any[]) {
    if (control?.errors) {
      for (let validation of validations) {
        if (control.hasError(validation.type)) {
          return validation.message;
        }
      }
    }
    return null;
  }

  evaluateDependencies() {
    const fieldConfig = this.field();
    
    if (!fieldConfig.dependencies || fieldConfig.dependencies.length === 0) {
      this.isHidden = false;
      return;
    }

    this.isHidden = this.formService.fieldDependencies(fieldConfig, this.parentForm()!)
  }
}