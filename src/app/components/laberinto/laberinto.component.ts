import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-laberinto',
  imports: [CommonModule],
  templateUrl: './laberinto.component.html',
  styleUrl: './laberinto.component.css'
})
export class LaberintoComponent {

  readonly TIPO_TRAMPA = 2;
  ngOnInit() {
    this.resetGame();
     this.celdasErroneas.set(this.laberinto.map(row => row.map(() => false)));
  }

  // Función para reiniciar el estado del juego
 resetGame() {
    // Inicializa la señal con la matriz de falsos, excepto el inicio
    const initialMatrix = this.laberinto.map(row => row.map(() => false));
    initialMatrix[1][1] = true; // Asumiendo que 1,1 es el inicio
    this.visitado.set(initialMatrix); // Establece el nuevo valor de la señal

    this.jugadorPos = { x: 1, y: 1 };
    this.haRecogidoLlave = false;
  }

  // Define el mapa del laberinto (1 = pared, 0 = camino)
  // Puedes hacerlo más grande o cargarlo desde un JSON después
  /* laberinto: number[][] = [
    // 0=Camino, 1=Pared. Asegúrate de tener un borde de paredes
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1], // La meta está en 8,8 (índices 8, 8)
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ]; */

   laberinto: number[][] = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    // CORRECCIÓN: El valor 1 de la columna 2 ahora es la trampa
    [1, 0, this.TIPO_TRAMPA, 0, 1, 1, 1, 1, 0, 1], // Ahora sí es la trampa en (2,2)
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, this.TIPO_TRAMPA, 0, 1],
    [1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  // X es la columna (columnaIndex), Y es la fila (filaIndex)
  jugadorPos = { x: 1, y: 1 };

   // Coordenadas de la meta (Ej: fila 8, columna 8)
  metaPos = { x: 8, y: 8 };

   // Define la posición de la llave y su estado
  llavePos = { x: 5, y: 3 };
  haRecogidoLlave = false; // Usaremos un signal si prefieres, pero esto es más simple aquí

  visitado = signal<boolean[][]>([]);

   // Nueva señal para las celdas erróneas permanentes
  celdasErroneas = signal<boolean[][]>([]);

  // Inyecta el router en el constructor
  constructor(private router: Router) {}

  // Escucha el evento 'keydown' en todo el documento
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    let newX = this.jugadorPos.x;
    let newY = this.jugadorPos.y;

    // Determina la nueva posición basada en la tecla pulsada
    switch (event.key) {
      case 'ArrowUp':
        newY--;
        break;
      case 'ArrowDown':
        newY++;
        break;
      case 'ArrowLeft':
        newX--;
        break;
      case 'ArrowRight':
        newX++;
        break;
      default:
        return; // Ignora otras teclas
    }

    // Previene el scroll de la ventana con las flechas
    event.preventDefault();

    // Intenta mover al jugador a la nueva posición
    this.movePlayer(newX, newY);
  }

 movePlayer(newX: number, newY: number) {
     console.log('Intentando mover a:', newX, newY); // Puedes dejar estos logs si quieres
    if (newY >= 0 && newY < this.laberinto.length && newX >= 0 && newX < this.laberinto.length) {
      const nextCellType = this.laberinto[newY][newX];
       console.log('Tipo de celda siguiente:', nextCellType); // Puedes dejar estos logs si quieres

      // CAMBIO CLAVE: Comprueba si NO es una pared (tipo 1)
      if (nextCellType !== 1) {

        // El movimiento es válido (camino o trampa), actualizamos la posición
        this.jugadorPos.x = newX;
        this.jugadorPos.y = newY;

        // Y marcamos la celda como visitada
        this.visitado.update(matrix => {
           const newMatrix = [...matrix];
           newMatrix[newY] = [...newMatrix[newY]];
           newMatrix[newY][newX] = true;
           return newMatrix;
        });

        // AHORA gestionamos las acciones específicas de CADA tipo de celda transitable
        if (nextCellType === this.TIPO_TRAMPA) {
           this.celdasErroneas.update(matrix => {
              const newMatrix = [...matrix];
              newMatrix[newY] = [...newMatrix[newY]];
              newMatrix[newY][newX] = true;
              return newMatrix;
           });

           // Es una trampa: penalización
           alert("¡ZAS! Descarga eléctrica. Vuelves al inicio.");

           this.resetGame(); // Reutilizamos resetGame para volver a 1,1
        } else {
           // Es un camino normal (tipo 0): comprobamos llave y meta
           if (!this.haRecogidoLlave && this.jugadorPos.x === this.llavePos.x && this.jugadorPos.y === this.llavePos.y) {
              this.haRecogidoLlave = true;
              alert("¡Has encontrado la llave maestra! Ahora busca la salida.");
           }
           if (this.haRecogidoLlave && this.jugadorPos.x === this.metaPos.x && this.jugadorPos.y === this.metaPos.y) {
              this.onGameWin();
           }
        }
      }
    }
  }

  onGameWin() {
    alert("¡Has superado el laberinto y tienes la llave! El primer dígito es: 2");
    this.router.navigate(['/radio']);
  }
}
