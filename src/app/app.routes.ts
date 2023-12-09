import { Routes } from '@angular/router';
import { ContestsComponent } from './components/contests/contests.component';
import { AddContestsComponent } from './components/add-contests/add-contests.component';
import { StudentsTableComponent } from './components/students-table/students-table.component';
import { StudentsAddComponent } from './components/students-add/students-add.component';
import { AboutComponent } from './components/about/about.component';

export const routes: Routes = [
    {
        path: 'contests/table',
        component: ContestsComponent,
    },
    {
        path: 'contests/add',
        component: AddContestsComponent
    },
    {
        path: 'students/table',
        component: StudentsTableComponent
    },
    {
        path: 'students/add',
        component: StudentsAddComponent
    },
    {
        path: 'about',
        component: AboutComponent
    }
];
