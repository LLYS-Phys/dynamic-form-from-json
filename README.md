# Dynamic Form From JSON

## Overview

"Dynamic Form From JSON" is an Angular application that transforms JSON configurations into fully functional forms. It enables developers to rapidly create complex, validated forms without writing HTML templates, supporting both individual fields and grouped inputs. The application generates a structured JSON output upon submission and includes a mock server for data autofill capabilities.

## Features

- **Dynamic Form Generation**: Converts a JSON object into a fully functional form.
- **Supported Field Types**:
  - Text
  - Textarea
  - Dropdown
  - Checkbox
  - Radio
  - Text with validations
- **Validation Rules**:
  - Required
  - Email format
  - Minlength
  - Maxlength
  - Pattern matching
- **Field Dependencies**:
  - Supports "AND" and "OR" dependency rules.
  - Dependencies can enforce conditions like `minlength`, `maxlength`, `email`, `pattern`, or an exact value match.
- **Mock JSON Server**:
  - Used for autofilling fields based on predefined data.
  - Started with: `json-server --watch db.json`

## Example JSON Form Configuration

```json
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
        { "type": "minlength", "value": "10", "message": "Must be at least 10 characters" }
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
            { "field": "role", "value": "Admin" },
            { "field": "email", "type": "email" }
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
    }
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
      "dependencies": [
        { 
          "type": "AND", 
          "dependencies": [
            { "field": "checkbox3", "value": "true" }
          ]
        }
      ],
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
```

## Mock Server Integration

The application includes a JSON server to simulate backend data:

- Automatically fills form fields when data with matching field names is found
- Perfect for prototyping or testing forms with realistic data
- Start with: `json-server --watch db.json`

### Customizing Mock Data

You can easily modify the autofill data by editing the `db.json` file in the root directory. The current default setup contains:

```json
{
    "data": [
        { "firstName": "Lachezar" },
        { "lastName": "Yordanov" },
        { "role": "Admin" },
        { "checkbox": "true" },
        { "radio": "Admin" },
        { "email": "lachyordanov@gmail.com" }
    ]
}
```

To add or modify autofill data:
1. Open the `db.json` file in any text editor
2. Add or change field values in the "data" array
3. Restart the JSON server to apply changes

The application will automatically use these values to prefill matching form fields when loaded.

## Getting Started

1. **Clone the repository**:
   ```sh
   git clone https://github.com/LLYS-Phys/dynamic-form-from-json.git
   cd dynamic-form-from-json
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Start the mock server**:
   ```sh
   json-server --watch db.json
   ```

4. **Run the application**:
   ```sh
   ng serve
   ```

5. **Access the application**:
   Navigate to `http://localhost:4200/`

## Use Cases

- Rapid prototyping of complex forms
- Configuration-driven form generation
- Dynamic surveys and questionnaires
- Forms with complex conditional logic
- Data collection with comprehensive validation