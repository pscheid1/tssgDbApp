import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication.service';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  currentUser: User;
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

  // for input fields there is no 'enabled' attribute, only
  // disabled.  status is used to trigger the 'disabled' attribute,
  // therefore to enable the field we need to set status to false and
  // to disable the field we need to set status to true;
  state: boolean;
  enabled = false;
  disabled = true;
  errorMsg = '';
  dspCreatedDate = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private as: AuthenticationService,
    private us: UserService
  ) {
    this.currentUser = this.as.currentUserValue;
  }

  ngOnInit() {
    // if (this.route.snapshot.data.type === 'authDenied') {
    //   this.errorMsg = 'User is not authorized for this request.';
    // } else {
    //   this.errorMsg = '';
    // }

    this.errorMsg = '';

    // user-edit.component is called by both user-get.component and user-get-all.component
    // user-get-all.component has role admin and can change the role of any account
    // user-edit.component has role user and can not change the role of any account, even it's own
    // based on the current user role we enable/disable the role input fields
    // get the role of the current user
    this.state = (this.currentUser.role === 'Admin') ? this.enabled : this.disabled;
    // get the getElementById of each role input field and enable/disable the input fields
    let roleInput: any = document.getElementById('r1');
    roleInput.disabled = this.state;
    roleInput = document.getElementById('r2');
    roleInput.disabled = this.state;
    roleInput = document.getElementById('r3');
    roleInput.disabled = this.state;

    // this.route.params.forEach(function (item) { });
    this.route.params.subscribe(params => {
      this.us.getById(`${params._id}`)
        .then(user => {
          const usr = user as User;
          if (usr.createdDate) {
            this.dspCreatedDate = usr.createdDate.toString().substring(0, 10);
          }
          this.user = user as User;
        })
        .catch(err => {
          this.errorMsg = err.status + ': ' + err.statusText;
          if (err.statusText.includes('Unknown')) {
            this.errorMsg += ' - Possible no connection with backend server.';
          }
          if ((window.location.href).indexOf('#bottom') < 0) {
            window.location.href = window.location.href + '#bottom';
          }
        });
    });

  }

  cancel() {
    if (this.route.snapshot.data.type === 'get-all') {
      this.router.navigate(['user/get-all']);
    } else {
      this.router.navigate(['user/get']);
    }
  }

  // scroll browser to element id
  forceElementView(id: string) {
    const element = document.getElementById(id);
    element.scrollIntoView();
  }

  updateUser(userForm: any) {

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

    // if (this.user.password === null) {
    //   this.errorMsg = 'Password is required.';
    //   this.forceElementView('bottom');
    //   return;
    // }
    // this.user.password = this.user.password.trim();
    // if (this.user.password.length === 0) {
    //   this.errorMsg = 'Password is required.';
    //   this.forceElementView('bottom');
    //   return;
    // }

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

    this.us.updateUser(this.user)
      .then(res => {
        if (this.route.snapshot.data.type === 'get-all') {
          this.router.navigate(['user/get-all']);
        } else {
          this.router.navigate(['user/get']);
        }
      })
      .catch(err => {
        this.errorMsg = err;
        this.forceElementView('bottom');
      });
  }
}


