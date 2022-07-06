import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public async deletePicture(photo: UserPhoto, position: number) {
    // Supprime la photo dans le tableau
    this.photos.splice(position, 1);

    // met a jour le tableau en écrasant le tab de photos existant
    await Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });

    // supprime la photo depuis filesystem
    const filename = photo.filepath
      .substr(photo.filepath.lastIndexOf('/') + 1);

    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data
    });
  }
  //tableau de photos qui contiendra la ref de toutes les photos prise
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';
  //récupère les infos de l'appareil
  private platform: Platform;
  constructor(platform: Platform) {
    this.platform = platform;
  }
  // prend une photo
  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    // Enregistre l'image et l'ajoute à la collection de photos
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);
    //ajoute la photo capturée au début du tableau
    this.photos.unshift({
      filepath: "soon...",
      webviewPath: capturedPhoto.webPath
    });
    //enregistre dans le tableau photos, chaque photo est stocké
    await Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }
  public async loadSaved() {
    // Récupérer les données des photos avec la clé et on récupère le tableau de photo au format JSON
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];
    //Losque l'app n'est pas hybrid
    if (!this.platform.is('hybrid')){
    for (const photo of this.photos) {
      // lie les données de toutes les photos enregistrée avec Filesystem
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data,
      });
      //charge la photo en base64
      photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }
    }
    // Affiche la photo en la lisant au format base64
  }
  private async savePicture(photo: Photo) {
    // Converti la photo au format base64 afin de l'enregistrer
    const base64Data = await this.readAsBase64(photo);

    // Écrit le fichier dans le dossier
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });
    if (this.platform.is('hybrid')) {
      ////si l'appareil detect que l'on est sur une platform hybrid affiche la new image avec le bon chemin file:// en HTTP
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else {
      //Sinon Utilisez webPath pour afficher la nouvelle image au lieu de base64 car elle est déjà en mémoire
      return {
        filepath: fileName,
        webviewPath: photo.webPath
      };
    }
  }
  private async readAsBase64(photo: Photo) {
    //si l'appareil detect que l'on est sur une platform hybrid
    if (this.platform.is('hybrid'))
    {
      //Lire les fichiers dans un format base 64
      const file = await Filesystem.readFile({
        path: photo.path
      });
      return file.data;
    }
    else {
    //Sinon récup la photo et le nom
    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    return await this.convertBlobToBase64(blob) as string;
    }

  }
  //la convertit au format base64
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}
