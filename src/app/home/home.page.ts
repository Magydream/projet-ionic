import {Component} from '@angular/core';
import {AvatarService} from '../services/avatar.service';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {AlertController, LoadingController} from '@ionic/angular';
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
profile = null;
  constructor(
    private avatarService: AvatarService,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) {
    this.avatarService.getUserProfile().subscribe((data)=>{
      this.profile = data;
    });
  }
async logout(){
    await this.authService.logout();
    await this.router.navigateByUrl('/login', {replaceUrl: true});
}
async changeImage(){
    const image = await Camera.getPhoto({
      quality:90,
      allowEditing:false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
  if (image){
    const loading = await this.loadingController.create();
    await loading.present();

    const result = await this.avatarService.uploadImage(image);
    await loading.dismiss();
    if(!result){
      const alert = await this.alertController.create({
        header: 'le téléchargement a échoué',
        message:'un problème est survenu lors du téléchargement de votre avatar.',
        buttons:['OK'],
      });
      await alert.present();
    }
  }
}
}
