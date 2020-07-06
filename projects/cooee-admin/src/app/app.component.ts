import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Platform} from '@angular/cdk/platform';
import {Subject} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';

import {FuseConfigService} from '@fuse/services/config.service';
import {FuseNavigationService} from '@fuse/components/navigation/navigation.service';
import {FuseSidebarService} from '@fuse/components/sidebar/sidebar.service';
import {FuseSplashScreenService} from '@fuse/services/splash-screen.service';

import {navigation} from './navigation/navigation';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'cooee-admin-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    fuseConfig: any;
    navigation: any;

    private unsubscribeAll: Subject<any>;

    constructor(@Inject(DOCUMENT) private document: any, private fuseConfigService: FuseConfigService, private platform: Platform,
                private fuseNavigationService: FuseNavigationService, private fuseSidebarService: FuseSidebarService,
                private fuseSplashScreenService: FuseSplashScreenService, private titleService: Title, private router: Router,
                private activatedRoute: ActivatedRoute) {

        // Get default navigation
        this.navigation = navigation;

        // Register the navigation to the service
        this.fuseNavigationService.register('main', this.navigation);

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

        const appTitle = this.titleService.getTitle();
        this.router
            .events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => {

                    let child = this.activatedRoute.firstChild;
                    while (child) {
                        if (child.firstChild) {
                            child = child.firstChild;
                        } else if (child.snapshot.data && child.snapshot.data['title']) {
                            return child.snapshot.data['title'];
                        } else {
                            return appTitle;
                        }
                    }

                    return appTitle;
                })
            )
            .subscribe((ttl: string) => {
                this.titleService.setTitle(ttl);
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }
}
