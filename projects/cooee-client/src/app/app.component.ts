import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Platform} from '@angular/cdk/platform';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {FuseConfigService} from '@fuse/services/config.service';
import {FuseNavigationService} from '@fuse/components/navigation/navigation.service';

import {navigation} from './navigation/navigation';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'cooee-faculty-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    fuseConfig: any;

    private unsubscribeAll: Subject<any>;

    constructor(@Inject(DOCUMENT) private document: any, private fuseConfigService: FuseConfigService, private platform: Platform,
                private fuseNavigationService: FuseNavigationService) {

        // Register the navigation to the service
        this.fuseNavigationService.register('main', navigation);

        // Set the main navigation as our current navigation
        this.fuseNavigationService.setCurrentNavigation('main');

        // Add is-mobile class to the body if the platform is mobile
        if (this.platform.ANDROID || this.platform.IOS) {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this.unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Subscribe to config changes
        this.fuseConfigService.config
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((config) => {

                this.fuseConfig = config;

                // Color theme - Use normal for loop for IE11 compatibility
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < this.document.body.classList.length; i++) {
                    const className = this.document.body.classList[i];

                    if (className.startsWith('theme-')) {
                        this.document.body.classList.remove(className);
                    }
                }

                this.document.body.classList.add(this.fuseConfig.colorTheme);
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }
}
