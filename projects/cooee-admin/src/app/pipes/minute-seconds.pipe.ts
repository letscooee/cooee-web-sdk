import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'minuteSeconds'
})
export class MinuteSecondsPipe implements PipeTransform {

    transform(seconds: number): string {
        if (!seconds) {
            return '0s';
        }

        const minutes = Math.floor(seconds / 60) % 60;
        seconds = seconds % 60;

        if (minutes) {
            if (!seconds) {
                return `${minutes}m`;
            }

            return `${minutes}m:${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    }
}
