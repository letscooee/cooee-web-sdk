export interface Size {

    readonly width: string;
    readonly height: string;
    readonly maxW: string; // maxWidth
    readonly maxH: string; // maxHeight
    readonly justifyContent: string;
    readonly alignItems: string;
    readonly wrap: string;
    readonly alignContent: string;
    readonly direction: string;
    display: 'BLOCK' | 'INLINE_BLOCK' | 'FLEX' | 'INLINE_FLEX';

}
