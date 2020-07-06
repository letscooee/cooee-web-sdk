export class User {

    private static loggedInUser = new User();

    id: string;
    name: string;
    email: string;
    mobile: string;
    enabled: boolean;
    created: Date;

    constructor(data?: any) {
        if (!data) {
            return;
        }

        this.update(data);
    }

    static getCurrentUser(): User {
        return this.loggedInUser;
    }

    update(data?: any): void {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.mobile = data.mobile;
        this.enabled = data.enabled;
        this.created = data.created;
    }

    logout(): void {
        this.update({});
    }

    isLoggedIn(): boolean {
        return !!this.id;
    }

    isAnonymous(): boolean {
        return !this.isLoggedIn();
    }
}
