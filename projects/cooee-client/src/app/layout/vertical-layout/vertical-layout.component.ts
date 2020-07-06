import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {FuseConfigService} from '@fuse/services/config.service';
import {navigation} from '../../navigation/navigation';
import {FuseConfig} from '@fuse/types';

@Component({
    selector: 'app-vertical-layout',
    templateUrl: './vertical-layout.component.html',
    styleUrls: ['./vertical-layout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VerticalLayoutComponent implements OnInit, OnDestroy {

    fuseConfig: FuseConfig;
    navigation: any;

    // Private
    private unsubscribeAll: Subject<any>;

    constructor(private fuseConfigService: FuseConfigService) {
        // Set the defaults
        this.navigation = navigation;

        // Set the private defaults
        this.unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to config changes
        this.fuseConfigService.config
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }
}
