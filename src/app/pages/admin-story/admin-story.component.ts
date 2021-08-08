import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from "@angular/core";
import {
  NgbActiveModal,
  NgbModal,
  ModalDismissReasons,
} from "@ng-bootstrap/ng-bootstrap";
import { MediaMatcher } from "@angular/cdk/layout";
import { StoriesService } from "../../modules/core/services/stories.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MailService } from "app/modules/core/services/mail.service"
import { UserService } from "app/modules/core/services/user.service";
declare var email: any;

@Component({
  selector: 'app-admin-story',
  templateUrl: './admin-story.component.html',
  styleUrls: ['./admin-story.component.css']
})
export class AdminStoryComponent implements OnInit {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    private _storiesService: StoriesService,
    public modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private _mailService: MailService,
    private _userService: UserService,
    media: MediaMatcher
    ) {
    this.mobileQuery = media.matchMedia("(min-width: 768px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.getStoryPrompts();
   }
   storySet: any = [];
   story: any;
   storyID = "";
   prompt: any;
   promptIDCheck: string = '';
   pPromptSet: any = [];
  dispPromptSet: any = [];
  customPromptSet: any = [];
  mailStorySet : any = [];
  userName:any;
  base = 0;
 

  // getStoryPrompts(){
  //   this.spinner.show();
  //   this. _storiesService.getStoryPrompts().subscribe(async (data) => {
  //   this.pPromptSet =data;
  //   this.pPromptSet.forEach(async (element: any, index: any) => {
  //     const response = await fetch(element.stURL);
  //     let text = await response.text();
  //     this.pPromptSet[index].completeStory = text;
  //   });
  //   console.log(this.pPromptSet);
  //   // this.dispPromptSet = this.customPromptSet[this.base];
  //   this.spinner.hide();
  //   });
  // }
  
   getStoryPrompts() {
    this.spinner.show();
    let tempId: any = '';
    let index = 0;
    this._storiesService.getStoryPrompts().subscribe((data) => {
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
      this.pPromptSet = this.customPromptSet[this.base];
      this.spinner.hide();
    })
    console.log(this.customPromptSet)
  }

  handleNext() {
    this.base = this.base + 1;
    this.pPromptSet = this.customPromptSet[this.base];
    this.mailStorySet = [];
    
  }

  handlePrevious() {
    this.base = this.base - 1;
    this.pPromptSet = this.customPromptSet[this.base];
    this.mailStorySet = [];
  }
  openAcceptStory(content: any, story: any) {
    this.story = story;
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }
  openRejectStory(content: any, story: any) {
      this.story = story;
      this.modalService
        .open(content, { ariaLabelledBy: "modal-basic-title" })
        .result.then(
          (result) => { },
          (reason) => { }
        );
    }
  
  async acceptStory() {
    this.spinner.show();
    const tempVlaue: any = this.story;
    const response = await fetch(this.story.stURL);
    let text = await response.text();
    this.story.fullStory = text;
    await this._storiesService.approveStory(tempVlaue.stID);
    // console.log(tempVlaue);
    this.modalService.dismissAll();
    this.pPromptSet = this.pPromptSet.filter((element: any, index: any) => {
      return element.stID != tempVlaue.stID;
    })
    this.spinner.hide();
      this._userService.getRequestCreatorById('Users', tempVlaue.userID).valueChanges().subscribe(async (userDetail) => {
        tempVlaue.email = userDetail.userEmail;
        const tempSet = {story: this.story.fullStory, status: 'approved' ,email: userDetail.userEmail, name:this.story.userName};
        this.mailStorySet.push(tempSet);
        alert("story is accepted !");
        console.log(tempVlaue);
      //  await this._mailService.sendMailStory(tempVlaue.userName, tempVlaue, 'http://3.113.55.162/', 'approved');
      //   alert("story is accepted !");
       
      });  
  }
  dontAcceptStory(){
    this.modalService.dismissAll();
  }
   async rejectStory(){
     this.spinner.show();
    const tempVlaue: any = this.story;
    const response = await fetch(this.story.stURL);
    let text = await response.text();
    this.story.fullStory = text;
    console.log(tempVlaue)
    await this._storiesService.rejectStory(tempVlaue.stID, tempVlaue.userID);
    this.modalService.dismissAll();
    this.pPromptSet = this.pPromptSet.filter((element: any, index: any) => {
      return element.stID != tempVlaue.stID;
    })
    this.spinner.hide();
    this._userService.getRequestCreatorById('Users', tempVlaue.userID).valueChanges().subscribe(async (userDetail) => {
      tempVlaue.email = userDetail.userEmail;
      const tempSet = {story: this.story.fullStory,status: 'rejected' ,email: userDetail.userEmail,name:this.story.userName};
      this.mailStorySet.push(tempSet);
      alert("story is rejected !");
    //  await this._mailService.sendMailStory(tempVlaue.userName, tempVlaue, 'http://3.113.55.162/', 'rejected');
    //   alert("story is rejected !");   
    });
  }
  dontRejectStory(){
    this.modalService.dismissAll();
  }

  async sendMailUser() {
    if(!this.mailStorySet.length) {
      alert('Please approve or reject story of user');
      return false;
    }
    this.spinner.show();
    await this._mailService.sendMailStory(this.mailStorySet, 'http://3.113.55.162/');
    setTimeout(() => this.spinner.hide(), 2000);
  }
  ngOnInit(): void {
  }

}
