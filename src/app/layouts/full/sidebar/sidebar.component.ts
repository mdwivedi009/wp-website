import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";
import { MenuItems } from "../../../shared/menu-items/menu-items";
import { AuthService } from "./../../../modules/core/services/auth.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: [],
})
export class AppSidebarComponent implements OnInit, OnDestroy {
  authToken: any = undefined;
  mobileQuery: MediaQueryList;
  authDetails: any;
  profilePic: string = "";
  emailId = ["mdwivedi009@gmail.com" , "vicky@aeologic.com" , "narendra@aeologic.com" , "akhilkumar62897@gmail.com"
   , "annie8047@gmail.com" , "aniket@aeologic.com" , "Kumar.v005@gmail.com" , "manish@aeologic.com"
    , "aman.bakshi06@gmail.com" , "writingpromptsapp@gmail.com"];

  
  private _mobileQueryListener: () => void;

  constructor(
    public authService: AuthService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    
    public menuItems: MenuItems
  ) {
    this.mobileQuery = media.matchMedia("(min-width: 768px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.authService.currentUser.subscribe((token) => {
      this.authToken = token;
    });
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.getAuthDetails();
    this.getAuthToken();
    if(this.authDetails == undefined){
      setTimeout(()=> this.getAuthDetails(), 1000);
    }
  }

  getAuthDetails() {
    const temp = localStorage.getItem("authDetails");
    if (temp) {
      this.authDetails = JSON.parse(temp);
      if (typeof this.authDetails.picture == "object")
        this.profilePic = this.authDetails.picture.data.url;
    }
  }

  getAuthToken() {
    this.authToken = localStorage.getItem("accessToken");
  }
}
