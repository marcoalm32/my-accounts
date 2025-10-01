export class ValidateField<T extends Record<string, any>> {

    private fields: string[];
    private body: T;
    private enumObject: any;

    constructor(fields: string[], body: T, enumObject: any) {
        this.fields = fields;
        this.body = body;
        this.enumObject = enumObject;
    }

    public requiredField(): string {
        const missingField = this.fields.find(field => !this.body[field]) || '';
        return this.enumObject[missingField] || missingField;
    }

    public validateEmail(field: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = this.body[field];
        return emailRegex.test(email);
    }

    public comparePasswords(): boolean {
        return this.body['password'] === this.body['confirmPassword'];
    }

    public validatePassword(minLength: number): boolean {
        const password = this.body['password'];
        const hasLetter = /[A-Za-z]/.test(password);
        return typeof password === 'string' && password.length >= minLength && hasLetter;
    }
}