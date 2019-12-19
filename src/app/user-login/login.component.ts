import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../_models/user';
import { Role } from '../_models/role';
import { UserService } from '../_services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  user: User = {
    _id: null,
    username: null,
    password: null,
    firstname: null,
    lastname: null,
    role: null,
    email: null,
    mobile: null,
    inActive: false,
    createdDate: null
  };

  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private us: UserService,
    private as: AuthenticationService
  ) {
    // // redirect to home if already logged in
    // if (this.as.currentUserValue) {
    //   this.router.navigate(['home']);
    // }
  }


  ngOnInit() {
    // redirect to home if already logged in
    if (this.as.currentUserValue) {
      this.router.navigate(['home']);
    }
  }

  onSubmit(usrForm: NgForm): void {
    // console.log('login.component.onSubmit: ' + usrForm.value);
    // console.log('login.component.onSubmit: ' + this.user.username);
    this.as.login(this.user.username, this.user.password)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['home']);
        },
        error => {
          this.errorMsg = error.includes('Unknown') ? error +
            ' - Possible no connection with backend server.' : error;
          this.forceElementView('bottom');
        });
  }

  // scroll browser to element id
  forceElementView(id: string) {
    const element = document.getElementById(id);
    element.scrollIntoView();
  }

}
