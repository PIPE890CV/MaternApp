import { Injectable } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class JsonStorageService {
  private readonly FILE_NAME = 'historial.json';
  private readonly DEFAULT_DATA = {
    usuarios: [],
    embarazos: [],
    contracciones: [],
    patadas: [],
    sintomas: [],
    citas_medicas: [],
    configuraciones: {}
  };

  constructor() {
    this.initializeStorage();
  }

  private async initializeStorage(): Promise<void> {
    try {
      await this.readFile();
      console.log('✅ Almacenamiento JSON inicializado');
    } catch (error) {
      console.log('📁 Creando archivo de almacenamiento inicial...');
    }
  }

  async saveData(key: string, data: any): Promise<void> {
    try {
      const currentData = await this.readFile();      
      currentData[key] = data;
      await this.writeFile(currentData);
      console.log('✅ Datos guardados:', key, data);
    } catch (error) {
      console.error('❌ Error guardando datos:', error);
      throw error;
    }
  }

  async getData(key: string): Promise<any> {
    try {
      const data = await this.readFile();
      return data[key] || null;
    } catch (error) {
      console.error('❌ Error leyendo datos:', error);
      return null;
    }
  }

  async getAllData(): Promise<any> {
    return await this.readFile();
  }

  private async readFile(): Promise<any> {
    try {
      const contents = await Filesystem.readFile({
        path: this.FILE_NAME,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
      
      // CORRECCIÓN: Asegurar que data sea string
      const dataString = typeof contents.data === 'string' 
        ? contents.data 
        : await this.blobToString(contents.data as Blob);
      
      return JSON.parse(dataString);
    } catch (error) {
      console.log('📁 Creando nuevo archivo de historial...');
      await this.writeFile(this.DEFAULT_DATA);
      return this.DEFAULT_DATA;
    }
  }

  // Método auxiliar para convertir Blob a string
  private async blobToString(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(blob);
    });
  }

  private async writeFile(data: any): Promise<void> {
    await Filesystem.writeFile({
      path: this.FILE_NAME,
      data: JSON.stringify(data, null, 2),
      directory: Directory.Data,
      encoding: Encoding.UTF8,
      recursive: true
    });
  }

  async debugShowData(): Promise<void> {
    const data = await this.readFile();
    console.log('📊 Datos actuales en historial.json:', data);
  }

  async clearAllData(): Promise<void> {
    await this.writeFile(this.DEFAULT_DATA);
    console.log('🗑️ Todos los datos fueron limpiados');
  }
}
