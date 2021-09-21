export interface Gradient {

    readonly type: 'LINEAR' | 'RADIAL';
    // start colour
    readonly c1: string;
    // middle colour
    readonly c2: string;
    // end colour
    readonly c3: string;
    // optional
    readonly c4: string | undefined;
    readonly c5: string | undefined;
    readonly angle: number; // unused
    readonly direction: string;

}
