import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Specy } from '../models/specy';
import { SpeciesResponse } from '../models/species-response';

const API_URL = 'http://localhost:3000/api';

type SpeciesFilter = {
  page?: Number;
  pageSize?: Number;
  showPicture?: Number;
};

type StdObject<T> = {
  [index: string]: T;
};

@Injectable({
  providedIn: 'root',
})
export class ShroomShareApiService {
  constructor(private http: HttpClient) {}

  private setQueryParams<T>(filters: StdObject<T> | null): String {
    let url = '';
    let separator = '';
    if (filters === null) return url;
    const objectSize = Object.keys(filters).length;
    Object.entries(filters).forEach(([key, value], i) => {
      if (i === 0) url += '?';
      separator = i < objectSize - 1 ? '&' : '';
      url += `${key}=${value}${separator}`;
    });
    return url;
  }

  getSpecies$(filter?: SpeciesFilter): Observable<Specy[]> {
    const queryParams = this.setQueryParams(filter || null);
    const url = `${API_URL}/species${queryParams}`;
    return this.http.get<SpeciesResponse>(url).pipe(map((res) => res.species));
  }
}
