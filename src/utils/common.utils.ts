export class CommonUtils {

    static isNull(value: unknown): boolean {
        return !value || value === 'null' || value === 'undefined';
    }

}
