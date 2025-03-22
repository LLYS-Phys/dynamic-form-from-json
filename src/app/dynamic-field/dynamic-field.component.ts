import { Component, input, inject } from '@angular/core';
import { FieldConfig } from '../models/form.model';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatRadioModule, CommonModule],
  templateUrl: './dynamic-field.component.html',
  styleUrl: './dynamic-field.component.scss'
})
export class DynamicFieldComponent {
  field = input.required<FieldConfig>();
  control = input.required<FormControl>();
  parentForm = input<FormGroup>();
  isHidden = false;

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
        if (control.hasError(validation.type.toLowerCase())) {
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

    this.isHidden = !fieldConfig.dependencies.some(dependencyGroup => {
      if (!dependencyGroup.dependencies || dependencyGroup.dependencies.length === 0) {
        return true;
      }

      if (dependencyGroup.type === 'OR') {
        return dependencyGroup.dependencies.some(dependency => 
          this.checkDependency(dependency)
        );
      } 
      
      if (dependencyGroup.type === 'AND') {
        return dependencyGroup.dependencies.every(dependency => 
          this.checkDependency(dependency)
        );
      }

      return true;
    });
  }

  private checkDependency(dependency: any): boolean {
    if (!this.parentForm()) return false;
    
    const dependentControl = this.parentForm()!.get(dependency.field);
    if (!dependentControl) return false;
    
    return dependentControl.value === dependency.value;
  }

  get dependencyStatus(): boolean {
    return this.isHidden;
  }
}