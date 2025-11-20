import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonBadge,
  IonNote,
  IonButton,
  IonInput
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

interface MadreRegistrada {
  id: number;
  nombre: string;
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
}

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonBadge, IonNote, 
    IonButton, IonInput,
    CommonModule, FormsModule, RouterLink
  ]
})
export class HistorialPage implements OnInit {
  madresRegistradas: MadreRegistrada[] = [];
  busqueda: string = '';

  constructor() { }

  ngOnInit() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    const datos = localStorage.getItem('registrosMadres');
    if (datos) {
      this.madresRegistradas = JSON.parse(datos);
    }
  }

  get madresFiltradas() {
    if (!this.busqueda) {
      return this.madresRegistradas;
    }
    
    return this.madresRegistradas.filter(madre => 
      madre.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      madre.telefono.includes(this.busqueda)
    );
  }

  eliminarRegistro(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      this.madresRegistradas = this.madresRegistradas.filter(madre => madre.id !== id);
      localStorage.setItem('registrosMadres', JSON.stringify(this.madresRegistradas));
    }
  }

  limpiarHistorial() {
    if (confirm('¿Estás seguro de que quieres eliminar TODOS los registros?')) {
      this.madresRegistradas = [];
      localStorage.removeItem('registrosMadres');
    }
  }

  getTotalRegistros(): number {
    return this.madresRegistradas.length;
  }

  getMadresConAlertas(): number {
    return this.madresRegistradas.filter(madre => madre.alertas.length > 0).length;
  }
}
