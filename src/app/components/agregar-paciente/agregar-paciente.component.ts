import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonTextarea, IonAlert
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-agregar-paciente',
  templateUrl: './agregar-paciente.component.html',
  styleUrls: ['./agregar-paciente.component.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
    IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
    IonTextarea
  ]
})
export class AgregarPacienteComponent {
  paciente = {
    nombre: '',
    email: '',
    edad: '',
    telefono: '',
    semanaGestacion: '',
    presionArterial: '',
    grupoSanguineo: '',
    alergias: '',
    enfermedadesCronicas: '',
    direccion: '',
    fechaUltimaMenstruacion: ''
  };

  gruposSanguineos = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  constructor(private modalController: ModalController) {}

  guardarPaciente() {
    // Validaciones básicas
    if (!this.paciente.nombre || !this.paciente.email) {
      return;
    }

    this.modalController.dismiss({
      paciente: this.paciente,
      confirmado: true
    });
  }

  cancelar() {
    this.modalController.dismiss({
      confirmado: false
    });
  }
}
