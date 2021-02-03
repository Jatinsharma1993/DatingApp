import { Component, OnInit, Output ,EventEmitter} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  @Output() cancelregister = new EventEmitter<boolean>();

  registerForm : FormGroup;
  maxDate : Date;
  validationError : string[] = [];
  
  constructor(private accntService : AccountService,
              private fb : FormBuilder,
              private router : Router) { }

  ngOnInit(){
    this.InitializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  InitializeForm(){
    this.registerForm = this.fb.group({
      gender :  ['male'],
      username :  ['' , Validators.required],
      knownAs :  ['' , Validators.required],
      dateOfBirth :  ['' , Validators.required],
      city :  ['' , Validators.required],
      country :  ['' , Validators.required],
      password : ['', [Validators.required ,Validators.minLength(4) , Validators.maxLength(8)]],
      confirmPassword : ['', [Validators.required, this.matchValues('password')]]
    })
  }

  // passwordMatching(control : AbstractControl) : {isMatching : boolean} {
  //   if(control.get('password').value !== control.get('confirmPassword').value){
  //     return {isMatching : true}
  //   } 
  // }

  matchValues(matchTo : string) : ValidatorFn{
    return (control : AbstractControl) =>{
      return control?.value === control?.parent?.controls[matchTo].value ? null : {isMatching : true}
    }
  }
  

  register(){
    
    this.accntService.register(this.registerForm.value).subscribe(response =>{
      this.router.navigateByUrl('/members');
      console.log(response);
      this.cancel();
    }, error =>{
      this.validationError = error;
      
    })
  }

  cancel(){
    this.cancelregister.emit(false);
  }

}
