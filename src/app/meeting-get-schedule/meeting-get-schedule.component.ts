import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TeamService } from '../_services/team.service';
import { MeetingService } from '../_services/meeting.service';

@Component({
  selector: 'app-meeting-get-schedule',
  templateUrl: './meeting-get-schedule.component.html',
  styleUrls: ['./meeting-get-schedule.component.css']
})
export class MeetingGetScheduleComponent implements OnInit {
  teamname = '';
  teams: any = [];
  errorMsg = '';

  constructor(
    private router: Router,
    private ms: MeetingService,
    private ts: TeamService
  ) { }

  ngOnInit() {
    this.ts.listTeams().subscribe(t => {
      this.teams = t;
    });

  }

  cancel() {
    this.router.navigate(['/']);
  }

  listMeetings(teamMeetingForm: NgForm): void {
    this.router.navigate([`meeting/schedule/${this.teamname}`]);
  }

}
