import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

class UserResponse{
  status:string|null = null;
  users:User[] = [];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http:HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }

  public getAllUsers():Observable<User[]>
  {
    return this.http.get('https://dl.gsu.by/etr/api/user/')
      .pipe(map(r => (<UserResponse>r).users))
  }
}