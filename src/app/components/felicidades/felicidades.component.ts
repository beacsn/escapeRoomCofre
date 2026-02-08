import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-felicidades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './felicidades.component.html',
  styleUrls: ['./felicidades.component.css']
})
export class FelicidadesComponent {

  constructor(private router: Router) {}

  volverAlInicio() {
    this.router.navigate(['/']);
  }
}
