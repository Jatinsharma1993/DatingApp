import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model : any = {};
  

  constructor(public accntService:  AccountService,
              private router : Router){}


  ngOnInit(){
    
  }


  login(){
    this.accntService.login(this.model).subscribe(user =>{
      this.router.navigateByUrl('/members');
    })
  }

  logout(){
    this.accntService.logout();
    this.router.navigateByUrl('/');
  }

  

}
