import { ProfileComponent } from './profile/profile.component';
import { IndexComponent } from './index/index.component';
import { Routes } from '@angular/router';


const routes: Routes  = [
    {
      path: '',
      component: IndexComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    }
];

export default routes;
