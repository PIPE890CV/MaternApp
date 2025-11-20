import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JsonStorageService } from '../services/json-storage.service';

@Component({
  selector: 'app-dashboard-medico',
  templateUrl: './dashboard-medico.page.html',
  styleUrls: ['./dashboard-medico.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class DashboardMedicoPage implements OnInit {
  // Estadísticas principales
  totalPacientes: number = 0;
  pacientesActivos: number = 0;
  citasHoy: number = 0;
  alertas: number = 0;

  // Estadísticas adicionales que el HTML espera
  pacientesConAlertas: number = 0;
  embarazosAvanzados: number = 0;
  pacientesJovenes: number = 0;

  // Listas de pacientes
  pacientesRecientes: any[] = [];
  pacientesPrioritarios: any[] = [];
  pacientesFiltrados: any[] = [];
  proximosControles: any[] = [];
  
  // Usuario actual
  usuarioActual: any = null;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private jsonStorage: JsonStorageService
  ) {}

  async ngOnInit() {
    await this.cargarDashboard();
  }

  async cargarDashboard() {
    try {
      // Cargar usuario actual
      this.usuarioActual = await this.jsonStorage.getData('usuarioActual');
      
      if (!this.usuarioActual || this.usuarioActual.tipo !== 'medico') {
        await this.mostrarAlerta('Error', 'No tienes acceso a esta página');
        this.router.navigate(['/login-medico']);
        return;
      }

      // Cargar pacientes
      const pacientes = await this.jsonStorage.getData('registrosMadres') || [];
      
      // Calcular todas las estadísticas
      this.calcularEstadisticas(pacientes);
      
      // Preparar listas de pacientes
      this.prepararListasPacientes(pacientes);

      console.log('📊 Dashboard cargado completamente');

    } catch (error) {
      console.error('Error cargando dashboard:', error);
      await this.mostrarAlerta('Error', 'Error al cargar el dashboard');
    }
  }

  private calcularEstadisticas(pacientes: any[]) {
    this.totalPacientes = pacientes.length;
    this.pacientesActivos = pacientes.filter((p: any) => p.activo !== false).length;
    
    // Estadísticas adicionales
    this.pacientesConAlertas = pacientes.filter((p: any) => 
      parseInt(p.semanaGestacion) > 35 || 
      parseInt(p.edad) > 40 ||
      p.presionArterial?.includes('140') ||
      p.alergias?.length > 0
    ).length;

    this.embarazosAvanzados = pacientes.filter((p: any) => 
      parseInt(p.semanaGestacion) > 28
    ).length;

    this.pacientesJovenes = pacientes.filter((p: any) => 
      parseInt(p.edad) < 25
    ).length;

    // Simular datos
    this.citasHoy = Math.floor(Math.random() * 5) + 1;
    this.alertas = this.pacientesConAlertas;
  }

  private prepararListasPacientes(pacientes: any[]) {
    // Pacientes recientes (últimos 5)
    this.pacientesRecientes = pacientes
      .sort((a: any, b: any) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime())
      .slice(0, 5);

    // Pacientes prioritarios (con alertas)
    this.pacientesPrioritarios = pacientes
      .filter((p: any) => parseInt(p.semanaGestacion) > 35 || parseInt(p.edad) > 40)
      .slice(0, 3);

    // Todos los pacientes para la lista filtrada
    this.pacientesFiltrados = pacientes;

    // Próximos controles (simulado)
    this.proximosControles = pacientes.slice(0, 3).map((p: any) => ({
      ...p,
      fecha: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      tipo: 'Control prenatal'
    }));

    // Agregar alertas y FPP a los pacientes
    this.pacientesPrioritarios = this.pacientesPrioritarios.map((p: any) => ({
      ...p,
      alertas: this.generarAlertasPaciente(p),
      fpp: this.calcularFPP(p.semanaGestacion)
    }));

    this.pacientesFiltrados = this.pacientesFiltrados.map((p: any) => ({
      ...p,
      alertas: this.generarAlertasPaciente(p),
      fpp: this.calcularFPP(p.semanaGestacion)
    }));
  }

  private generarAlertasPaciente(paciente: any): string[] {
    const alertas = [];
    if (parseInt(paciente.semanaGestacion) > 35) alertas.push('Embarazo avanzado');
    if (parseInt(paciente.edad) > 40) alertas.push('Edad materna avanzada');
    if (paciente.presionArterial?.includes('140')) alertas.push('Presión elevada');
    return alertas;
  }

  private calcularFPP(semanaGestacion: string): string {
    if (!semanaGestacion) return 'No calculada';
    const semanas = parseInt(semanaGestacion);
    const fechaActual = new Date();
    const fpp = new Date(fechaActual);
    fpp.setDate(fechaActual.getDate() + ((40 - semanas) * 7));
    return fpp.toLocaleDateString();
  }

  // Métodos que el HTML espera
  crearDatosPruebaAutomaticamente() {
    this.cargarDatosPrueba();
  }

  obtenerColorAlerta(cantidadAlertas: number): string {
    if (cantidadAlertas > 2) return 'danger';
    if (cantidadAlertas > 0) return 'warning';
    return 'success';
  }

  verDetalleRapido(paciente: any) {
    this.mostrarAlerta('Detalle Rápido', 
      `Paciente: ${paciente.nombre}\nEdad: ${paciente.edad}\nSemana: ${paciente.semanaGestacion}\nTel: ${paciente.telefono}`);
  }

  navegarAHerramientas() {
    this.verHerramientas();
  }

  navegarAGestionPacientes() {
    this.verPacientes();
  }

  // Métodos de navegación existentes
  verPacientes() {
    this.router.navigate(['/pacientes']);
  }

  verHistorial() {
    this.router.navigate(['/historial']);
  }

  verHerramientas() {
    this.router.navigate(['/herramientas-medicas']);
  }

  async cerrarSesion() {
    try {
      await this.jsonStorage.saveData('usuarioActual', null);
      await this.mostrarAlerta('Sesión cerrada', 'Has cerrado sesión correctamente');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  }

  verDetallePaciente(paciente: any) {
    this.mostrarAlerta('Paciente', `Ver detalles de ${paciente.nombre}`);
  }

  // Método para cargar datos de prueba
  async cargarDatosPrueba() {
    try {
      const pacientesPrueba = [
        {
          id: '1',
          nombre: 'María González',
          email: 'maria@test.com',
          edad: '28',
          semanaGestacion: '24',
          telefono: '123456789',
          presionArterial: '120/80',
          grupoSanguineo: 'A+',
          alergias: 'Ninguna',
          enfermedadesCronicas: 'Ninguna',
          tipo: 'madre',
          activo: true,
          fechaRegistro: new Date().toISOString()
        },
        {
          id: '2', 
          nombre: 'Ana López',
          email: 'ana@test.com',
          edad: '32',
          semanaGestacion: '36',
          telefono: '987654321',
          presionArterial: '118/76',
          grupoSanguineo: 'O+',
          alergias: 'Penicilina',
          enfermedadesCronicas: 'Ninguna',
          tipo: 'madre',
          activo: true,
          fechaRegistro: new Date().toISOString()
        }
      ];

      await this.jsonStorage.saveData('registrosMadres', pacientesPrueba);
      await this.mostrarAlerta('Datos de prueba', 'Pacientes de prueba cargados correctamente');
      await this.cargarDashboard();

    } catch (error) {
      console.error('Error cargando datos prueba:', error);
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
}
