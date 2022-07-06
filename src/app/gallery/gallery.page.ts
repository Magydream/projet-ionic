import { Component } from '@angular/core';
import { PhotoService,UserPhoto } from '../services/photo.service';
import {ActionSheetController} from '@ionic/angular';

@Component({
  selector: 'app-gallery',
  templateUrl: 'gallery.page.html',
  styleUrls: ['gallery.page.scss']
})
export class GalleryPage {

  constructor(public photoService: PhotoService,
              public actionSheetController: ActionSheetController) {}
  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
  async ngOnInit() {
    await this.photoService.loadSaved();
  }
  //Ajout des btn suppression et annulation
  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Supprimer',
        role: 'destructive',
        icon: 'trash',
        //ajout de l'évènement au click afin de supprimer la photo
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Annuler',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

}
