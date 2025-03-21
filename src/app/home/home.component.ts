import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormConfig } from '../models/form.model';
import { helperFunctions } from '../helpers/helper.functions';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, DynamicFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor (private helperFunctions: helperFunctions) {}

  invalidJson = false

  jsonForm = new FormGroup({
    json: new FormControl('', [Validators.required])
  })

  generatedFormJson: FormConfig | null = null

  valueChanged() {
    this.invalidJson = false
  }

  submitJSON(event: Event) {
    event.preventDefault()

    if (!this.helperFunctions.isJsonString(this.jsonForm.controls.json.value!)) {
      this.invalidJson = true
      return
    }

    this.generatedFormJson = JSON.parse(this.jsonForm.controls.json.value!)
    
    console.log(this.generatedFormJson)
  }
}

/*

Test JSON:

{
    "fields": [
      { "type": "text", "label": "First Name", "name": "firstName", "value": "" },
      { "type": "text", "label": "Last Name", "name": "lastName", "value": "" },
      { "type": "dropdown", "label": "Role", "name": "role", "options": ["User", "Admin"], "value": "" },
       {"type": "checkbox", "label": "Checkbox Test", "name": "checkbox", "value": ""},
       {"type": "radio", "label": "Radio Test", "name": "radio", "options": ["User", "Admin"], "value": ""}
    ]
}

*/