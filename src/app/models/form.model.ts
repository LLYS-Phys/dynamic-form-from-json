export interface FieldConfig {
    type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'radio' | 'custom';
    label: string;
    name: string;
    options?: string[];
    value: string;
    validations?: { type: string; value?: any; message: string }[];
}

export interface FormConfig {
    fields: FieldConfig[];
    groups?: {
      title: string;
      fields: FieldConfig[];
    }[];
}  