import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MeetingService } from '../_services/meeting.service';
import { Meeting } from 'src/app/_models/meeting';
import { VenueService } from '../_services/venue.service';
import { TeamService } from '../_services/team.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';


@Component({
  selector: 'app-meeting-add',
  templateUrl: './meeting-add.component.html',
  styleUrls: ['./meeting-add.component.css']
})

export class MeetingAddComponent implements OnInit {

  datePickerConfig: Partial<BsDatepickerConfig>;

  meeting: Meeting = {
    _id: null,
    team: null,
    venue: null,
    meetingDate: null,
    startTime: null,
    endTime: null,
    comments: null
  };

  // newMeeting: Meeting = {
  //   _id: null,
  //   team: null,
  //   venue: null,
  //   meetingDate: null,
  //   startTime: null,
  //   endTime: null,
  //   comments: null
  // };

  hstep = 1;
  mstep = 15;
  sstep = 10;

  venues: any = [];
  teams: any = [];
  errorMsg = '';

  constructor(
    private router: Router,
    private ms: MeetingService,
    private vs: VenueService,
    private ts: TeamService
  ) {
    this.datePickerConfig = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      minDate: new Date(),              // prevent scheduling prior to current date
      dateInputFormat: 'YYYY-MM-DD'
    });

  }

  ngOnInit() {
    this.vs.listVenues().subscribe(v => {
      this.venues = v;
    });
    this.ts.listTeams().subscribe(t => {
      this.teams = t;
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

  addMeeting(meetingForm: NgForm): void {

    if (this.meeting._id === null) {
      this.errorMsg = 'Meeting Id is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.meeting.team === null) {
      this.errorMsg = 'Meeting Team is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.meeting.venue === null) {
      this.errorMsg = 'Meeting Venue is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.meeting.meetingDate === null) {
      this.errorMsg = 'Meeting meetingDate is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.meeting.startTime === null) {
      this.errorMsg = 'Meeting startTime is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.meeting.endTime === null) {
      this.errorMsg = 'Meeting endTime is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.meeting.comments === null) {
      this.errorMsg = 'A Comments entry is required.';
      this.forceElementView('bottom');
      return;
    }
    this.meeting.comments = this.meeting.comments.trim();
    if (this.meeting.comments.length === 0) {
      this.errorMsg = 'A Comments entry is required.';
      this.forceElementView('bottom');
      return;
    }

    let hours = this.meeting.startTime.getHours();
    if (hours < 0 || hours > 23) {
      this.errorMsg = 'Invalid meeting startTime. Hours must be 0 thru 23.';
      this.forceElementView('bottom');
      return;
    }

    let minutes = this.meeting.startTime.getMinutes();
    if (minutes !== 0 && minutes !== 15 && minutes !== 30 && minutes !== 45) {
      this.errorMsg = 'Invalid meeting startTime. Minutes must be 00, 15, 30 or 45.';
      this.forceElementView('bottom');
      return;
    }

    hours = this.meeting.endTime.getHours();
    if (hours < 0 || hours > 23) {
      this.errorMsg = 'Invalid meeting endTime. Hours must be 0 thru 23.';
      this.forceElementView('bottom');
      return;
    }

    minutes = this.meeting.endTime.getMinutes();
    if (minutes !== 0 && minutes !== 15 && minutes !== 30 && minutes !== 45) {
      this.errorMsg = 'Invalid meeting endTime. Minutes must be 00, 15, 30 or 45.';
      this.forceElementView('bottom');
      return;
    }

    if (this.meeting.endTime <= this.meeting.startTime) {
      this.errorMsg = 'Meeting endTime must be > meeting startTime';
      this.forceElementView('bottom');
      return;
    }

    if (this.meeting.meetingDate < new Date()) {
      this.errorMsg = 'Cannot create a meeting in the past.';
      this.forceElementView('bottom');
      return;
    }

    this.errorMsg = '';
    this.ms.addMeeting(this.meeting)
      .then(res => {
        this.router.navigate(['meeting']);
      })
      .catch(err => {
        this.errorMsg = err.status + ': ' + err.statusText;
      });

    if (this.errorMsg !== '') {
      this.forceElementView('bottom');
    }
  }
}
