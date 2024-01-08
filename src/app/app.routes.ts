import { Routes } from '@angular/router';
import { ContestsComponent } from './components/contests/contests.component';
import { AddContestsComponent } from './components/add-contests/add-contests.component';
import { StudentsTableComponent } from './components/students-table/students-table.component';
import { StudentsAddComponent } from './components/students-add/students-add.component';
import { AboutComponent } from './components/about/about.component';
import { ContestViewComponent } from './components/contest-view/contest-view.component';
import { StudentViewComponent } from './components/student-view/student-view.component';
import { ProblemComponent } from './components/problem/problem.component';
import { HomeComponent } from './components/home/home.component';
import { ExternalLinkComponent } from './components/external-link/external-link.component';

export const routes: Routes = [
    {
        path: 'contests/table',
        component: ContestsComponent
    },
    {
        path: 'contests/:id',
        component: ContestViewComponent
    },
    {
        path: 'contest/add',
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
    },
    {
        path: 'students/:userHandle',
        component: StudentViewComponent
    },
    {
        path: 'problem',
        component: ProblemComponent
    },
    {
        path: '',
        component: HomeComponent
    }
];
