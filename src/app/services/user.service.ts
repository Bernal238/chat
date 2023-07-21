import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: IUser | null = null;

constructor() { }

saveUser(user: IUser){
  localStorage.setItem('user', JSON.stringify(user));
}

clearUser(){
  localStorage.removeItem('user');
  this.user = null;
}

getUser(): IUser | null {
if(this.user){
  return this.user;
}
const user = localStorage.getItem('user');
if(user){
  this.user = JSON.parse(user);
  return this.user;
}
return null;


}

}
