export interface Flex {

    readonly d: 'ROW' | 'COLUMN' | 'ROW_REVERSE' | 'COLUMN_REVERSE'; // direction
    readonly w: 'WRAP' | 'NOWRAP' | 'WRAP_REVERSE'; // wrap
    readonly jc: 'FLEX_START' | 'FLEX_END' | 'CENTER' | 'SPACE_BETWEEN'
        | 'SPACE_AROUND' | 'SPACE_EVENLY'; // justify content
    readonly ai: 'STRETCH' | 'CENTER' | 'FLEX_START' | 'FLEX_END' | 'BASELINE'; // align items
}
