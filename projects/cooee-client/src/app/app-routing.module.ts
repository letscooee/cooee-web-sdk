import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {VerticalLayoutComponent} from './layout/vertical-layout/vertical-layout.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: '',
        component: VerticalLayoutComponent,
        // canActivate: [NgxPermissionsGuard],
        // canActivateChild: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: 'ROLE_USER',
                redirectTo: '/login'
            }
        },
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
