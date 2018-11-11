import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  LuxezryWhite = 'assets/Luxezry-white.svg';
  constructor(private route: ActivatedRoute, public user: UserService) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe(params => {
        console.log(params);
      });
  }

}
