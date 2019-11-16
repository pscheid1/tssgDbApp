import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingService } from '../_services/meeting.service';
import { Meeting } from 'src/app/_models/meeting';
import { VenueService } from '../_services/venue.service';
import { TeamService } from '../_services/team.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-meeting-edit',
  templateUrl: './meeting-edit.component.html',
  styleUrls: ['./meeting-edit.component.css']
})
export class MeetingEditComponent implements OnInit {

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

  initialTeam = '';

  hstep = 1;
  mstep = 15;
  sstep = 10;

  venues: any = [];
  teams: any = [];

  typeOf = '';
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ms: MeetingService,
    private vs: VenueService,
    private ts: TeamService
  ) {
    this.datePickerConfig = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      minDate: new Date(),
      dateInputFormat: 'YYYY-MM-DD'
    });
  }

  // get the data from the node server and display in meeting-edit.component.html file
  // the params variable name is determined by path declaration using :variable in the app-routing.module.ts
  ngOnInit() {
    this.errorMsg = '';
    this.ts.listTeams().subscribe(t => {
      this.teams = t;
    });
    this.vs.listVenues().subscribe(v => {
      this.venues = v;
    });
    if (this.route.snapshot.data.type === 'schedule') {
      this.route.params.subscribe(params => {
        this.ms.editSchedule(`${params._id}`)
          .then(res => {
            this.meeting = res as Meeting;
            // save initial team in case cancel is selected and data has been modified
            this.initialTeam = this.meeting.team;
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
    } else {
      this.route.params.subscribe(params => {
        this.ms.editMeeting(`${params._id}`)
          .then(res => {
            this.meeting = res as Meeting;
            // save initial team in case cancel is selected and data has been modified
            this.initialTeam = this.meeting.team;
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
  }


  cancel() {
    //  the router.navigate call will cause the return data to be passed back to venue-get.component
    if (this.route.snapshot.data.type === 'schedule') {
      if (this.initialTeam !== '') {
        this.router.navigate([`meeting/schedule/${this.initialTeam}`]);
      } else {
        // if a page did not load, we have no initialTeam. use browser history
        history.go(-2);
      }
    } else {
      this.router.navigate(['meeting']);
    }
  }

  // post updated meeting data back to node server via meeting.service.ts update
  updateMeeting(meetingForm: NgForm) {
    // console.error('startTime: ' + this.meeting.startTime);
    // console.error('endTime: ' + this.meeting.endTime);

    let hours = this.meeting.startTime.getHours();
    if (hours < 0 || hours > 23) {
      this.errorMsg = 'Invalid meeting startTime. Hours must be 0 thru 23.';
      if ((window.location.href).indexOf('#bottom') < 0) {
        window.location.href = window.location.href + '#bottom';
      }
      return;
    }

    let minutes = this.meeting.startTime.getMinutes();
    if (minutes !== 0 && minutes !== 15 && minutes !== 30 && minutes !== 45) {
      this.errorMsg = 'Invalid meeting startTime. Minutes must be 00, 15, 30 or 45.';
      if ((window.location.href).indexOf('#bottom') < 0) {
        window.location.href = window.location.href + '#bottom';
      }
      return;
    }

    hours = this.meeting.endTime.getHours();
    if (hours < 0 || hours > 23) {
      this.errorMsg = 'Invalid meeting endTime. Hours must be 0 thru 23.';
      if ((window.location.href).indexOf('#bottom') < 0) {
        window.location.href = window.location.href + '#bottom';
      }
      return;
    }

    minutes = this.meeting.endTime.getMinutes();
    if (minutes !== 0 && minutes !== 15 && minutes !== 30 && minutes !== 45) {
      this.errorMsg = 'Invalid meeting endTime. Minutes must be 00, 15, 30 or 45.';
      if ((window.location.href).indexOf('#bottom') < 0) {
        window.location.href = window.location.href + '#bottom';
      }
      return;
    }

    if (this.meeting.endTime <= this.meeting.startTime) {
      this.errorMsg = 'Meeting endTime must be > meeting startTime';
      if ((window.location.href).indexOf('#bottom') < 0) {
        window.location.href = window.location.href + '#bottom';
      }
      return;
    }

    // if meetingDate has not been changed, it is returned as a string representing an ISO date format
    // if meetingDate has been changed, it is returned as a Date object
    // this.typeOf = Object.prototype.toString.call(this.meeting.meetingDate).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
    // console.error('typeOf = ' + this.typeOf);
    // console.log('meeting-edit.updateMeeting: meetingDate = ' + this.meeting.meetingDate);
    // this.route.params.subscribe(rtrn => {
    this.errorMsg = '';
    this.ms.updateMeeting(this.meeting)
      .then(result => {
        //  the router.navigate call will cause the return data to be passed back to meeting-get.component or meeting
        if (this.route.snapshot.data.type === 'edit') {
          this.router.navigate(['meeting']);
        } else {
          this.router.navigate([`meeting/schedule/${this.initialTeam}`]);
        }
      })
      .catch(err => {
        this.errorMsg = err.status + ': ' + err.statusText;
        if ((window.location.href).indexOf('#bottom') < 0) {
          window.location.href = window.location.href + '#bottom';
        }
      });
  }
}
