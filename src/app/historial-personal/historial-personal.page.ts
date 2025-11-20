import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JsonStorageService } from '../services/json-storage.service';

@Component({
  selector: 'app-historial-personal',
  templateUrl: './historial-personal.page.html',
  styleUrls: ['./historial-personal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class HistorialPersonalPage implements OnInit {
  
  // Propiedades que el HTML espera
  usuarioActual: any = null;
  madreActual: any = null;
  datosMadre: any = null;  // ← ESTA FALTABA
  datosMedico: any = null;
  trimestreActual: string = '';
  diasRestantesFPP: number = 0;
  
  // Listas
  proximosControles: any[] = [];
  recomendaciones: any[] = [];
  
  // Control de alertas
  mostrarAlertaCerrarSesion: boolean = false;
  alertaButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => this.mostrarAlertaCerrarSesion = false
    },
    {
      text: 'Cerrar Sesión',
      role: 'destructive',
      handler: () => this.cerrarSesion()
    }
  ];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private jsonStorage: JsonStorageService
  ) {}

  async ngOnInit() {
    await this.cargarHistorial();
  }

  async cargarHistorial() {
    try {
      // Cargar usuario actual
      this.usuarioActual = await this.jsonStorage.getData('usuarioActual');
      
      // VERIFICAR SESIÓN DE MADRE
      if (!this.usuarioActual) {
        await this.mostrarAlerta('Sesión expirada', 'Por favor inicia sesión nuevamente');
        this.router.navigate(['/login-madre']);
        return;
      }

      if (this.usuarioActual.tipo !== 'madre') {
        await this.mostrarAlerta('Acceso denegado', 'Esta página es solo para madres');
        this.router.navigate(['/home']);
        return;
      }

      // Cargar datos específicos de la madre
      const madres = await this.jsonStorage.getData('registrosMadres') || [];
      this.madreActual = madres.find((m: any) => m.id === this.usuarioActual.id);
      this.datosMadre = this.madreActual; // Alias para compatibilidad

      if (!this.madreActual) {
        await this.mostrarAlerta('Error', 'No se encontraron tus datos');
        return;
      }

      // Calcular datos derivados
      this.calcularDatosDerivados();
      this.cargarDatosAdicionales();

      console.log('Historial personal cargado para:', this.madreActual.nombre);

    } catch (error) {
      console.error('Error cargando historial:', error);
      await this.mostrarAlerta('Error', 'Error al cargar tu historial');
    }
  }

  private calcularDatosDerivados() {
    // Calcular trimestre
    const semanas = parseInt(this.madreActual.semanaGestacion) || 0;
    if (semanas <= 13) this.trimestreActual = 'Primer trimestre';
    else if (semanas <= 26) this.trimestreActual = 'Segundo trimestre';
    else this.trimestreActual = 'Tercer trimestre';

    // Calcular días restantes para FPP
    const fppDate = new Date(this.madreActual.fpp || this.calcularFPP(semanas));
    const hoy = new Date();
    this.diasRestantesFPP = Math.ceil((fppDate.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  }

  private cargarDatosAdicionales() {
    // Datos de médico (simulados)
    this.datosMedico = {
      nombre: 'Dr. Pedro Pérez',
      especialidad: 'Ginecología',
      telefono: '1234-5678',
      consultorio: 'Consultorio 201'
    };

    // Próximos controles (simulados)
    this.proximosControles = [
      {
        fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        tipo: 'Control prenatal rutinario',
        lugar: 'Consultorio médico'
      },
      {
        fecha: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        tipo: 'Ecografía',
        lugar: 'Laboratorio de imágenes'
      }
    ];

    // Recomendaciones según trimestre
    const semanas = parseInt(this.madreActual.semanaGestacion) || 0;
    if (semanas <= 13) {
      this.recomendaciones = [
        { icono: '💊', texto: 'Toma ácido fólico diariamente' },
        { icono: '🚫', texto: 'Evita alimentos crudos' },
        { icono: '💤', texto: 'Descansa lo suficiente' }
      ];
    } else if (semanas <= 26) {
      this.recomendaciones = [
        { icono: '🏃‍♀️', texto: 'Ejercicio moderado' },
        { icono: '🥦', texto: 'Alimentación balanceada' },
        { icono: '📅', texto: 'Prepara el cuarto del bebé' }
      ];
    } else {
      this.recomendaciones = [
        { icono: '🎒', texto: 'Prepara la maleta para el hospital' },
        { icono: '🚗', texto: 'Planifica ruta al hospital' },
        { icono: '📞', texto: 'Ten números de emergencia a mano' }
      ];
    }
  }

  private calcularFPP(semanas: number): string {
    const fechaActual = new Date();
    const fpp = new Date(fechaActual);
    fpp.setDate(fechaActual.getDate() + ((40 - semanas) * 7));
    return fpp.toLocaleDateString();
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  obtenerColorAlerta(cantidadAlertas: number): string {
    if (cantidadAlertas > 2) return 'danger';
    if (cantidadAlertas > 0) return 'warning';
    return 'success';
  }

  // Métodos de alerta
  confirmarCerrarSesion() {
    this.mostrarAlertaCerrarSesion = true;
  }

  async cerrarSesion() {
    try {
      await this.jsonStorage.saveData('usuarioActual', null);
      this.mostrarAlertaCerrarSesion = false;
      await this.mostrarAlerta('Sesión cerrada', 'Has cerrado sesión correctamente');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  }

  private async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Métodos de navegación
  irAHerramientas() {
    this.router.navigate(['/herramientas-medicas']);
  }

  irAControles() {
    this.router.navigate(['/historial']);
  }
}
