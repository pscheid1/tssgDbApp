import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';

import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  currentUser: User;
  userFromApi: User;
  dspCreatedDate = '';
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private us: UserService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    if (this.route.snapshot.data.type === 'authDenied') {
      this.errorMsg = 'User is not authorized for this request.';
    } else {
      this.errorMsg = '';
    }

    if (this.currentUser === null) {
      // return;
      this.router.navigate(['user/login']);
    }
    this.us.getById(this.currentUser._id)
      .then(res => {
        const usr = res as User;
        if (usr.createdDate) {
          this.dspCreatedDate = usr.createdDate.toString().substring(0, 10);
        }
        this.userFromApi = usr;
      })
      .catch(err => {
        this.errorMsg = err.status + ': ' + err.statusText;
        if (err.statusText.includes('Unknown')) {
          this.errorMsg += ' - Possible no connection with backend server.';
        }
        this.forceElementView('bottom');
      });

    // this.userService.getById(this.currentUser._id).pipe(first()).subscribe(user => {
    //   this.userFromApi = user as User;
    // });
  }

  // scroll browser to element id
  forceElementView(id: string) {
    const element = document.getElementById(id);
    element.scrollIntoView();
  }
}
