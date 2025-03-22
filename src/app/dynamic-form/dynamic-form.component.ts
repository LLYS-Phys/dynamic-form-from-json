import { Component, input, OnChanges, OnInit } from '@angular/core';
import { FormConfig } from '../models/form.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DynamicFieldComponent } from "../dynamic-field/dynamic-field.component";
import { MatButtonModule } from '@angular/material/button';
import { FormService } from '../services/form.service';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatButtonModule, DynamicFieldComponent],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit, OnChanges {
  constructor(private formService: FormService) {}

  jsonForm = input<FormConfig>()
  dynamicForm = new FormGroup({})

  ngOnInit() {
    this.formService.generateForm(this.dynamicForm, this.jsonForm()?.fields, this.jsonForm()?.groups)
  }

  ngOnChanges() {
    this.dynamicForm = new FormGroup({})
    this.formService.generateForm(this.dynamicForm, this.jsonForm()?.fields, this.jsonForm()?.groups)
  }

  getControl(name: string): FormControl {
    return this.dynamicForm.get(name) as FormControl;
  }

  submitForm(event: Event) {
    event.preventDefault()

    this.formService.fillAllFields(this.dynamicForm, this.jsonForm()?.fields, this.jsonForm()?.groups)

    console.log(this.jsonForm())
    console.log(`Output form: ${JSON.stringify(this.jsonForm())}`)
  }
}