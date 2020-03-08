import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService } from 'src/app/_services/authentication.service';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

const jwtHelper = new JwtHelperService();

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      const token = currentUser.token;
      // console.error('currentUser.token: ' + token);
      // console.log('auth.guard.canActivate: token exp date = ' + jwtHelper.getTokenExpirationDate(token));
      // Check whether token is valid.  Expired, return false; otherwise return true
      if (jwtHelper.isTokenExpired(token)) {
        alert('Your JWT token has expired.\n\nTo renew your JWT token, Logout and login again.');
        this.router.navigate(['/user/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
      // check if route is restricted by role
      // console.log('auth.guard.route.data.roles: ' + route.data.roles);
      if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/user/notauthorized']);
        return false;
      }
      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/user/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
