import {Component, ViewEncapsulation} from '@angular/core';
import {FuseSidebarService} from '@fuse/components/sidebar/sidebar.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent {

    /*user = User.getCurrentUser();*/

    constructor(private fuseSidebarService: FuseSidebarService,
                private router: Router) {
    }

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this.fuseSidebarService.getSidebar(key).toggleOpen();
    }

    async logout(): Promise<any> {
        /*try {
            await this.logInService.logout();
        } catch (e) {
            return;
        }

        this.router.navigateByUrl('/');*/
    }
}
