import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './core/guards/auth.guard';
import {DashboardComponent} from './shared/components/dashboard/dashboard.component';
import {RegisterComponent} from './shared/components/register/register.component';
import {LoginComponent} from './shared/components/login/login.component';
import {TaskFormComponent} from './shared/components/task-form/task-form.component';
import {TaskListComponent} from './shared/components/task-list/task-list.component';


export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'tasks/new', component: TaskFormComponent, canActivate: [AuthGuard] },
  { path: 'tasks/:id', component: TaskFormComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
