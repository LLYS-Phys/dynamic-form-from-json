export interface FieldConfig {
    type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'radio' | 'custom';
    label: string;
    name: string;
    options?: string[];
    value: string;
    validations?: Validation[];
    dependencies?: DependenciesGroup[];
}

export interface FormConfig {
    fields: FieldConfig[];
    groups?: FormGroupConfig[];
    dependencies?: DependenciesGroup[];
}

export interface FormGroupConfig {
  title: string;
  fields: FieldConfig[]
}

interface Validation {
    type: string;
    value?: any;
    message: string;
}

interface Dependency {
    field: string; 
    value: string;
}

export interface DependenciesGroup {
    type: 'AND' | 'OR'
    dependencies: Dependency[]
}