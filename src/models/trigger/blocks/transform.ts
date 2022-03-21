export class Transform {

    readonly rot?: number;

    constructor(data: any) {
        if (data?.rot) this.rot = data.rot;
    }

    get rotate(): number | undefined {
        return this.rot;
    }

}
