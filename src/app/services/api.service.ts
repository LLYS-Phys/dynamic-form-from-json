import { Injectable } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    autofill(form: FormGroup, fetchedData: object[]) {
        Object.keys(form.controls).forEach((key: string) => {
            const control = form.get(key) as AbstractControl;
            
            fetchedData.forEach((item) => {
                Object.keys(item).forEach((valueKey: string) => {
                const predefinedValue = item[valueKey as keyof typeof item];
                if (valueKey == key) {
                    control.setValue(predefinedValue)
                }
                });
            });
        });
    }
}