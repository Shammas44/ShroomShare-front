/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Specy, SpecyResponse, SpeciesResponse, SpeciesFilter } from '../models/species';
import { environment } from 'src/environments/environment';
import {
  Mushroom,
  MushroomsResponse,
  MushroomResponse,
  PaginatedMushroomsResponse,
  MushroomsFilter,
  AddMushroomRequest,
  ModifyMushroomRequest,
} from '../models/mushrooms';
import { Response, CountResponse } from '../models/response';
import {
  AddUserRequest,
  ModifyUserRequest,
  User,
  UserFilter,
  UserResponse,
  UsersResponse,
  PaginatedUsersResponse,
} from '../models/users';
import { PaginatedSpeciesResponse } from '../models/species';

const API_URL = environment.apiUrl;

type StdObject<T> = {
  [index: string]: T;
};

@Injectable({
  providedIn: 'root',
}) // eslint-disable-line
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

  getSpecies$(filter?: SpeciesFilter): Observable<PaginatedSpeciesResponse> {
    const queryParams = this.setQueryParams(filter || null);
    const url = `${API_URL}/species${queryParams}`;
    return this.http.get<PaginatedSpeciesResponse>(url);
  }

  countSpecies$(): Observable<CountResponse> {
    const url = `${API_URL}/species?count=true`;
    return this.http.get<CountResponse>(url);
  }

  getSpecy$(specyId: String): Observable<Specy> {
    const url = `${API_URL}/species:${specyId}`;
    return this.http.get<SpecyResponse>(url).pipe(map((res) => res.specy));
  }

  getMushrooms$(filter?: MushroomsFilter): Observable<PaginatedMushroomsResponse> {
    const queryParams = this.setQueryParams(filter || null);
    const url = `${API_URL}/mushrooms${queryParams}`;
    return this.http.get<PaginatedMushroomsResponse>(url);
  }

  addMushroom$(body: AddMushroomRequest): Observable<Mushroom[]> {
    const url = `${API_URL}/mushrooms`;
    return this.http.post<MushroomsResponse>(url, body).pipe(map((res) => res.mushrooms));
  }

  deleteMushroom$(mushroomId: String): Observable<String> {
    const url = `${API_URL}/mushrooms:${mushroomId}`;
    return this.http.delete<Response>(url).pipe(map((res) => res.message));
  }

  modifyMushroom$(mushroomId: String, body: ModifyMushroomRequest): Observable<Mushroom> {
    const url = `${API_URL}/mushrooms:${mushroomId}`;
    return this.http.patch<MushroomResponse>(url, body).pipe(map((res) => res.mushroom));
  }

  getUsers$(filter?: UserFilter): Observable<PaginatedUsersResponse> {
    const queryParams = this.setQueryParams(filter || null);
    const url = `${API_URL}/users${queryParams}`;
    return this.http.get<PaginatedUsersResponse>(url);
  }

  getUser$(userId: String): Observable<User> {
    const url = `${API_URL}/users:${userId}`;
    return this.http.get<UserResponse>(url).pipe(map((res) => res.user));
  }

  addUser$(body: AddUserRequest): Observable<User> {
    const url = `${API_URL}/users`;
    return this.http.post<UserResponse>(url, body).pipe(map((res) => res.user));
  }

  modifyUser$(body: ModifyUserRequest): Observable<User> {
    const url = `${API_URL}/users`;
    return this.http.patch<UserResponse>(url, body).pipe(map((res) => res.user));
  }

  deleteUser$(userId: String): Observable<String> {
    const url = `${API_URL}/users:${userId}`;
    return this.http.delete<UserResponse>(url).pipe(map((res) => res.message));
  }
}
