import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../_models/user';
import { Role } from '../_models/role';
import { UserService } from '../_services/user.service';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
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
    createdDate: new Date()
  };
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private us: UserService
  ) {

  }

  ngOnInit() { }

  cancel() {
    this.router.navigate(['user/get-all']);
  }

  // scroll browser to element id
  forceElementView(id: string) {
    const element = document.getElementById(id);
    element.scrollIntoView();
  }

  createUser(usrForm: NgForm) {

    if (this.user.username === null) {
      this.errorMsg = 'Username is required.';
      this.forceElementView('bottom');
      return;
    }
    this.user.username = this.user.username.trim();
    if (this.user.username.length === 0) {
      this.errorMsg = 'Username is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.user.password === null) {
      this.errorMsg = 'Password is required.';
      this.forceElementView('bottom');
      return;
    }
    this.user.password = this.user.password.trim();
    if (this.user.password.length === 0) {
      this.errorMsg = 'Password is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.user.firstname === null) {
      this.errorMsg = 'Firstname is required.';
      this.forceElementView('bottom');
      return;
    }
    this.user.firstname = this.user.firstname.trim();
    if (this.user.firstname.length === 0) {
      this.errorMsg = 'Firstname is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.user.lastname === null) {
      this.errorMsg = 'Lastname is required.';
      this.forceElementView('bottom');
      return;
    }
    this.user.lastname = this.user.lastname.trim();
    if (this.user.lastname.length === 0) {
      this.errorMsg = 'Lastname is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.user.role === null) {
      this.errorMsg = 'Role is required.';
      this.forceElementView('bottom');
      return;
    }
    // this.user.username = this.user.username.trim();
    // if (this.user.username.length === 0) {
    //   this.errorMsg = 'Username is required.';
    //   this.forceElementView('bottom');
    //   return;
    // }

    if (this.user.email === null) {
      this.errorMsg = 'Email is required.';
      this.forceElementView('bottom');
      return;
    }
    this.user.email = this.user.email.trim();
    if (this.user.email.length === 0) {
      this.errorMsg = 'Email is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.user.mobile === null) {
      this.errorMsg = 'Mobile is required.';
      this.forceElementView('bottom');
      return;
    }
    this.user.mobile = this.user.mobile.trim();
    if (this.user.mobile.length === 0) {
      this.errorMsg = 'Mobile is required.';
      this.forceElementView('bottom');
      return;
    }

    this.us.registerUser(this.user)
      .then(res => {
        this.router.navigate(['user/get-all']);
      })
      .catch(err => {
        this.errorMsg = err.status + ': ' + err.statusText;
        this.forceElementView('bottom');
      });
  }
}


