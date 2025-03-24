import { Injectable } from "@angular/core";
import { FieldConfig, FormGroupConfig } from "../models/form.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class FormService {
    generateForm(form: FormGroup, fields?: FieldConfig[], groups?: FormGroupConfig[]) {
        fields?.forEach((field) => {
            this.generateField(field, form)
          })
        groups?.forEach((group) => {
            group.fields.forEach((field) => {
              this.generateField(field, form)
            })
        })
    }

    fillAllFields(form: FormGroup, fields?: FieldConfig[], groups?: FormGroupConfig[]) {
        fields?.forEach((field) => {
            this.fillField(field, form)
        })
        groups?.forEach((group) => {
            group.fields.forEach((field) => {
                this.fillField(field, form)
            })
        })  
    }

    groupDependencies(group: FormGroupConfig, form: FormGroup) {
        return !group.dependencies?.some(dependencyGroup => {
            if (!dependencyGroup.dependencies || dependencyGroup.dependencies.length === 0) {
              return true;
            }
      
            if (dependencyGroup.type === 'OR') {
              return dependencyGroup.dependencies.some(dependency => 
                this.checkGroupDependency(dependency, form)
              );
            } 
            
            if (dependencyGroup.type === 'AND') {
              return dependencyGroup.dependencies.every(dependency => 
                this.checkGroupDependency(dependency, form)
              );
            }
            return true;
        });
    }

    fieldDependencies(field: FieldConfig, form: FormGroup) {
        return !field.dependencies?.some(dependencyGroup => {
            if (!dependencyGroup.dependencies || dependencyGroup.dependencies.length === 0) {
              return true;
            }
      
            if (dependencyGroup.type === 'OR') {
              return dependencyGroup.dependencies.some(dependency => 
                this.checkFieldDependency(dependency, form)
              );
            } 
            
            if (dependencyGroup.type === 'AND') {
              return dependencyGroup.dependencies.every(dependency => 
                this.checkFieldDependency(dependency, form)
              );
            }
      
            return true;
        });
    }

    private checkGroupDependency(dependency: any, form: FormGroup): boolean {
        const dependentControl = form.get(dependency.field);
        if (!dependentControl) return false;
        if (!dependency.type) {
            return dependentControl.value === dependency.value;
        }
        else {
            switch (dependency.type) {
                case 'minlength':
                    return dependentControl.value.length >= dependency.value
                case 'maxlength':
                    return dependentControl.value.length <= dependency.value
                case 'email':
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailPattern.test(dependentControl.value)
                case 'pattern':
                    return dependency.value.test(dependentControl.value)
                default:
                    return false
            }
        }
    }

    private checkFieldDependency(dependency: any, form: FormGroup): boolean {
        if (!form) return false;
        
        const dependentControl = form!.get(dependency.field);
        if (!dependentControl) return false;
        
        if (!dependency.type) {
            return dependentControl.value === dependency.value;
        }
        else {
            switch (dependency.type) {
                case 'minlength':
                    return dependentControl.value.length >= dependency.value
                case 'maxlength':
                    return dependentControl.value.length <= dependency.value
                case 'email':
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailPattern.test(dependentControl.value)
                case 'pattern':
                    return dependency.value.test(dependentControl.value)
                default:
                    return false
            }
        }
      }

    private generateField(field: FieldConfig, form: FormGroup) {
        form.addControl(field.name, new FormControl())
        if (field.type == 'custom') {
            field.validations?.forEach((validation) => {
                switch (validation.type) {
                    case 'required': 
                        form.controls[field.name].addValidators([Validators.required])
                        break
                    case 'email':
                        form.controls[field.name].addValidators([Validators.email])
                        break
                    case 'minlength':
                        form.controls[field.name].addValidators([Validators.minLength(validation.value)])
                        break
                    case 'maxlength':
                        form.controls[field.name].addValidators([Validators.maxLength(validation.value)])
                        break
                    case 'pattern':
                        form.controls[field.name].addValidators([Validators.pattern(validation.value)])
                        break
                    default: 
                        break
                }
            })
        }
    }

    private fillField(field: FieldConfig, form: FormGroup) {
        for (const [key, value] of Object.entries(form.value)) {
            if (key == field.name) {
            field.value = value as string
            }
        }
    }
}