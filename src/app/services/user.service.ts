import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

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

  public getAllUsers():User[]
  {
    let users:User[] = []
    this.http.get('https://dl.gsu.by/etr/api/user/')
      .pipe(map(r => (<UserResponse>r).users))
      .subscribe(res => res.forEach(x => users.push(x)));
    return users;
  }
}