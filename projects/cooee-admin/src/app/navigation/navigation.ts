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
    }
];
