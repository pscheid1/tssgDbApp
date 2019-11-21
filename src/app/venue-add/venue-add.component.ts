import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VenueService } from '../_services/venue.service';
import { Venue } from 'src/app/_models/venue';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-venue-add',
  templateUrl: './venue-add.component.html',
  styleUrls: ['./venue-add.component.css']
})
export class VenueAddComponent implements OnInit {
  venue: Venue = {
    _id: null,
    description: null,
    contact: null,
    website: null,
    calendar: null,
    address: null,
    town: null,
    location: null,
    iconimage: null
  };

  errorMsg = '';
  contactList = new Array();
  cl: any;
  member: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vs: VenueService,
    private us: UserService) {

  }

  ngOnInit() {
    this.us.listContacts().subscribe(u => {
      this.cl = u;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.cl.length; i++) {
        this.member = this.cl[i].firstname + ' ' + this.cl[i].lastname;
        this.contactList.push(this.member);
      }
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }

  // scroll browser to element id
  forceElementView(id: string) {
    const element = document.getElementById(id);
    element.scrollIntoView();
  }

  addVenue(venueForm: NgForm) {

    if (this.venue._id === null) {
      this.errorMsg = 'Venue name is required.';
      this.forceElementView('bottom');
      return;
    }
    this.venue._id = this.venue._id.trim();
    if (this.venue._id.length === 0) {
      this.errorMsg = 'Venue name is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.venue.description === null) {
      this.errorMsg = 'Description is required.';
      this.forceElementView('bottom');
      return;
    }
    this.venue.description = this.venue.description.trim();
    if (this.venue.description.length === 0) {
      this.errorMsg = 'Description is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.venue.contact === null) {
      this.errorMsg = 'Venue contact is required.';
      this.forceElementView('bottom');
      return;
    }
    this.venue.contact = this.venue.contact.trim();
    if (this.venue.contact.length === 0) {
      this.errorMsg = 'Venue contact is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.venue.website === null) {
      this.errorMsg = 'Venue website url is required.';
      this.forceElementView('bottom');
      return;
    }
    this.venue.website = this.venue.website.trim();
    if (this.venue.website.length === 0) {
      this.errorMsg = 'Venue website url is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.venue.calendar === null) {
      this.errorMsg = 'Venue calendar url is required.';
      this.forceElementView('bottom');
      return;
    }
    this.venue.calendar = this.venue.calendar.trim();
    if (this.venue.calendar.length === 0) {
      this.errorMsg = 'Venue calendar url is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.venue.address === null) {
      this.errorMsg = 'Venue address is required.';
      this.forceElementView('bottom');
      return;
    }
    this.venue.address = this.venue.address.trim();
    if (this.venue.address.length === 0) {
      this.errorMsg = 'Venue address is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.venue.town === null) {
      this.errorMsg = 'Venue town is required.';
      this.forceElementView('bottom');
      return;
    }
    this.venue.town = this.venue.town.trim();
    if (this.venue.town.length === 0) {
      this.errorMsg = 'Venue town is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.venue.location === null) {
      this.errorMsg = 'Venue location (map url) is required.';
      this.forceElementView('bottom');
      return;
    }
    this.venue.location = this.venue.location.trim();
    if (this.venue.location.length === 0) {
      this.errorMsg = 'Venue location (map url) is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.venue.iconimage === null) {
      this.errorMsg = 'Venue image path/file are required.';
      this.forceElementView('bottom');
      return;
    }
    this.venue.iconimage = this.venue.iconimage.trim();
    if (this.venue.iconimage.length === 0) {
      this.errorMsg = 'Venue image path/file are required.';
      this.forceElementView('bottom');
      return;
    }

    this.errorMsg = '';
    this.vs.addVenue(this.venue)
      .then(res => {
        this.router.navigate(['venue']);
      })
      .catch(err => {
        this.errorMsg = err.status + ': ' + err.statusText;
        this.forceElementView('bottom');
      });
  }
}
