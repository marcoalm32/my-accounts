import moment from "moment";
import "moment/locale/pt-br";

export class ValidateField<T extends Record<string, any>> {

    private fields: string[];
    private data: T;
    private enumObject: any;
    private objectFields: string[] = [];

    constructor(fields: string[], data: T, enumObject: any, objectFields?: string[]) {
        this.fields = fields;
        this.data = data;
        this.enumObject = enumObject;
        if (objectFields) {
            this.objectFields = objectFields;
        }
    }

    public requiredField(): string {
        const missingField = this.fields.find(field => {
            return this.data[field] === undefined || this.data[field] === null || this.data[field] === ''
        })
        return missingField !== undefined ? (this.enumObject[missingField] || missingField) : '';
    }

    public validateEmail(field: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = this.data[field];
        return emailRegex.test(email);
    }

    public comparePasswords(): boolean {
        return this.data['password'] === this.data['confirmPassword'];
    }

    public validatePassword(minLength: number): boolean {
        const password = this.data['password'];
        const hasLetter = /[A-Za-z]/.test(password);
        return typeof password === 'string' && password.length >= minLength && hasLetter;
    }

    public validateDate(format: string, value: string): boolean {
        return moment(value, format, true).locale('pt-br').isValid();
    }

    public totalInstallmentsValid(): boolean {
        const installment = this.data['installment'];
        const totalInstallments = this.data['totalInstallments'];
        return installment <= totalInstallments;
    }

}