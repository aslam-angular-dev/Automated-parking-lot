import { LocalStorageService } from './../local-storage.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  public loginForm = this.formBuilder.group({
    userName: ['', Validators.required],
    mobileNumber: ['', Validators.required],
    vechicleNumber: ['', Validators.required],
    vechicleType:['',Validators.required]
  });
  selectedType: any;
  vechicles = [{
    'id': 1,
    'name': 'Car'
  },
  {
    'id': 2,
    'name': 'Bike'
  }]
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
  }
  // ngDoCheck() {
  //   console.log(this.loginForm)
  // }
  onSubmit() {
    this.localStorageService.userData.next(this.loginForm.value)
    this.router.navigate(['/booking']);
  }
}
