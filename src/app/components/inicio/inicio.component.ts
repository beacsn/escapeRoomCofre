// src/app/components/inicio/inicio.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  // Sin lógica de juego aquí.
  // Esta pantalla es solo narrativa / introductoria.
}
