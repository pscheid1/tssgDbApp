import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from '../_services/team.service';
import { Team } from 'src/app/_models/team';
import { UserService } from '../_services/user.service';


@Component({
  selector: 'app-team-edit',
  templateUrl: './team-edit.component.html',
  styleUrls: ['./team-edit.component.css']
})
export class TeamEditComponent implements OnInit {

  team: Team = {
    _id: null,
    description: null,
    teamLead: null,
    members: null,
    zoomLink: null,
    comments: null
  }

  teamlead: any = [];
  members: any = [];
  leaderList = new Array();
  memberList = new Array();
  ul: any;
  member: string;

  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ts: TeamService,
    private us: UserService
  ) { }

  ngOnInit() {
    this.us.listUsers().subscribe(u => {
      this.ul = u;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.ul.length; i++) {
        this.member = this.ul[i].firstname + ' ' + this.ul[i].lastname;
        if (this.ul[i].role === 'Admin') {
          this.leaderList.push(this.member);
        }
        this.memberList.push(this.member);
      }
    });
    this.route.params.subscribe(params => {
      this.ts.editTeam(`${params._id}`)
        .then(res => {
          this.team = res as Team;
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
    this.router.navigate(['team']);
  }

  // post updated meeting data back to node server via meeting.service.ts update
  updateTeam(teamForm: NgForm) {
    this.errorMsg = '';
    this.ts.updateteam(this.team)
      .then(result => {
        //  the router.navigate call will cause the return data to be passed back to meeting-get.component or meeting
        this.router.navigate(['team']);
      })
      .catch(err => {
        this.errorMsg = err.status + ': ' + err.statusText;
        if ((window.location.href).indexOf('#bottom') < 0) {
          window.location.href = window.location.href + '#bottom';
        }
      });
  }
}
