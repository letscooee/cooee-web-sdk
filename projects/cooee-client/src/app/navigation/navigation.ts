import {FuseNavigation} from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'navigation',
        title: 'Navigation',
        type: 'group',
        children: [
            {
                id: 'dashabord',
                title: 'Dashboard',
                type: 'item',
                icon: 'dashboard',
                url: '/dashboard'
            }
        ]
    },
    {
        id: 'engagement',
        title: 'Engagements',
        type: 'group',
        children: [
            {
                id: 'competencies',
                title: 'Engagement',
                type: 'item',
                icon: 'brightness_7',
                url: '/admin/competencies'
            }
        ]
    }
];
