import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class helperFunctions {
    isJsonString(str: string) {
        try {
            JSON.parse(str);
        } catch (error) {
            return false;
        }
        return true;
    }
}