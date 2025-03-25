import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class helperFunctions {
    isJsonString(str: string): boolean {
        try {
            JSON.parse(str);
        } catch (error) {
            return false;
        }
        return true;
    }

    formatJson(jsonString: string): string {
        const parsedJson = JSON.parse(jsonString);
        let formattedJson = this.prettyPrintJson(parsedJson, 0);
        return formattedJson.trim();
    }
      
    private prettyPrintJson(obj: any, indentLevel: number): string {
        const indent = '  '.repeat(indentLevel);
        if (typeof obj !== 'object' || obj === null) {
          return JSON.stringify(obj);
        }
      
        const isArray = Array.isArray(obj);
        const result = [];
      
        for (const [key, value] of Object.entries(obj)) {
          const keyStr = isArray ? '' : `"${key}": `;
          const formattedValue = this.prettyPrintJson(value, indentLevel + 1);
      
          result.push(`${indent}${keyStr}${formattedValue}`);
        }
      
        const openingBrace = isArray ? '[' : '{';
        const closingBrace = isArray ? ']' : '}';
      
        const formattedResult = result.length > 0 
          ? `${openingBrace}\n${result.join(',\n')}\n${indent}${closingBrace}`
          : `${openingBrace}\n${indent}${closingBrace}`;
      
        return formattedResult;
    } 
}