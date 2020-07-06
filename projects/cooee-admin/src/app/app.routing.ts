import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {VerticalLayoutComponent} from './layout/vertical-layout/vertical-layout.component';
import {EmptyLayoutComponent} from './layout/empty-layout/empty-layout.component';
import {NgxPermissionsGuard} from 'ngx-permissions';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: '',
        component: EmptyLayoutComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        children: [
            {
                path: 'login',
                data: {
                    permissions: {
                        only: 'ROLE_ANONYMOUS',
                        redirectTo: '/dashboard'
                    }
                },
                loadChildren: () => import('./pages/login/log-in.module').then(m => m.LogInModule)
            }
        ]
    },
    {
        path: '',
        component: VerticalLayoutComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
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
            },
            {
                path: 'admin/organizations',
                loadChildren: () => import('./pages/admin/organization/admin-organization-crud.module').then(m => m.AdminOrganizationCRUDModule)
            },
            {
                path: 'admin/questions',
                loadChildren: () => import('./pages/admin/question/admin-question.module').then(m => m.AdminQuestionModule)
            },
            {
                path: 'admin/legal',
                loadChildren: () => import('./pages/admin/page/page.module').then(m => m.PageModule)
            },
            {
                path: 'admin/faq',
                loadChildren: () => import('./pages/admin/faq/admin-faq.module').then(m => m.AdminFaqModule)
            },
            {
                path: 'organization',
                loadChildren: () => import('./pages/organization/organization-manager.module').then(m => m.OrganizationManagerModule)
            },
            {
                path: 'admin/competencies',
                loadChildren: () => import('./pages/admin/competency-meta-data/competency-meta-data.module').then(m => m.CompetencyMetaDataModule)
            },
            {
                path: 'candidate',
                loadChildren: () => import('./pages/organization-candidate/organization-candidate.module').then(m => m.OrganizationCandidateModule)
            },
            {
                path: 'jobs',
                loadChildren: () => import('./pages/organization-job/organization-job.module').then(m => m.OrganizationJobModule)
            },
            {
                path: 'portal-users',
                loadChildren: () => import('./pages/portal-user/portal-user.module').then(m => m.PortalUserModule)
            },
            {
                path: 'promo-code',
                loadChildren: () => import('./pages/promo-code/promo-code.module').then(m => m.PromoCodeModule)
            },
            {
                path: 'admin/assessment',
                loadChildren: () => import('./pages/admin/assessment/assessment.module').then(m => m.AssessmentModule)
            },
            {
                path: 'admin/candidate',
                loadChildren: () => import('./pages/admin/candidate/candidate.module').then(m => m.CandidateModule)
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
