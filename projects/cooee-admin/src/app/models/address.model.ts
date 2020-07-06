export class Address {

    id: string;
    attention: string;
    l1: string;
    l2: string;
    city: string;
    pinCode: string;
    state: string;

    constructor(data?: any) {
        this.update(data);
    }

    update(data: any): void {
        if (!data) {
            return;
        }

        this.id = data.id;
        this.attention = data.attention;
        this.l1 = data.l1;
        this.l2 = data.l2;
        this.city = data.city;
        this.pinCode = data.pinCode;
        this.state = data.state;
    }
}
