import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-user-get-curr',
  templateUrl: './user-get-curr.component.html',
  styleUrls: ['./user-get-curr.component.css']
})

export class UserGetCurrComponent implements OnInit {
  currentUser: User;
  userFromApi: User;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private us: UserService,
    private as: AuthenticationService
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

    this.us.getCurrent()
      .then(res => {
        this.userFromApi = res as User;
      })
      .catch(err => {
        this.errorMsg = err.status + ': ' + err.statusText;
        if (err.statusText.includes('Unknown')) {
          this.errorMsg += ' - Possible no connection with backend server.';
        }
        this.forceElementView('bottom');
      });

    // this.us.getCurrent().pipe(first()).subscribe(user => {
    //   // console.log('user-get.component.ngOnInit: ' + JSON.stringify({user}));
    //   this.userFromApi = user;
    // });
  }

  // scroll browser to element id
  forceElementView(id: string) {
    const element = document.getElementById(id);
    element.scrollIntoView();
  }

}
