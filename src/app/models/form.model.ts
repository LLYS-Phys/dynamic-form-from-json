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
}

export interface FormGroupConfig {
  title: string;
  isHidden: boolean;
  dependencies?: DependenciesGroup[];
  fields: FieldConfig[];
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

interface DependenciesGroup {
    type: 'AND' | 'OR'
    dependencies: Dependency[]
}