// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { GameShellComponent } from './core/game-shell/game-shell.component';

import { InicioComponent } from './components/inicio/inicio.component';
import { LaberintoComponent } from './components/laberinto/laberinto.component';
import { RadioComponent } from './components/radio/radio.component';
import { CablesComponent } from './components/cables/cables.component';
import { FinalComponent } from './components/final/final.component';
import { FelicidadesComponent } from './components/felicidades/felicidades.component';

export const routes: Routes = [
  {
    path: '',
    component: GameShellComponent,
    children: [
      { path: '', component: InicioComponent },
      { path: 'laberinto', component: LaberintoComponent },
      { path: 'radio', component: RadioComponent },
      { path: 'tercera-prueba', component: CablesComponent },
      { path: 'final', component: FinalComponent },
      { path: 'felicidades', component: FelicidadesComponent },
    ]
  },

  { path: '**', redirectTo: '' }
];
