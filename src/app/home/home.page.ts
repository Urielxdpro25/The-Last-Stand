import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  // IonItem,
  // IonLabel,
  // IonSelect,
  // IonSelectOption,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    // IonItem,
    // IonLabel,
    // IonSelect,
    // IonSelectOption,
    CommonModule,
    FormsModule,
  ],
})
export class HomePage implements AfterViewInit {
  @ViewChild('gameCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  opcionSeleccionada: string = '';

  private ctx!: CanvasRenderingContext2D;
  private canvas!: HTMLCanvasElement;

  keys: { [key: string]: boolean } = {};
  playerImg = new Image();
  player = { x: 0, y: 0, width: 60, height: 60 };
  speed = 10;

  constructor() {
    // Imagen de barco
    this.playerImg.src =
      'https://th.bing.com/th/id/OIP.fByU8He0Qj5kKUa7aNitdgHaEJ?w=290&h=180&c=7&r=0&o=7&cb=12&pid=1.7&rm=3';
  }

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.resizeCanvas();
    this.setupEventListeners();
    this.initGame();

    // Esperar a que cargue la imagen antes de iniciar el bucle del juego
    this.playerImg.onload = () => {
      requestAnimationFrame(() => this.gameLoop());
    };
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  }

  initGame() {
    this.player.x = this.canvas.width / 2 - this.player.width / 2;
    this.player.y = this.canvas.height - this.player.height - 10;
  }
update() {
  if (this.keys['ArrowLeft']) {
    this.player.x -= this.speed;
  }
  if (this.keys['ArrowRight']) {
    this.player.x += this.speed;
  }
  if (this.keys['ArrowUp']) {
    this.player.y -= this.speed;
  }
  if (this.keys['ArrowDown']) {
    this.player.y += this.speed;
  }

  // Limitar movimiento a los bordes del canvas
  if (this.player.x < 0) this.player.x = 0;
  if (this.player.x + this.player.width > this.canvas.width) {
    this.player.x = this.canvas.width - this.player.width;
  }
  if (this.player.y < 0) this.player.y = 0;
  if (this.player.y + this.player.height > this.canvas.height) {
    this.player.y = this.canvas.height - this.player.height;
  }
}

  draw() {
    // Fondo azul
    this.ctx.fillStyle = '#007BFF';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Dibuja el barco
    this.ctx.drawImage(
      this.playerImg,
      this.player.x,
      this.player.y,
      this.player.width,
      this.player.height
    );
  }

  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }
}
