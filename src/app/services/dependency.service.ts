import { Injectable } from "@angular/core";
import { FieldConfig, FormGroupConfig } from "../models/form.model";
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class DependencyService {
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
            if (dependentControl.value == null) return false
            if (dependency.caseSensitive == "true") {
              return dependentControl.value.toString() == dependency.value
            }
            return dependentControl.value.toString().toLowerCase() == dependency.value.toLowerCase()
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
            if (dependentControl.value == null) return false
            if (dependency.caseSensitive == "true") {
              return dependentControl.value.toString() == dependency.value
            }
            return dependentControl.value.toString().toLowerCase() == dependency.value.toLowerCase()
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
}