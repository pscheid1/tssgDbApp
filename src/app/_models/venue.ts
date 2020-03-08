import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Venue {
  _id: string;
  description: string;
  contact: string;
  website: string;
  calendar: string;
  address: string;
  town: string;
  location: string;
  iconimage: string;
  photoimage: string;
}
