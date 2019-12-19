import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Meeting } from 'src/app/_models/meeting';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class MeetingService {

  private uri: string;

  constructor(private http: HttpClient) {
    this.uri = environment.TSSGAPIURL + ':' + environment.TSSGAPIPORT + '/meetings';
  }

  private extractData(res: HttpResponse<Meeting>) {
    const body = res;
    return body || {};
  }

  private handleErrorPromise(error: Error | HttpErrorResponse) {
    // console.log('meeting.service.handleErrorPromise: ' + error);
    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator.onLine) {
        // Handle offline error
        console.error('meeting.service.handleErrorPromise offline error: ' + error);
      } else {
        // Handle Http Error (error.status === 403, 404...)
        HttpErrorResponse.toString();
        console.error('meeting.service.handleErrorPromise HttpErrorResponse: ' + HttpErrorResponse.toString());
      }
      // the following statement will cause tssg.ErrorHandler.ts to be called
      // return Promise.reject(error);
    }

    console.log('meeting.service.handleErrorPromise: ' + error);
    // the following statement will cause tssg.ErrorHandler.ts to be called
    // Promise.reject(error || error.message);
  }

  async addMeeting(obj: Meeting) {
    // console.log('meeting.service.addMeeting: meetingDate = ' + obj._id + ' - ' + obj.meetingDate);
    // console.log('meeting.service.addMeeting: startTime = ' + obj._id + ' - ' + obj.startTime);
    // console.log('meeting.service.addMeeting: endTime = ' + obj._id + ' - ' + obj.endTime);
    return await this.http.post(`${this.uri}/add`, obj)
      .toPromise()
      .then(this.extractData)
      .catch(err => {
        throw new HttpErrorResponse({ status: 409, statusText: err, url: `${this.uri}/add` });
      });
  }

  // request all meetings from the node server
  getMeetings() {
    return this.http.get(`${this.uri}`);
  }

  // send edit request to the node server. called from meeting-get.component.html
  // via app-routing.module.ts path match for 'meeting/edit/:_id'
  async editMeeting(_id) {
    return await this.http.get(`${this.uri}/edit/${_id}`)
      .toPromise()
      .then(this.extractData)
      .catch(err => {
        throw new HttpErrorResponse({ status: 404, statusText: err, url: `${this.uri}/edit` });
      });
  }

  // request all meeting schedule (next 3 meetings) from the node server
  getSchedule(team: string) {
    return this.http.get(`${this.uri}/schedule/${team}`);
  }

  // send edit request to the node server. called from meeting-get.component.html
  // via app-routing.module.ts path match for 'meeting/edit/:_id'
  async editSchedule(_id) {
    return await this.http.get(`${this.uri}/edit/${_id}`)
      .toPromise()
      .then(this.extractData)
      .catch(err => {
        throw new HttpErrorResponse({ status: 404, statusText: err, url: `${this.uri}/edit` });
      });
  }

  async deleteMeeting(_id) {
    if (confirm('Select OK to delete, or Cancel to return.')) {
      return await this.http.get(`${this.uri}/delete/${_id}`)
        .toPromise()
        .then(this.extractData)
        .catch(err => {
          throw new HttpErrorResponse({ status: 404, statusText: err, url: `${this.uri}/delete` });
        });
    }
    return;
  }

  // post meeting data to update back to the node server. called from meeting-edit.component.ts
  async updateMeeting(obj: Meeting) {
    // console.log('meeting.service.updateMeeting: meetingDate = ' + obj._id + ' - ' + obj.meetingDate);
    // console.log('meeting.service.updateMeeting: startTime = ' + obj._id + ' - ' + obj.startTime);
    // console.log('meeting.service.updateMeeting: endTime = ' + obj._id + ' - ' + obj.endTime);
    return await this.http.post(`${this.uri}/update`, obj)
      .toPromise()
      .then(this.extractData)
      .catch(err => {
        throw new HttpErrorResponse({ status: 404, statusText: err, url: `${this.uri}/update` });
      });
  }
}
