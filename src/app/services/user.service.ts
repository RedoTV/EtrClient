import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { StudentUserEntry } from '../models/StudentUserEntry';

class UserResponse{
  status:string|null = null;
  users:User[] = [];
}

export class StudentInfo {
  user : User = new User;
  rows : StudentUserEntry[] = [];
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

  public getUserByHandle(handle : string):Observable<User[]>
  {
    return this.http.get('https://dl.gsu.by/etr/api/user/?handles=' + handle)
      .pipe(map(r => (<UserResponse>r).users))
  }

  public patchUser(user : User) : Observable<Object> {
    let userPatchJSON : string = JSON.stringify(user, 
      (key, value) => {
        switch(key) {
          case "id":
          case "handle":
          case "watch":
          case "dl_id":
          case "submissions":
          case "teams":
            return undefined;
          default:
            return value;
        }
    });
    
    return this.http.patch(`https://dl.gsu.by/etr/api/user/${user.id}`, JSON.parse(userPatchJSON));
  }

  public addUserByHandle(userHandle:string){
    this.http.post('https://dl.gsu.by/etr/api/user',{ handle:userHandle });
  }

  
  public syncWithDl(){
    return this.http.get('https://dl.gsu.by/etr/rpc/user/swdl');
  }

  public syncWithCF(users: User[]){
    users.forEach(user => this.http.get(`https://dl.gsu.by/etr/api/user/update_codeforces/${user.handle}`).subscribe(next => console.log(next)))

  }
}