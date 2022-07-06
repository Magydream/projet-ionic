import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

export interface ApiResult {
  page: number;
  results: any[];
  total_pages: number;
  total_results: number;
}
@Injectable({
  providedIn: 'root'
})
export class FilmService {

  constructor(private http: HttpClient) { }
//Appel de l'api avec Observable qui renvoie l'objet ApiResult afin de récupérer les paramètres
  getTopRatedMovies(page = 1): Observable<ApiResult>{
    return this.http.get<ApiResult>(
      `${environment.apiUrl}movie/popular?api_key=${environment.apiKey}&language=fr&page=${page}`
    );
  }
  getMovieDetails(id: string){
    return this.http.get(
      `${environment.apiUrl}movie/${id}?api_key=${environment.apiKey}&language=fr`
    );
  }
}
