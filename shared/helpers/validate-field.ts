export class ValidateField<T> {

    private fields: string[];
    private body: any;

    constructor(fields: string[], body: any) {
        this.fields = fields;
        this.body = body;
    }

    public requiredField(): string {
        return this.fields.find(field => !this.body[field]) || '';
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