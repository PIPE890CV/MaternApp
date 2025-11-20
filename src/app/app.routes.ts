import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'registro-madre',
    loadComponent: () => import('./registro-madre/registro-madre.page').then(m => m.RegistroMadrePage)
  },
  {
    path: 'historial',
    loadComponent: () => import('./historial/historial.page').then(m => m.HistorialPage)
  },
  {
    path: 'login-medico',
    loadComponent: () => import('./login-medico/login-medico.page').then(m => m.LoginMedicoPage)
  },
  {
    path: 'login-madre',
    loadComponent: () => import('./login-madre/login-madre.page').then(m => m.LoginMadrePage)
  },
  {
    path: 'login-madre',
    loadComponent: () => import('./login-madre/login-madre.page').then( m => m.LoginMadrePage)
  },
  {
    path: 'dashboard-medico',
    loadComponent: () => import('./dashboard-medico/dashboard-medico.page').then( m => m.DashboardMedicoPage)
  },
  {
    path: 'pacientes',
    loadComponent: () => import('./pacientes/pacientes.page').then( m => m.PacientesPage)
  },
  {
    path: 'herramientas-medicas',
    loadComponent: () => import('./herramientas-medicas/herramientas-medicas.page').then( m => m.HerramientasMedicasPage)
  },
  {
    path: 'historial-personal',
    loadComponent: () => import('./historial-personal/historial-personal.page').then( m => m.HistorialPersonalPage)
  }
];
