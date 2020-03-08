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
  ) { }

  ngOnInit() { }

  cancel() {
    this.router.navigate(['user/get-all']);
  }

  // scroll browser to element id
  forceElementView(id: string) {
    const element = document.getElementById(id);
    element.scrollIntoView();
  }

  // we use .trim() to test for an entry of one or more spaces.
  // we do not need to forward this result for non zero length
  // fields as the user database schema will force a trim when
  // specified. the trim() test is only needed for 'required'
  // fields because the angular code treats a field of all
  // spaces a valid string.

  createUser(usrForm: NgForm) {

    if (!this.user.username || this.user.username.trim().length === 0) {
      this.errorMsg = 'Username is required.';
      this.forceElementView('bottom');
      return;
    }

    if (!this.user.password || this.user.password.trim().length === 0) {
      this.errorMsg = 'Password is required.';
      this.forceElementView('bottom');
      return;
    }

    // should we trim passwords?
    // does database schema trim passwords.
    // probably not and the hash is created before
    // it is storred. So I would say yes.'
    if (this.user.password) {
      this.user.password = this.user.password.trim();
    }

    if (!this.user.role || this.user.role.trim().length === 0) {
      this.errorMsg = 'Role is required.';
      this.forceElementView('bottom');
      return;
    }

    if (!this.user.firstname || this.user.firstname.trim().length === 0) {
      this.errorMsg = 'Firstname is required.';
      this.forceElementView('bottom');
      return;
    }

    if (!this.user.lastname || this.user.lastname.trim().length === 0) {
      this.errorMsg = 'Lastname is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.user.email && this.user.email.trim().length !== 0) {
      const valid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.user.email);
      // console.error('user-edit.component.updateUser.email valid: ' + valid);
      if (!valid) {
        this.errorMsg = 'Invalid email entry.';
        this.forceElementView('bottom');
        return;
      }
    }

    // a mobile number can consist of any number of digits ( ) . -  + and
    // space characters. +1(123)-456-7890 or 123 456 7890 or 123.456.7890 for example.
    // an empty entry or all spaces is valid.
    // [0123456789 ()-.]'
    if (this.user.mobile) {
      const notValid = /[^0123456789 ()-.]/.test(this.user.mobile);
      // console.error('user-edit.component.updateUser notValid: ' + notValid);
      if (notValid) {
        this.errorMsg = 'A Mobile number must contain only digits, spaces, parentheses, pluses, hyphens and periods.';
        this.forceElementView('bottom');
        return;
      }
    }

    // none of the other entries are requied, therefore
    // no validation is required.
    // any entries will be trimmed by the database if
    // requested in the schema.

    // Nothing needed for Status
    // Nothing needed for Date Created

    this.us.registerUser(this.user)
      .then(res => {
        this.router.navigate(['user/get-all']);
      })
      .catch(err => {
        // console.log('user.edit.component.updatUser.err: ' + err);
        // console.log('user.edit.component.updatUser.err.name: ' + err.name);
        // console.log('user.edit.component.updatUser.err.message: ' + err.message);
        this.errorMsg = err.message;
        this.forceElementView('bottom');
      });
  }
}


