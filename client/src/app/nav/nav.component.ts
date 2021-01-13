import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model : any = {};
  
  loggedIn : boolean = false;

  constructor(private accService : AccountService) { }

  ngOnInit() {
  }

  login(){
    this.accService.login(this.model).subscribe(res =>{

      console.log(res);

      this.loggedIn = true;
      
    },error =>{
      console.log(error);
    });
  }

  logout(){
    this.loggedIn = false;
  }

}
