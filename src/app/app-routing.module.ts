import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./layout/layout.module').then((m) => m.LayoutPageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then( m => m.RegisterPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
