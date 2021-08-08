import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../modules/core/services/auth.service';

@Component({
  selector: 'app-facebook-login',
  templateUrl: './facebook-login.component.html',
  styleUrls: ['./facebook-login.component.css']
})
export class FacebookLoginComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
