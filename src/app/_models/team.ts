import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Team {
  _id: string;
  description: string;
  teamLead: string;
  members: string[];
  zoomLink: string;
  comments: string;
}
