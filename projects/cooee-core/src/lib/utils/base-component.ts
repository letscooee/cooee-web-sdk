import { OnDestroy, OnInit, Directive } from '@angular/core';
import {Subject} from 'rxjs';

/**
 * A common abstract class which can be extended to any component for some utility functions.
 */
@Directive()
export abstract class AbstractBaseComponent implements OnInit, OnDestroy {

    readonly unsubscribeAll = new Subject();

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }
}
