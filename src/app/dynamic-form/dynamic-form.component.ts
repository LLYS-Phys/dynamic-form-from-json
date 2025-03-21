import { Component, input } from '@angular/core';
import { FormConfig } from '../models/form.model';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatButtonModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent {
  jsonForm = input<FormConfig>()

  dynamicForm = new FormGroup({})

  get formControl() {
    return this.dynamicForm.controls as AbstractControl[]
  }

  ngOnInit() {
    this.jsonForm()?.fields.forEach((field) => {
      this.dynamicForm.addControl(field.name, new FormControl())
    })
  }

  submitForm(event: Event) {
    event.preventDefault()

    this.jsonForm()?.fields.forEach((field) => {
      for (const [key, value] of Object.entries(this.dynamicForm.value)) {
        if (key == field.name) {
          field.value = value as string
        }
      }
    })

    console.log(`Output form: ${JSON.stringify(this.jsonForm())}`)
  }
}
