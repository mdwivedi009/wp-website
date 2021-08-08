import { MediaMatcher } from "@angular/cdk/layout";
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { MenuItems } from "../../shared/menu-items/menu-items";
import {
  NgbActiveModal,
  NgbModal,
  ModalDismissReasons,
} from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/modules/core/services/auth.service";
import { PromptService } from "../../modules/core/services/prompt.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { MailService } from "app/modules/core/services/mail.service"
import { UserService } from "app/modules/core/services/user.service";
declare var email: any;

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
})
export class AdminComponent implements OnInit {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  emailId = ["mdwivedi009@gmail.com", "vicky@aeologic.com", "narendra@aeologic.com", "akhilkumar62897@gmail.com"
    , "annie8047@gmail.com", "aniket@aeologic.com", "Kumar.v005@gmail.com", "manish@aeologic.com"
    , "aman.bakshi06@gmail.com", "writingpromptsapp@gmail.com"];
  authDetails: any;
  promptString: string = "";
  promptSet: any = [];
  promptIDCheck: string = '';
  prompt: any;
  mailPromptSet: any = [];
  counter = 0;
  data: any = [];
  data2: any = [];
  updatedPrompt: any;
  promptGenres: any = [];
  tempPrompt: any = [];
  promptID: string = "";
  // userPrompt:any;


  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    public modalService: NgbModal,
    private authService: AuthService,
    private _promptService: PromptService,
    private spinner: NgxSpinnerService,
    public afAuth: AngularFireAuth,
    private fun: AngularFireFunctions,
    private _mailService: MailService,
    private _userService: UserService,
  ) {
    this.mobileQuery = media.matchMedia("(min-width: 768px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.getAuthDetails();
    this.getPendingPrompts();
    if (!this.emailId.includes(this.authDetails.email)) this.authService.SignOut();
  }
  pPromptSet: any = [];
  dispPromptSet: any = [];
  customPromptSet: any = [];
  base = 0

  getPendingPrompts() {
    this.spinner.show();
    let tempId: any = '';
    let index = 0;
    this._promptService.getPendingPrompts().subscribe((data) => {
      this.pPromptSet = data;
      this.pPromptSet.sort((a: any, b: any) => (a.userID > b.userID) ? 1 : -1);
      this.pPromptSet.forEach((ele: any) => {
        if (tempId != ele.userID) {
          tempId = ele.userID;
          this.customPromptSet.push([]);
          index = this.customPromptSet.length - 1;
        }
        this.customPromptSet[index].push(ele);
      });
      this.dispPromptSet = this.customPromptSet[this.base];
      this.spinner.hide();
    })
  }

  handleNext() {
    this.base = this.base + 1;
    this.dispPromptSet = this.customPromptSet[this.base];
    this.mailPromptSet = [];
  }

  handlePrevious() {
    this.base = this.base - 1;
    this.dispPromptSet = this.customPromptSet[this.base];
    this.mailPromptSet = [];
  }
  getUUIDForPrompt() {
    const tempid = this._promptService.getPromptUUID()
    return tempid;
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngOnInit(): void {

  }

  openEditPrompt(content: any, prompt: any) {
    console.log(prompt)
    this.promptID = prompt.promptID;
    this.prompt = prompt;
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => { },
        (reason) => { }
      );
    console.log(prompt);
  }
  updatePrompt(event: any) {
    const tempPrompt = this.prompt;
    this.prompt = event.target.value;
    console.log(tempPrompt)
  }
  async doneEditing(prompt: any) {
    console.log(this.prompt);
    this.updatedPrompt = prompt;
    console.log(this.updatedPrompt);
    await this._promptService.updatePrompts(this.promptID, this.updatedPrompt);
    this.modalService.dismissAll();
    window.location.reload();

  }
  discardEdit() {
    this.modalService.dismissAll();
  }
  openAcceptPrompt(content: any, prompt: any) {
    this.prompt = prompt;
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }

  async acceptPrompt() {
    this.spinner.show();
    const tempVlaue: any = this.prompt;
    await this._promptService.approvePromt(tempVlaue.promptID);
    this.modalService.dismissAll();
    this.spinner.hide();
    this._userService.getRequestCreatorById('Users', tempVlaue.userID).valueChanges().subscribe(async (userDetail) => {
      tempVlaue.email = userDetail.userEmail;
      const tempSet = { prompt: this.prompt.userPrompt, status: 'approved', email: userDetail.userEmail, name: this.prompt.userName };
      this.mailPromptSet.push(tempSet);
      alert("prompt is accepted !");
    });
    console.log(this.dispPromptSet)
    this.dispPromptSet = this.dispPromptSet.filter((element: any, index: any) => {
      return element.promptID != tempVlaue.promptID;
    });
  }

  dontAcceptPrompt() {
    this.modalService.dismissAll();
  }
  openRejectPrompt(content: any, prompt: any) {
    this.prompt = prompt;
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }
 
  async rejectPrompt() {
    this.spinner.show();
    const tempVlaue: any = this.prompt;
    await this._promptService.rejectPrompt(tempVlaue.promptID);
    this._userService.getRequestCreatorById('Users', tempVlaue.userID).valueChanges().subscribe(async (userDetail) => {
      tempVlaue.email = userDetail.userEmail;
      const tempSet = { prompt: this.prompt.userPrompt, status: 'rejected',email: userDetail.userEmail, name: this.prompt.userName };
      this.mailPromptSet.push(tempSet);
      alert("prompt is rejected !");
    });
    console.log(this.dispPromptSet)
    this.modalService.dismissAll();
    this.dispPromptSet = this.dispPromptSet.filter((element: any, index: any) => {
      return element.promptID != tempVlaue.promptID;
    })
    console.log(this.prompt)
    this.spinner.hide();
  }
  dontRejectPrompt() {
    this.modalService.dismissAll();
  }
  getAuthDetails() {
    const temp = localStorage.getItem("authDetails");
    if (temp) {
      this.authDetails = JSON.parse(temp);
    }
  }

  async sendMailUser() {
    if(!this.mailPromptSet.length) {
      alert('Please approve or reject prompt of user');
      return false;
    }
    this.spinner.show();
    await this._mailService.sendMail(this.mailPromptSet,  'http://3.113.55.162/');
    setTimeout(() => this.spinner.hide(), 2000);
  }
}