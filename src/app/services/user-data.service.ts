import { Injectable } from '@angular/core';
import { JsonStorageService } from './json-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private readonly MADRES_KEY = 'registrosMadres';
  private readonly MEDICOS_KEY = 'medicosRegistrados';

  constructor(private jsonStorage: JsonStorageService) {}

  // ==================== MÉTODOS PARA MADRES ====================

  // Obtener todas las madres registradas
  async getMadresRegistradas(): Promise<any[]> {
    const madres = await this.jsonStorage.getData(this.MADRES_KEY);
    return madres || [];
  }

  // Guardar todas las madres
  async saveMadresRegistradas(madres: any[]): Promise<void> {
    await this.jsonStorage.saveData(this.MADRES_KEY, madres);
  }

  // Agregar una nueva madre
  async addMadre(nuevaMadre: any): Promise<void> {
    const madres = await this.getMadresRegistradas();
    
    // Agregar ID y timestamp si no existen
    const madreConMetaDatos = {
      ...nuevaMadre,
      id: nuevaMadre.id || Date.now().toString(),
      fechaRegistro: nuevaMadre.fechaRegistro || new Date().toISOString()
    };

    madres.push(madreConMetaDatos);
    await this.saveMadresRegistradas(madres);
  }

  // Buscar madre por email
  async findMadreByEmail(email: string): Promise<any | null> {
    const madres = await this.getMadresRegistradas();
    return madres.find(madre => madre.email === email) || null;
  }

  // Buscar madre por ID
  async findMadreById(id: string): Promise<any | null> {
    const madres = await this.getMadresRegistradas();
    return madres.find(madre => madre.id === id) || null;
  }

  // Actualizar datos de una madre
  async updateMadre(id: string, datosActualizados: any): Promise<void> {
    const madres = await this.getMadresRegistradas();
    const index = madres.findIndex(madre => madre.id === id);
    
    if (index !== -1) {
      madres[index] = { ...madres[index], ...datosActualizados };
      await this.saveMadresRegistradas(madres);
    }
  }

  // Eliminar una madre
  async removeMadre(id: string): Promise<void> {
    const madres = await this.getMadresRegistradas();
    const madresFiltradas = madres.filter(madre => madre.id !== id);
    await this.saveMadresRegistradas(madresFiltradas);
  }

  // ==================== MÉTODOS PARA MÉDICOS ====================

  // Obtener todos los médicos registrados
  async getMedicosRegistrados(): Promise<any[]> {
    const medicos = await this.jsonStorage.getData(this.MEDICOS_KEY);
    return medicos || [];
  }

  // Guardar todos los médicos
  async saveMedicosRegistrados(medicos: any[]): Promise<void> {
    await this.jsonStorage.saveData(this.MEDICOS_KEY, medicos);
  }

  // Agregar un nuevo médico
  async addMedico(nuevoMedico: any): Promise<void> {
    const medicos = await this.getMedicosRegistrados();
    
    const medicoConMetaDatos = {
      ...nuevoMedico,
      id: nuevoMedico.id || Date.now().toString(),
      fechaRegistro: nuevoMedico.fechaRegistro || new Date().toISOString()
    };

    medicos.push(medicoConMetaDatos);
    await this.saveMedicosRegistrados(medicos);
  }

  // Buscar médico por email
  async findMedicoByEmail(email: string): Promise<any | null> {
    const medicos = await this.getMedicosRegistrados();
    return medicos.find(medico => medico.email === email) || null;
  }

  // Validar login de médico
  async validateMedicoLogin(email: string, password: string): Promise<boolean> {
    const medico = await this.findMedicoByEmail(email);
    return medico && medico.password === password;
  }

  // Validar login de madre
  async validateMadreLogin(email: string, password: string): Promise<boolean> {
    const madre = await this.findMadreByEmail(email);
    return madre && madre.password === password;
  }

  // ==================== MÉTODOS DE DEBUG ====================

  // Ver todos los datos
  async debugShowAllData(): Promise<void> {
    console.log('=== DATOS DE USUARIOS ===');
    const madres = await this.getMadresRegistradas();
    const medicos = await this.getMedicosRegistrados();
    
    console.log('Madres registradas:', madres);
    console.log('Médicos registrados:', medicos);
  }

  // Limpiar todos los datos (solo desarrollo)
  async clearAllUserData(): Promise<void> {
    await this.jsonStorage.saveData(this.MADRES_KEY, []);
    await this.jsonStorage.saveData(this.MEDICOS_KEY, []);
    console.log('🗑️ Todos los datos de usuarios fueron limpiados');
  }
}
