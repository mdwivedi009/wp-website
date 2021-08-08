import { MediaMatcher } from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit, OnDestroy,AfterViewInit} from '@angular/core';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'app/modules/core/services/user.service';
import { PromptService } from 'app/modules/core/services/prompt.service';
import { StoriesService } from 'app/modules/core/services/stories.service';
import { async } from 'rxjs';
import { Router, RouterEvent } from "@angular/router";
import {
  NgbActiveModal,
  NgbModal,
  ModalDismissReasons,
} from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  UserId = '';
  userDetails: any;
  tempSet= {};
  key: any;
  value: any;
  followers: Number = 0;
  following: Number = 0;
  promptList: any = [];
  userPrompts: any;
  buttonType = 'prompts';
  storiesList: any = [];
  bookmarksList: any = [];
  likesList: any = [];
  promptGenres:any = [];
  authDetails: any;
  followList:any = [];
  followListIds:any = [];
  usersType:any;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private router: ActivatedRoute,
    private _userService: UserService,
    private _promptService: PromptService,
    private _storiesService: StoriesService,
    private routeTo: Router,
    public modalService: NgbModal,
    private spinner: NgxSpinnerService,
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      this.UserId = params.id;
    })
    this.getUserDetails();
    this.getAuthDetails();
    this.getAuthUserDetails();
    this.checkForAuthProfile();
    if(this.authDetails !== undefined){
      setTimeout(()=> {this.getAuthDetails();this.getAuthUserDetails();}
      , 1000);
    }
  }

  checkForAuthProfile() {
    this.spinner.show();
    if(this.authDetails.UUID==this.UserId){
      this.routeTo.navigate(['/profile']);
    }
    this.spinner.hide();
  }
  
  getUserDetails () {
    this.spinner.show();
    this._userService.getRequestCreatorById('Users', this.UserId).snapshotChanges().subscribe(res => {
      if(res.payload.exists()){
        this.userDetails = res.payload.toJSON();
        if(this.userDetails.hasOwnProperty('followers'))
        this.followers = Object.keys(this.userDetails.followers).length;
        if(this.userDetails.hasOwnProperty('following'))
        this.following = Object.keys(this.userDetails.following).length;
        this.getUserPromptList();
      }
      this.spinner.hide();
    })
  }

  getUserPromptList() {
    let temp = Object.keys(this.userDetails.userPrompts);
    temp = temp.slice().reverse();
    temp.forEach(async (element) => {
      let temp1 = this._promptService.getRequestCreatorById('Prompts', element).snapshotChanges().subscribe(res => {
        if(res.payload.exists()){
          this.promptList.push(res.payload.toJSON());
        }
      })
    });
  }

  getUserBookmarkPrompts() {
    if(this.userDetails.bookmarks){
      let temp = Object.keys(this.userDetails.bookmarks);
      temp = temp.slice().reverse();
      temp.forEach(async (element) => {
        let temp1 = this._promptService.getRequestCreatorById('Prompts', element).snapshotChanges().subscribe(res => {
          if(res.payload.exists()){
            this.bookmarksList.push(res.payload.toJSON());
          }
        })
      });
    }
  }

  getUserLikesPrompts() {
    let temp = Object.keys(this.userDetails.likes);
    temp = temp.slice().reverse();
    temp.forEach(async (element) => {
      let temp1 = this._promptService.getRequestCreatorById('Prompts', element).snapshotChanges().subscribe(res => {
        if(res.payload.exists()){
          this.likesList.push(res.payload.toJSON());
        }
      })
    });
  }

  async bookmarkPrompt(prompt: any){
    if(localStorage.getItem("authDetails")){
        if(this.authDetails.userSet.bookmarks && this.authDetails.userSet.bookmarks.hasOwnProperty(prompt.promptID))
        await this._promptService.promptRemoveBookmark(this.authDetails.UUID, prompt.promptID, prompt.promptID);
        else
        await this._promptService.promptBookmark(this.authDetails.UUID, prompt.promptID, prompt.promptID);
    }
    else {
      this.routeTo.navigate(['/login']);
    }
  }

  async promptLikeDislike(prompt: any) {
    if(localStorage.getItem("authDetails")){
        if(prompt.likes && prompt.likes.hasOwnProperty(this.authDetails.UUID)){
          await this._userService.promptDislikeByUser(this.authDetails.UUID, prompt.promptID, prompt.promptID);
          await this._promptService.promptDislike(prompt.promptID, this.authDetails.UUID, this.authDetails.UUID);
          await this._promptService.decreaseLikeCount(prompt.promptID, prompt.likesCount - 1, '' );
      } else {
        await this._userService.promptLikeByUser(this.authDetails.UUID, prompt.promptID, prompt.promptID);
        await this._promptService.promptLike(prompt.promptID, this.authDetails.UUID, this.authDetails.UUID);
        await this._promptService
        .increaseLikeCount(prompt.promptID, prompt.likesCount + 1, '' );
      }
    } else {
      this.routeTo.navigate(['/login']);
    }
  }

  sharePrompt(prompt: any) {
    if(localStorage.getItem("authDetails")){
      //here goes code to share the prompt
      console.log("sharing prompt")
    } else {
      this.routeTo.navigate(['/login']);
    }
  }

  async storyLikeDislike(story: any) {
    if(localStorage.getItem("authDetails")){
      if(story.likes && story.likes.hasOwnProperty(this.authDetails.UUID)){
        await this._userService.storyDislikeByUser(this.authDetails.UUID, story.stID, story.stID);
        await this._storiesService.storyDislike(story.stID, this.authDetails.UUID, this.authDetails.UUID);
        await this._storiesService.decreaseLikeCount(story.stID, story.likesCount - 1, '' );
    } else {
      await this._userService.storyLikeByUser(this.authDetails.UUID, story.stID, story.stID);
      await this._storiesService.storyLike(story.stID, this.authDetails.UUID, this.authDetails.UUID);
      await this._storiesService.increaseLikeCount(story.stID, story.likesCount + 1, '' );
    }
    } else {
      this.routeTo.navigate(['/login']);
    }
  }

  open(content: any,genres:any) {
    this.promptGenres = Object.values(genres)
    console.log(this.promptGenres)
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title", size: 'lg',centered: true})
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  getuserStoriesList() {
    this._storiesService.getStoriesForUser('Stories', this.UserId).subscribe(result => {
      let temp1 = result.slice().reverse();
      temp1.forEach(async (element, index) => {
        this.storiesList.push(element);
        const temp: any = element;
        await this._promptService.getRequestCreatorById('Prompts', temp.promptID)
        .snapshotChanges()
        .subscribe(result => {
          if(result.payload.exists()) {
            const prompt = result.payload.toJSON();
            this.storiesList[index].promptSet = prompt
          }
        })
      })
    })
  }

  clicked(button:any) {
    this.buttonType = button;
    if(button == 'stories'){
      this.storiesList = [];
      this.getuserStoriesList();
    }
    if(button == 'bookmarks'){
      this.bookmarksList = [];
      this.getUserBookmarkPrompts();
    }
    if(button == 'likes'){
      this.bookmarksList = [];
      this.getUserLikesPrompts();
    }
  }

  getAuthDetails(){
    this.spinner.show();
    let temp = localStorage.getItem('authDetails');
    if(temp) {
      temp = JSON.parse(temp);
      this.authDetails = temp;
    }
    this.spinner.hide();
  }

  getAuthUserDetails() {
    this.spinner.show();
    let tempDetails: any;
    this._userService.getRequestCreatorById('Users', this.authDetails.UUID).snapshotChanges().subscribe(response => {
      if(response.payload.exists()){
        tempDetails = response.payload.toJSON();
        this.authDetails['userSet'] = tempDetails;
      }
      this.spinner.hide();
    })
  }

  async userFollowUnfollow() {
    if(localStorage.getItem("authDetails")){
      if(this.authDetails.userSet.following && this.authDetails.userSet.following.hasOwnProperty(this.UserId)){
        await this._userService.removeUserFromFollower(this.UserId,this.authDetails.UUID,this.authDetails.UUID)
        await this._userService.removeUserFromFollowing(this.authDetails.UUID,this.UserId,this.UserId)
        } else {
         await this._userService.addUserToFollower(this.UserId,this.authDetails.UUID,this.authDetails.UUID)
         await this._userService.addUserToFollowing(this.authDetails.UUID,this.UserId,this.UserId)
        }
        if(this.userDetails.hasOwnProperty('followers')) {
          this.followers = Object.keys(this.userDetails.followers).length;} else { this.followers = 0 }
        if(this.userDetails.hasOwnProperty('following')) {
          this.following = Object.keys(this.userDetails.following).length;} else { this.following = 0 }
    } else {
      this.routeTo.navigate(['/login']);
    }
  }
 
  openFollowList(content: any,type:any) {
    this.getFollow(type);
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title", size:'md',centered: true, scrollable: true })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  getFollow(type: any){
    let tempGetFollowList:any=[];
    let tempGetFollowIds:any=[];
    this.followList= [];
    if(type === 'followers'){
      tempGetFollowIds = Object.values(this.userDetails.followers)
      this.usersType=type;
    }
    if(type === 'following'){
      tempGetFollowIds = Object.values(this.userDetails.following)
      this.usersType=type;
    }
    tempGetFollowIds.forEach((element:any,index:any) => {
      let tempDetails: any;
    this._userService.getRequestCreatorById('Users', element).snapshotChanges().subscribe(response => {
      if(response.payload.exists()){
        tempDetails = response.payload.toJSON();
        tempGetFollowList.push(tempDetails)
        this.followList.push(tempDetails);
      }
    })
    });
    // this.followList = tempGetFollowList;
    this.followListIds = tempGetFollowIds;
  }

 
}