import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VenueService } from '../_services/venue.service';
import { Venue } from 'src/app/_models/venue';
import { UserService } from '../_services/user.service';
@Component({
  selector: 'app-venue-edit',
  templateUrl: './venue-edit.component.html',
  styleUrls: ['./venue-edit.component.css']
})
export class VenueEditComponent implements OnInit {
  venue: Venue = {
    _id: null,
    description: null,
    contact: null,
    website: null,
    calendar: null,
    address: null,
    town: null,
    location: null,
    iconimage: null,
    photoimage: null
  };

  errorMsg = '';
  contactList = new Array();
  cl: any;
  member: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vs: VenueService,
    private us: UserService
  ) {

  }

  // get the data from the node server and display in venue-edit.component.html file
  // the params variable name is determined by path declaration using :variable in the app-routing.module.ts
  ngOnInit() {
    this.us.listContacts().subscribe(u => {
      this.cl = u;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.cl.length; i++) {
        this.member = this.cl[i].firstname + ' ' + this.cl[i].lastname;
        this.contactList.push(this.member);
      }
    });

    // this.route.params.forEach(function (item) { });
    this.route.params.subscribe(params => {
      this.vs.editVenue(`${params._id}`)
        .then(res => {
          this.venue = res as Venue;
        })
        .catch(err => {
          this.errorMsg = err.status + ': ' + err.statusText;
          if (err.statusText.includes('Unknown')) {
            this.errorMsg += ' - Possible no connection with backend server.';
          }
          this.forceElementView('bottom');
        });
    });
  }

  cancel() {
    this.router.navigate(['venue']);
  }

  // scroll browser to element id
  forceElementView(id: string) {
    const element = document.getElementById(id);
    element.scrollIntoView();
  }

  updateVenue(venueForm: any) {

    // only required entries require validation

    if (!this.venue._id || this.venue._id.trim().length === 0) {
      this.errorMsg = 'Venue name is required.';
      this.forceElementView('bottom');
      return;
    }

    // none of the other entries are requied, therefore
    // no validation is required.
    // any entries will be trimmed by the database if
    // requested in the schema.

    this.errorMsg = '';
    this.vs.updateVenue(this.venue)
      .then(res => {
        this.router.navigate(['venue']);
      })
      .catch(err => {
        this.errorMsg = err.status + ': ' + err.statusText;
        this.forceElementView('bottom');
      });
  }
}
