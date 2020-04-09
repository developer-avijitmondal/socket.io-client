import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { RegisterService } from '../services/register.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @ViewChild('f', { static: true })myForm: NgForm;
  errorMessage:any;
  serverValidateError:any;
  model: any = {};
  name:string;
  email:string;
  password:string;

  constructor(private _regService:RegisterService,private flashMessage: FlashMessagesService) { }

  onSubmit(){
    this._regService.regsterUser(this.model).subscribe(res =>{
      console.log(res);

      if(res.error == false){
        this.myForm.resetForm();
        this.flashMessage.show(res.result, 
          { cssClass: 'alert-'+res.type, timeout: 2000 });
      }else{
        this.flashMessage.show(res.result, 
        { cssClass: 'alert-'+res.type, timeout: 2000 });
      }
    },
    error=>{
      console.log(error);
      this.flashMessage.show(error.error.result,{ cssClass: 'alert-'+error.error.type, timeout: 2000 });
      this.errorMessage = error;
      if(this.errorMessage.error.errors!=undefined){
        this.serverValidateError=this.errorMessage.error.errors;
        console.log(this.serverValidateError);
        for(var i = 0;i<this.serverValidateError.length;i++) { 
          console.log(this.serverValidateError[i].param) 
          console.log(this.serverValidateError[i].msg) 
        }
      }
    });
    
  }

  ngOnInit() {
  }

}
