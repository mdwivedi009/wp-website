import { Component, Inject, OnInit } from "@angular/core";
import { APP_CONFIG } from "../../../configs/app.config";
import { NavigationEnd, Router } from "@angular/router";
// import { CookieService } from '@gorniv/ngx-universal';
import { ProgressBarService } from "../../../modules/core/services/progress-bar.service";
import { AuthService } from "../../../modules/core/services/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: [],
})
export class AppHeaderComponent implements OnInit {
  authToken: any = undefined;
  progressBarMode: any = undefined;
  currentUrl: any = undefined;
  authDetails: any;
  profilePic = "";

  constructor(
    private progressBarService: ProgressBarService,
    // private cookieService: CookieService,
    public authService: AuthService,
    private router: Router
  ) {
    authService.currentUser.subscribe((token) => {
      this.authToken = token;
    });
  }

  ngOnInit() {
    this.getAuthToken();
    this.getAuthDetails();
    this.progressBarService.getUpdateProgressBar().subscribe((mode: string) => {
      this.progressBarMode = mode;
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
    if(this.authDetails == undefined){
      setTimeout(()=> this.getAuthDetails(), 1000);
    }
  }

  getAuthToken() {
    this.authToken = localStorage.getItem("accessToken");
  }

  getAuthDetails() {
    const temp = localStorage.getItem("authDetails");
    if (temp) {
      this.authDetails = JSON.parse(temp);
      if (typeof this.authDetails.picture == "object")
        this.profilePic = this.authDetails.picture.data.url;
    }
  }
}
