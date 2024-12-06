import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { AppSesionComponent } from './app-sesion/app-sesion.component';
import { AppTabComponent } from './app-tab/app-tab.component';
import { AppInicioComponent } from './app-inicio/app-inicio.component';
import { AppHuespedComponent } from './app-huesped/app-huesped.component';
import { AppHospedajeComponent } from './app-hospedaje/app-hospedaje.component';
import { AppIngresoHospedajeComponent } from './app-ingreso-hospedaje/app-ingreso-hospedaje.component';
import { AppIngresoProductoComponent } from './app-ingreso-producto/app-ingreso-producto.component';
import { AppProductoComponent } from './app-producto/app-producto.component';
import { AppRetiranteComponent } from './app-retirante/app-retirante.component';
import { AppRetiroComponent } from './app-retiro/app-retiro.component';

export const routes: Routes = [
  { path: 'sesion', component: AppSesionComponent },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        component: AppTabComponent,
        children: [
          { path: '', component: AppInicioComponent },
          { path: 'huespedes', component: AppHuespedComponent },
          { path: 'hospedajes', component: AppHospedajeComponent },
          { path: 'ingresos-hospedajes', component: AppIngresoHospedajeComponent },
          { path: 'ingresos-productos', component: AppIngresoProductoComponent },
          { path: 'productos', component: AppProductoComponent },
          { path: 'retirantes', component: AppRetiranteComponent },
          { path: 'retiros', component: AppRetiroComponent }
        ]
      }]
  },
];

export const appRoutingProviders = [
  provideRouter(routes)
];