import {Component, OnInit} from '@angular/core';
import {FilmService} from '../services/film.service';
import {InfiniteScrollCustomEvent, LoadingController} from '@ionic/angular';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-films',
  templateUrl: 'film.page.html',
  styleUrls: ['film.page.scss']
})
export class FilmPage implements OnInit{
  //On ajoute un tableau vide
  movies = [];
  currentPage = 1;
  imageUrl = environment.images;

  constructor(private filmService: FilmService,private loadingCtrl: LoadingController) {}

  ngOnInit(): void {
   this.loadMovies();
  }
async loadMovies(event?) {
    //création du logo de chargement
  const loading = await this.loadingCtrl.create({
    message: 'Patientez ...',
    spinner: 'bubbles',
  });
  await loading.present();

  this.filmService.getTopRatedMovies(this.currentPage).subscribe((res) => {
    loading.dismiss();
    //ajout des nouveaux objets au tableau avec l'opérateur de propagation
    this.movies.push (...res.results);
    console.log(res);
    event?.target.complete();
    if (event){
    event.target.disable = res.total_pages === this.currentPage;
    }
  });
}
//A l'appel de la fonction, on incrémente la pagination afin de faire defiler plusieurs pages
loadMore(event: InfiniteScrollCustomEvent){
this.currentPage++;
this.loadMovies(event);
}
}
