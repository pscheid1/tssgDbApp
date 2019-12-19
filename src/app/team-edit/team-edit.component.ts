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
  };

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
          this.forceElementView('bottom');
        });
    });
  }

  cancel() {
    this.router.navigate(['team']);
  }

  // scroll browser to element id
  forceElementView(id: string) {
    const element = document.getElementById(id);
    element.scrollIntoView();
  }

  updateTeam(teamForm: NgForm) {

    if (this.team._id === null) {
      this.errorMsg = 'Team name is required.';
      this.forceElementView('bottom');
      return;
    }
    this.team._id = this.team._id.trim();
    if (this.team._id.length === 0) {
      this.errorMsg = 'Team name is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.team.description === null) {
      this.errorMsg = 'Team description is required.';
      this.forceElementView('bottom');
      return;
    }
    this.team.description = this.team.description.trim();
    if (this.team.description.length === 0) {
      this.errorMsg = 'Team description is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.team.teamLead === null) {
      this.errorMsg = 'Team lead is required.';
      this.forceElementView('bottom');
      return;
    }
    this.team.teamLead = this.team.teamLead.trim();
    if (this.team.teamLead.length === 0) {
      this.errorMsg = 'Team lead is required.';
      this.forceElementView('bottom');
      return;
    }

    if (this.team.members === null) {
      this.errorMsg = 'One or more team members are required.';
      this.forceElementView('bottom');
      return;
    }
    if (this.team.members.length === 0) {
      this.errorMsg = 'One or more team members are required.';
      this.forceElementView('bottom');
      return;
    }

    this.team.zoomLink = this.team.zoomLink.trim();
    this.team.comments = this.team.comments.trim();

    this.errorMsg = '';
    this.ts.updateteam(this.team)
      .then(result => {
        this.router.navigate(['team']);
      })
      .catch(err => {
        this.errorMsg = err.status + ': ' + err.statusText;
        this.forceElementView('bottom');
      });
  }
}
