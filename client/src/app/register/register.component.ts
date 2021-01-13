import { Component, Input, OnInit, Output ,EventEmitter} from '@angular/core';
import { AccountService } from '../_services/account.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  @Output() cancelregister = new EventEmitter<boolean>();
  model : any = {};
  
  constructor(private accntService : AccountService) { }

  ngOnInit(): void {
  }

  register(){
    this.accntService.register(this.model).subscribe(response =>{
      console.log(response);
      this.cancel();
    }, error =>{
      console.log(error);
    })
  }

  cancel(){
    this.cancelregister.emit(false);
  }

}
