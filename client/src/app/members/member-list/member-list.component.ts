import { Component, OnInit } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/model/member';
import { Pagination } from 'src/app/model/Pagination';
import { User } from 'src/app/model/user';
import { UserParams } from 'src/app/model/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  members : Member[];
  pagination : Pagination;
  userParams : UserParams;
  user : User;
  genderList  = [{value : "male" , display : "Males"} , {value : "female" , display : "Females"}]

  constructor(private memberService : MembersService, private accountServ : AccountService) { 
    this.accountServ.currentUser$.pipe(take(1)).subscribe(user =>{
      this.user = user;
      this.userParams = new UserParams(user);
    })
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(){
    this.memberService.getMembers(this.userParams).subscribe(response =>{      
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  resetFilters(){
    this.userParams = new UserParams(this.user);
    this.loadMembers();
  }

  pageChanged(event : any){
    
    this.userParams.pageNumber = event.page;
    this.loadMembers();
  }


}
