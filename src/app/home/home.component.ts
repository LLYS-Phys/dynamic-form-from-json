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
    { "type": "checkbox", "label": "Checkbox Test", "name": "checkbox", "value": "" },
    { "type": "radio", "label": "Radio Test", "name": "radio", "options": ["User", "Admin"], "value": "" },
    { 
      "type": "custom", 
      "label": "Email", 
      "name": "email", 
      "value": "", 
      "validations": [
        { "type": "required", "message": "Can't be empty" }, 
        { "type": "email", "message": "Must be a valid email" }, 
        { "type": "minLength", "value": "10", "message": "Must be at least 10 symbols" }
      ] 
    },
    { 
      "type": "custom", 
      "label": "Admin Code", 
      "name": "adminCode", 
      "value": "",
      "dependencies": [
        { 
          "type": "AND", 
          "dependencies": [
            { "field": "role", "value": "Admin" }
          ]
        }
      ]
    },
    { 
      "type": "dropdown", 
      "label": "Account Type", 
      "name": "accountType", 
      "options": ["Personal", "Business"], 
      "value": "" 
    },
    { "type": "checkbox", "label": "Newsletter", "name": "newsletter", "value": "" },
    { 
      "type": "text", 
      "label": "Company Name", 
      "name": "companyName", 
      "value": "",
      "dependencies": [
        { 
          "type": "OR", 
          "dependencies": [
            { "field": "accountType", "value": "Business" },
            { "field": "newsletter", "value": "true" }
          ]
        }
      ]
    },
    { 
      "type": "dropdown", 
      "label": "Membership Level", 
      "name": "membership", 
      "options": ["Basic", "Premium", "VIP"], 
      "value": "" 
    },
    { "type": "checkbox", "label": "Enable Discount", "name": "enableDiscount", "value": "" },
    { "type": "checkbox", "label": "Loyalty Program", "name": "loyaltyProgram", "value": "" },
    { 
      "type": "text", 
      "label": "Discount Code", 
      "name": "discountCode", 
      "value": "",
      "dependencies": [
        { 
          "type": "AND", 
          "dependencies": [
            { "field": "enableDiscount", "value": "true" },
            { 
              "type": "OR",
              "dependencies": [
                { "field": "membership", "value": "Premium" },
                { "field": "loyaltyProgram", "value": "true" }
              ]
            }
          ]
        }
      ]
    },
    { "type": "text", "label": "User ID", "name": "userId", "value": "" }
  ],
  "groups": [
    {
      "title": "Form Group",
      "dependencies": [
        {
          "type": "AND",
          "dependencies": [
            { "field": "userId", "value": "TEST" }
          ]
        }
      ],
      "fields": [
        { "type": "checkbox", "label": "Checkbox in group 1", "name": "checkbox1", "value": "" },
        { "type": "checkbox", "label": "Checkbox in group 2", "name": "checkbox2", "value": "" },
        { "type": "checkbox", "label": "Checkbox in group 3", "name": "checkbox3", "value": "" }
      ]
    },
    {
      "title": "Admin Settings",
      "fields": [
        { "type": "text", "label": "Admin Level", "name": "adminLevel", "value": "" },
        { 
          "type": "text", 
          "label": "Admin Notes", 
          "name": "adminNotes", 
          "value": "",
          "dependencies": [
            { 
              "type": "AND", 
              "dependencies": [
                { "field": "adminLevel", "value": "SuperAdmin" }
              ]
            }
          ]
        }
      ]
    }
  ]
}

*/