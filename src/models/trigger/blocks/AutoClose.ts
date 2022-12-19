/**
 * Holds InApp auto close details
 *
 * @author Ashish Gaikwad
 * @since: 0.0.36
 */
export class AutoClose {

    sec: number;
    v: boolean;
    c: string;

    constructor(data: Partial<AutoClose>) {
        data = data ?? {};
        this.c = data.c ?? '#000000';
        this.v = data.v ?? false;
        this.sec = data.sec ?? 0;
    }

}
