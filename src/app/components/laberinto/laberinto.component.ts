import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PERRO_2_BASE_64 } from '../images.base64';// ajusta la ruta


@Component({
  selector: 'app-laberinto',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './laberinto.component.html',
  styleUrls: ['./laberinto.component.css']
})
export class LaberintoComponent {

  readonly TIPO_TRAMPA = 2;

  // Laberinto 15x15: 0 = camino, 1 = pared, 2 = trampa
  laberinto: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,2,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,0,1,0,1,1,1,1,0,1,1,0,1],
  [1,2,0,0,0,0,0,0,0,1,0,0,0,0,1],
  [1,0,1,1,1,1,2,1,0,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,2,0,0,1],
  [1,1,1,1,0,1,1,0,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,2,1],
  [1,0,1,1,1,1,1,1,0,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,2,0,0,0,1],
  [1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,2,0,0,0,1],
  [1,0,2,1,1,1,1,1,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

jugadorPos = { x: 1, y: 1 };      // inicio
metaPos = { x: 13, y: 13 };        // salida esquina inferior derecha
llavePos = { x: 7, y: 6 };         // llave en el camino medio

  haRecogidoLlave = false;
  primeraLlave: boolean = false;

  visitado = signal<boolean[][]>([]);
  celdasErroneas = signal<boolean[][]>([]);

  // Lista de notificaciones visibles
  notificaciones = signal<{ id: number, tipo: 'info' | 'error' | 'success', mensaje: string }[]>([]);
  private idCounter = 0;
  ultimaVictoriaId: number | null = null;

  juegoIniciado = false;

  mostrarPerro = signal(false);
  perroBase64 = PERRO_2_BASE_64;


  iniciarLaberinto() {
    this.juegoIniciado = true;
  }



  constructor(private router: Router) {}

  ngOnInit() {
    this.resetGame();
    this.celdasErroneas.set(this.laberinto.map(row => row.map(() => false)));
  }

  resetGame() {
    const initialMatrix = this.laberinto.map(row => row.map(() => false));
    initialMatrix[1][1] = true;
    this.visitado.set(initialMatrix);

    this.jugadorPos = { x: 1, y: 1 };
    this.haRecogidoLlave = false;
  }


  moverDireccion(direccion: 'up' | 'down' | 'left' | 'right') {
    let newX = this.jugadorPos.x;
    let newY = this.jugadorPos.y;

    switch (direccion) {
      case 'up': newY--; break;
      case 'down': newY++; break;
      case 'left': newX--; break;
      case 'right': newX++; break;
    }

    this.movePlayer(newX, newY);
  }


@HostListener('window:keydown', ['$event'])
handleKeyDown(event: KeyboardEvent) {
  if (!this.juegoIniciado) return;
  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault();
      this.moverDireccion('up');
      break;
    case 'ArrowDown':
      event.preventDefault();
      this.moverDireccion('down');
      break;
    case 'ArrowLeft':
      event.preventDefault();
      this.moverDireccion('left');
      break;
    case 'ArrowRight':
      event.preventDefault();
      this.moverDireccion('right');
      break;
  }
}


  movePlayer(newX: number, newY: number) {
    if (!this.juegoIniciado) return;
    if (newY < 0 || newY >= this.laberinto.length || newX < 0 || newX >= this.laberinto[0].length) return;

    const nextCellType = this.laberinto[newY][newX];
    console.log(newX + "," + newY)

    if (nextCellType !== 1) { // no es pared
      this.jugadorPos = { x: newX, y: newY };

      // marcar como visitada
      this.visitado.update(matrix => {
        const newMatrix = [...matrix];
        newMatrix[newY] = [...newMatrix[newY]];
        newMatrix[newY][newX] = true;
        return newMatrix;
      });

      if (nextCellType === this.TIPO_TRAMPA) {
        this.celdasErroneas.update(matrix => {
          const newMatrix = [...matrix];
          newMatrix[newY] = [...newMatrix[newY]];
          newMatrix[newY][newX] = true;
          return newMatrix;
        });
        //alert("¡ZAS! Descarga eléctrica. Vuelves al inicio.");
        this.showNotificacion("¡ZAS! Descarga eléctrica. Vuelves al inicio.", "error");
        this.resetGame();
      } else {
        // recoger llave
        if (!this.haRecogidoLlave && newX === this.llavePos.x && newY === this.llavePos.y) {
          this.haRecogidoLlave = true;
          this.primeraLlave = true;
          //alert("¡Has encontrado la llave maestra! Ahora busca la salida.");
           this.showNotificacion("¡Has encontrado la llave maestra! Ahora busca la salida.", "success");
        }
        // comprobar meta
        if (this.haRecogidoLlave && newX === this.metaPos.x && newY === this.metaPos.y) {
          this.onGameWin();
        }
      }
    }
  }

onGameWin() {
    //this.showNotificacion("¡Has superado el laberinto y tienes la llave! El primer dígito es: 2", "success", 5000);
    //this.router.navigate(['/radio']);
  const id = this.idCounter++;
  this.ultimaVictoriaId = id;

  this.notificaciones.update(arr => [
    ...arr,
    {
      id,
      tipo: 'success',
      mensaje: "¡Has superado el laberinto y tienes la llave! El primer dígito es: 2"
    }
  ]);

  // 👉 mostrar la imagen del perro
  this.mostrarPerro.set(true);

}

continuar() {
  this.mostrarPerro.set(false);
  this.router.navigate(['/radio']); // siguiente prueba
}



  showNotificacion(mensaje: string, tipo: 'info' | 'error' | 'success' = 'info', duracion: number = 2500) {
    const id = this.idCounter++;
    this.notificaciones.update(arr => [...arr, { id, tipo, mensaje }]);

    // quitar notificación automáticamente tras 'duracion'
    setTimeout(() => {
      this.notificaciones.update(arr => arr.filter(n => n.id !== id));
    }, duracion);
  }



}
