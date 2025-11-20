import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButton,
  IonBadge,
  IonNote,
  IonList,
  IonSelect,
  IonSelectOption,
  IonSearchbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonAlert,
  IonGrid,
  IonRow,
  IonCol,
  ModalController,
  IonIcon
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { JsonStorageService } from '../services/json-storage.service';
import { AgregarPacienteComponent } from '../components/agregar-paciente/agregar-paciente.component';

interface MadreRegistrada {
  id: number;
  nombre: string;
  email: string;
  edad: number | null;
  semanaGestacion: number | null;
  telefono: string;
  presionArterial: string;
  grupoSanguineo: string;
  alergias: string;
  enfermedadesCronicas: string;
  fechaRegistro: string;
  fpp: string;
  alertas: string[];
  activo?: boolean;
  tipo?: string;
  sincronizado?: boolean;
}

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.page.html',
  styleUrls: ['./pacientes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonButton,
    IonBadge,
    IonNote,
    IonList,
    IonSelect,
    IonSelectOption,
    IonSearchbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonAlert,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon
  ]
})
export class PacientesPage implements OnInit {
  madresRegistradas: MadreRegistrada[] = [];
  pacientesFiltrados: MadreRegistrada[] = [];
  
  // Filtros adicionales que el HTML espera
  busqueda: string = '';
  filtroEdad: string = 'todos';
  filtroSemanas: string = 'todos';
  filtroAlerta: string = 'todos';
  
  // Estadísticas
  totalPacientes: number = 0;
  pacientesConAlertas: number = 0;
  
