import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss']
})
export class TestErrorComponent implements OnInit {
  baseUrl = environment.apiUrl;
  validationErrors: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  get404Error() {
    const url = `${this.baseUrl}products/42`;

    this.http
      .get(url)
      .subscribe(response => {
        console.log(response);
      }, error => {
        console.error(error);
      });
  }

  get500Error() {
    const url = `${this.baseUrl}buggy/servererror`;

    this.http
      .get(url)
      .subscribe(response => {
        console.log(response);
      }, error => {
        console.error(error);
      });
  }

  get400Error() {
    const url = `${this.baseUrl}buggy/badrequest`;

    this.http
      .get(url)
      .subscribe(response => {
        console.log(response);
      }, error => {
        console.error(error);
      });
  }

  get400ValidationError() {
    const url = `${this.baseUrl}products/fortytwo`;

    this.http
      .get(url)
      .subscribe(response => {
        console.log(response);
      }, error => {
        console.error(error);
        this.validationErrors = error.errors;
      });
  }
}
