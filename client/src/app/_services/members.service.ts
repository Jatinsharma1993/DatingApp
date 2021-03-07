import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../model/member';
import { PaginatedResult } from '../model/Pagination';
import { User } from '../model/user';
import { UserParams } from '../model/userParams';
import { AccountService } from './account.service';
import { getPaginatedResults, getPaginationHeaders } from './paginationHelper';


@Injectable({
  providedIn: 'root'
})
export class MembersService {

  members : Member[] =  [];
  baseUrl = environment.apiUrl;
  memberCache = new Map();
  user : User;
  userParams : UserParams;
  

  constructor(private http : HttpClient , private accountServ : AccountService) {
    this.accountServ.currentUser$.pipe(take(1)).subscribe(user =>{
      this.user = user;
      console.log(this.user);
      this.userParams = new UserParams(user);
      console.log(this.userParams);
    })
   }

   getUserparams(){
     return this.userParams;
   }

   setUserParams(params : UserParams){
     this.userParams = params;
   }

   resetUserparams(){
     this.userParams = new UserParams(this.user);
     return this.userParams;
   }

  getMember(username){
    const member = [...this.memberCache.values()]
    .reduce((arr , elem) => arr.concat(elem.result), [])
    .find((member : Member) => member.username === username);

    if(member){
      return of(member);
         }
    
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member : Member){
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() =>{
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId : number){
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId : number){
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username : string){
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  getLikes(predicate : string , pageNumber , pageSize){
    let params = getPaginationHeaders(pageNumber , pageSize);
    params = params.append('predicate', predicate);
    return getPaginatedResults<Partial<Member[]>>(this.baseUrl + 'likes' , params , this.http);
  }

  getMembers(userParams : UserParams) {
    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if(response){
      return of(response);
    }
    let params = getPaginationHeaders(userParams.pageNumber , userParams.pageSize);
   
      params = params.append('minAge' , userParams.minAge.toString());
      params = params.append('maxAge' , userParams.maxAge.toString());
      params = params.append('gender' , userParams.gender);
      params = params.append('orderBy' , userParams.orderBy);
      
    return getPaginatedResults<Member[]>(this.baseUrl + 'users' , params , this.http)
    .pipe(map(response =>{
      this.memberCache.set(Object.values(userParams).join('-'), response);
      return response;
    }))
  }

  
}