  // Control de alertas
  mostrarAlertaEliminar: boolean = false;
  pacienteAEliminar: MadreRegistrada | null = null;
  alertaButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => this.cancelarEliminar()
    },
    {
      text: 'Eliminar',
      role: 'destructive',
      handler: () => this.eliminarPaciente()
    }
  ];

  constructor(
    private alertController: AlertController,
    private jsonStorage: JsonStorageService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    await this.cargarPacientes();
  }

  async cargarPacientes() {
    try {
      const datos = await this.jsonStorage.getData('registrosMadres');
      if (datos) {
        this.madresRegistradas = datos;
        this.aplicarFiltros();
        this.calcularEstadisticas();
      }
    } catch (error) {
      console.error('Error cargando pacientes:', error);
    }
  }

  aplicarFiltros() {
    this.pacientesFiltrados = this.madresRegistradas.filter(madre => {
      // Filtro por búsqueda de texto
      const coincideBusqueda = !this.busqueda || 
        madre.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        madre.telefono.includes(this.busqueda);
      
      // Filtro por edad
      const coincideEdad = this.filtroEdad === 'todos' ||
        (this.filtroEdad === 'menor-25' && (madre.edad || 0) < 25) ||
        (this.filtroEdad === '25-35' && (madre.edad || 0) >= 25 && (madre.edad || 0) <= 35) ||
        (this.filtroEdad === 'mayor-35' && (madre.edad || 0) > 35);
      
      // Filtro por semanas
      const coincideSemanas = this.filtroSemanas === 'todos' ||
        (this.filtroSemanas === 'primer-trimestre' && (madre.semanaGestacion || 0) <= 13) ||
        (this.filtroSemanas === 'segundo-trimestre' && (madre.semanaGestacion || 0) > 13 && (madre.semanaGestacion || 0) <= 26) ||
        (this.filtroSemanas === 'tercer-trimestre' && (madre.semanaGestacion || 0) > 26);
      
      // Filtro por alertas
      const coincideAlerta = this.filtroAlerta === 'todos' ||
        (this.filtroAlerta === 'con-alertas' && madre.alertas.length > 0) ||
        (this.filtroAlerta === 'sin-alertas' && madre.alertas.length === 0);
      
      return coincideBusqueda && coincideEdad && coincideSemanas && coincideAlerta;
    });
    
    this.calcularEstadisticas();
  }

  calcularEstadisticas() {
    this.totalPacientes = this.madresRegistradas.length;
    this.pacientesConAlertas = this.madresRegistradas.filter(m => m.alertas.length > 0).length;
  }

  onSearchChange(event: any) {
    this.busqueda = event.detail.value || '';
    this.aplicarFiltros();
  }

  onFiltroChange() {
    this.aplicarFiltros();
  }

  obtenerColorAlerta(cantidadAlertas: number): string {
    if (cantidadAlertas > 2) return 'danger';
    if (cantidadAlertas > 0) return 'warning';
    return 'success';
  }

  confirmarEliminacion(paciente: MadreRegistrada) {
    this.confirmarEliminar(paciente);
  }

  async confirmarEliminar(paciente: MadreRegistrada) {
    this.pacienteAEliminar = paciente;
    this.mostrarAlertaEliminar = true;
  }

  async eliminarPaciente() {
    if (!this.pacienteAEliminar) return;

    try {
      this.madresRegistradas = this.madresRegistradas.filter(
        madre => madre.id !== this.pacienteAEliminar!.id
      );
      
      await this.jsonStorage.saveData('registrosMadres', this.madresRegistradas);
      this.aplicarFiltros();
      
      this.mostrarAlertaEliminar = false;
      this.pacienteAEliminar = null;

      await this.mostrarAlerta('Éxito', 'Paciente eliminado correctamente');
      
    } catch (error) {
      console.error('Error eliminando paciente:', error);
      await this.mostrarAlerta('Error', 'No se pudo eliminar el paciente');
    }
  }

  cancelarEliminar() {
    this.mostrarAlertaEliminar = false;
    this.pacienteAEliminar = null;
  }

  // === MÉTODOS NUEVOS PARA AGREGAR PACIENTES ===

  async abrirModalAgregarPaciente() {
    const modal = await this.modalController.create({
      component: AgregarPacienteComponent,
      componentProps: {}
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    
    if (data?.confirmado) {
      await this.agregarPacienteManual(data.paciente);
    }
  }

  async agregarPacienteManual(pacienteData: any) {
    try {
      const nuevoPaciente: MadreRegistrada = {
        id: Date.now(),
        nombre: pacienteData.nombre,
        email: pacienteData.email,
        edad: pacienteData.edad ? parseInt(pacienteData.edad) : null,
        semanaGestacion: pacienteData.semanaGestacion ? parseInt(pacienteData.semanaGestacion) : null,
        telefono: pacienteData.telefono || '',
        presionArterial: pacienteData.presionArterial || '',
        grupoSanguineo: pacienteData.grupoSanguineo || '',
        alergias: pacienteData.alergias || '',
        enfermedadesCronicas: pacienteData.enfermedadesCronicas || '',
        fechaRegistro: new Date().toISOString(),
        fpp: this.calcularFPP(pacienteData.semanaGestacion ? parseInt(pacienteData.semanaGestacion) : 0),
        alertas: this.generarAlertasPacienteManual(pacienteData),
        activo: true,
        tipo: 'madre',
        sincronizado: false
      };

      this.madresRegistradas.unshift(nuevoPaciente);
      await this.jsonStorage.saveData('registrosMadres', this.madresRegistradas);
      this.aplicarFiltros();
      
      await this.mostrarAlerta('Éxito', 'Paciente agregado correctamente');
      
    } catch (error) {
      console.error('Error agregando paciente:', error);
      await this.mostrarAlerta('Error', 'No se pudo agregar el paciente');
    }
  }

  private generarAlertasPacienteManual(paciente: any): string[] {
    const alertas = [];
    if (parseInt(paciente.edad) > 40) alertas.push('Edad materna avanzada');
    if (parseInt(paciente.semanaGestacion) > 35) alertas.push('Embarazo avanzado');
    if (paciente.presionArterial?.includes('140')) alertas.push('Presión elevada');
    return alertas;
  }

  private calcularFPP(semanaGestacion: number): string {
    if (!semanaGestacion) return 'No calculada';
    const fechaActual = new Date();
    const fpp = new Date(fechaActual);
    fpp.setDate(fechaActual.getDate() + ((40 - semanaGestacion) * 7));
    return fpp.toLocaleDateString();
  }

  async cargarDatosPrueba() {
    try {
      const pacientesPrueba: MadreRegistrada[] = [
        {
          id: 1,
          nombre: 'María González',
          email: 'maria@test.com',
          edad: 28,
          semanaGestacion: 24,
          telefono: '123456789',
          presionArterial: '120/80',
          grupoSanguineo: 'A+',
          alergias: 'Ninguna',
          enfermedadesCronicas: 'Ninguna',
          fechaRegistro: new Date().toISOString(),
          fpp: this.calcularFPP(24),
          alertas: [],
          activo: true,
          tipo: 'madre',
          sincronizado: false
        },
        {
          id: 2,
          nombre: 'Ana López',
          email: 'ana@test.com',
          edad: 32,
          semanaGestacion: 36,
          telefono: '987654321',
          presionArterial: '118/76',
          grupoSanguineo: 'O+',
          alergias: 'Penicilina',
          enfermedadesCronicas: 'Ninguna',
          fechaRegistro: new Date().toISOString(),
          fpp: this.calcularFPP(36),
          alertas: ['Embarazo avanzado'],
          activo: true,
          tipo: 'madre',
          sincronizado: false
        }
      ];

      await this.jsonStorage.saveData('registrosMadres', pacientesPrueba);
      await this.mostrarAlerta('Datos de prueba', 'Pacientes de prueba cargados');
      await this.cargarPacientes();
      
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
