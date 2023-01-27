export class DateUtils {

    static addDays(value: number): Date {
        const date = new Date();
        date.setDate(date.getDate() + value);
        return date;
    }

}
