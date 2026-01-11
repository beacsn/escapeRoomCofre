// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LaberintoComponent } from './components/laberinto/laberinto.component';
import { FinalComponent } from './components/final/final.component';
import { RadioComponent } from './components/radio/radio.component';
// Importa también el componente FinalComponent si quieres añadir su ruta de una vez

export const routes: Routes = [
  { path: '', component: InicioComponent }, // Ruta por defecto (página inicial)
  { path: 'laberinto', component: LaberintoComponent },
  { path: 'radio', component: RadioComponent }, // Ruta para el laberinto
  { path: 'final', component: FinalComponent }, // Ruta para la pantalla final
  { path: '**', redirectTo: '' } // Redirección para rutas no encontradas
];
