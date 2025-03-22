import { Component, input, OnChanges, OnInit } from '@angular/core';
import { FormConfig } from '../models/form.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DynamicFieldComponent } from "../dynamic-field/dynamic-field.component";
import { MatButtonModule } from '@angular/material/button';
import { FormService } from '../services/form.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatButtonModule, DynamicFieldComponent, CommonModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit, OnChanges {
  constructor(private formService: FormService) {}

  jsonForm = input<FormConfig>()
  dynamicForm = new FormGroup({})

  ngOnInit() {
    this.formService.generateForm(this.dynamicForm, this.jsonForm()?.fields, this.jsonForm()?.groups)
    this.evaluateGroupDependencies()
    this.dynamicForm.valueChanges.subscribe(() => {
      this.evaluateGroupDependencies()
    })
  }

  ngOnChanges() {
    this.dynamicForm = new FormGroup({})
    this.formService.generateForm(this.dynamicForm, this.jsonForm()?.fields, this.jsonForm()?.groups)
    this.evaluateGroupDependencies()
  }

  getControl(name: string): FormControl {
    return this.dynamicForm.get(name) as FormControl;
  }

  isGroupVisible(group: any): boolean {
    return !group.isHidden;
  }

  submitForm(event: Event) {
    event.preventDefault()

    this.formService.fillAllFields(this.dynamicForm, this.jsonForm()?.fields, this.jsonForm()?.groups)

    console.log(this.jsonForm())
    console.log(`Output form: ${JSON.stringify(this.jsonForm())}`)
  }

  evaluateGroupDependencies() {
    const groups = this.jsonForm()?.groups;
    if (!groups) return;
    
    groups.forEach(group => {
      group.isHidden = false;
      
      if (!group.dependencies || group.dependencies.length === 0) {
        return;
      }
      
      group.isHidden = !group.dependencies.some(dependencyGroup => {
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
    });
  }
  
  private checkDependency(dependency: any): boolean {
    const dependentControl = this.dynamicForm.get(dependency.field);
    if (!dependentControl) return false;
    
    return dependentControl.value === dependency.value;
  }
}