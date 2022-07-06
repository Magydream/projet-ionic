import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FilmService} from '../services/film.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-filminfo',
  templateUrl: './filminfo.page.html',
  styleUrls: ['./filminfo.page.scss'],
})
export class FilminfoPage implements OnInit {
film =null;
imageUrl = environment.images;
  constructor(
    private route: ActivatedRoute,
    private filmService: FilmService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    //récupère l'id de la réponse
    this.filmService.getMovieDetails(id).subscribe((res)=>{
      console.log(res);
      this.film = res;
    });
  }
  openHomePage(){
    window.open(this.film.homepage);
  }

}
