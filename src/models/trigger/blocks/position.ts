export interface Position {

    readonly type: 'STATIC' | 'ABSOLUTE' | 'FIXED';
    readonly top: string;
    readonly bottom: string;
    readonly left: string;
    readonly right: string;
    readonly zIndex: string;

}
