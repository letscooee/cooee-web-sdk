export interface Gradient {

    readonly type: 'LINEAR' | 'RADIAL';
    // start colour
    readonly c1: string;
    // end colour
    readonly c2: string;
    // optional
    readonly c3: string | undefined;
    readonly c4: string | undefined;
    readonly c5: string | undefined;

    readonly ang: number; // unused

}
