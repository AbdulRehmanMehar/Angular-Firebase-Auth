import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  public status = false;
  public guest = 'assets/guest.png';
  constructor(public user: UserService, private router: Router) {
  }

  toggle() {
    this.status = !this.status;
  }

  changeRoute(path) {
    this.router.navigate([path]);
  }

  ngOnInit() {
  }

}
