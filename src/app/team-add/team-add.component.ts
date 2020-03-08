import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from '../_services/team.service';
import { Team } from 'src/app/_models/team';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-team-add',
  templateUrl: './team-add.component.html',
  styleUrls: ['./team-add.component.css']
})
export class TeamAddComponent implements OnInit {
  team: Team = {
    _id: null,
    description: null,
    teamLead: null,
    members: null,
    zoomLink: null,
    comments: null
  };

  errorMsg = '';

  leaderList = new Array();
  memberList = new Array();
  ul: any;
  member: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ts: TeamService,
    private us: UserService) {
  }

  ngOnInit() {
    // listUsers() returns all users except users with role == Contact
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
  }

  cancel() {
    this.router.navigate(['team']);
  }

  // scroll browser to element id
  forceElementView(id: string) {
    const element = document.getElementById(id);
    element.scrollIntoView();
  }

  addTeam(teamForm: NgForm) {

    if (!this.team._id || this.team._id.trim().length === 0) {
      this.errorMsg = 'Team name is required.';
      this.forceElementView('bottom');
      return;
    }

    if (!this.team.description || this.team.description.trim().length === 0) {
      this.errorMsg = 'Team description is required.';
      this.forceElementView('bottom');
      return;
    }

    if (!this.team.teamLead || this.team.teamLead.trim().length === 0) {
      this.errorMsg = 'Team lead is required.';
      this.forceElementView('bottom');
      return;
    }

    if (!this.team.members) {
      this.errorMsg = 'One or more team members are required.';
      this.forceElementView('bottom');
      return;
    }

    // none of the other entries are requied, therefore
    // no validation is required.
    // any entries will be trimmed by the database if
    // requested in the schema.

    this.errorMsg = '';
    this.ts.addteam(this.team)
      .then(res => {
        this.router.navigate(['team']);
      })
      .catch(err => {
        this.errorMsg = err.status + ': ' + err.statusText;
        this.forceElementView('bottom');
      });
  }

}

