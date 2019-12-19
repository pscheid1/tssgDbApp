import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/_models/team';
import { TeamService } from '../_services/team.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-team-get',
  templateUrl: './team-get.component.html',
  styleUrls: ['./team-get.component.css']
})
export class TeamGetComponent implements OnInit {
  teams: Team[];
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ts: TeamService) { }

  ngOnInit() {
    this.ts.getteams().subscribe((data: Team[]) => {
      this.teams = data;
    });
  }

  // scroll browser to element id
  forceElementView(id: string) {
    const element = document.getElementById(id);
    element.scrollIntoView();
  }

  deleteTeam(_id) {
    this.errorMsg = '';
    this.ts.deleteTeam(_id)
      .then(res => {
        this.ngOnInit();
      })
      .catch(err => {
        this.errorMsg = err.status + ': ' + err.statusText;
        this.forceElementView('bottom');
      });
  }
}
