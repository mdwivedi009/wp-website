import { MediaMatcher } from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit, OnDestroy,AfterViewInit} from '@angular/core';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { StoriesService } from "../../modules/core/services/stories.service";
import { PromptService } from "../../modules/core/services/prompt.service";
import { UserService } from "app/modules/core/services/user.service";
import { Router, RouterEvent } from "@angular/router";
import { InteractionService } from 'app/modules/core/services/interaction.service';
import { NgxSpinnerService } from "ngx-spinner";




@Component({
  selector: 'app-stories-feed',
  templateUrl: './stories-feed.component.html',
  styleUrls: ['./stories-feed.component.scss']
})
export class StoriesFeedComponent implements OnInit {

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private _storiesService: StoriesService,
    private _userService: UserService,
    private _promptService: PromptService,
    private router: Router, 
    private _interactionService: InteractionService,
    private _storyService: StoriesService,
    private spinner: NgxSpinnerService,
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  authDetails: any;
  storySet: any = [];
  startAtValue: String = '';
  scrollDiff: number = 200;
  scrolledHeight: number = 0;
  nextScrolledCheck: number = 1300;
  startKey: string = '';
  endKey: String = '';
  storyIDCheck: string = '';
  clicked:boolean= false;
  tempData: any;
  sortType: string='';
  includeMore = 0;
  story: any;
  isReported: any;
  
  scrolling=(s: any)=>{
    if(s.target.scrollTop >= 1800){
      if(this.nextScrolledCheck - s.target.scrollTop <= 0 ) {
        this.nextScrolledCheck += 800;
        if(this.startKey == this.storyIDCheck){
          return false;
        } 
        if(this.sortType == 'likesCount'){
          this.includeMore = this.includeMore + 5;
        }
        this.getStoriesList();
        
      }
     
    }
  }

  getStoriesList() {
    // this.spinner.show();
    const collection = 'Stories';
    if(this.sortType == 'recent') {
      this._storiesService.getRequestCreator(collection, this.startKey).subscribe((data) => {
        const temp: any = data;
        this.startKey = temp[0].stID;
        data.shift();
        this.tempData = data.slice().reverse();
        this.tempData.forEach((element:any) =>{
          this._promptService.getRequestCreatorById('Prompts', element.promptID)
          .snapshotChanges()
          .subscribe(result => {
            if(result.payload.exists()) {
              const prompt = result.payload.toJSON();
              element.promptSet = prompt;
            }
          })
        })
        this.tempData.forEach((element: any, index: any) => {
          this._storyService.getStoryFromPrompt(element.promptID).subscribe(result => {
            this.tempData[index].storyList = result;
          })
        });
        this.spinner.hide();
        this.storySet = this.storySet.concat(this.tempData);
    });
     
  }

  if(this.sortType == 'likesCount') {
    this.spinner.show();
    this._storiesService.getSortedStories(this.sortType, this.includeMore).subscribe((data) => {
      this.storySet = data.slice().reverse();
      this.storySet.forEach((element:any) =>{
        //code to  add prompts to stories in story set to display above them
        this._promptService.getRequestCreatorById('Prompts', element.promptID)
        .snapshotChanges()
        .subscribe(result => {
          if(result.payload.exists()) {
            const prompt = result.payload.toJSON();
            element.promptSet = prompt
          }
        })
      })
      this.spinner.hide();
    if(this.storySet) this.startKey = this.storySet[this.storySet.length-1].stID;
  }); 
  }

  }

  sortStories(event: any){
    this.nextScrolledCheck = 1800;
    if(event.target.value == 'likes'){
      this.sortType = 'likesCount';
      this.startKey='';
      this.storySet=[];
      this.getFirstStories();
      this.getStoriesList();
      }
    if(event.target.value == 'recent') {
      this.sortType='recent';
      this.startKey='';
      this.storySet=[];
      this.getFirstStories();
      this.getStoriesList();
    };
  
}

  getFirstStories() {
    if(this.sortType == '' || this.sortType == 'recent') {
    this._storyService.getFirstRecordFromStory().subscribe((data: any) => {
      this.storyIDCheck = data[0].stID
    });
    } 
    if(this.sortType == 'likesCount') {
      this._storiesService.getFirstRecordFromSortedStories().subscribe((data:any) => {
        this.storyIDCheck = data[0].stID
      })
    }
 }
  getAuthDetails() {
    const temp = localStorage.getItem("authDetails");
    if (temp) {
      this.authDetails = JSON.parse(temp);
    }
  }
  getAuthUserDetails() {
    let tempDetails: any;
    this._userService.getRequestCreatorById('Users', this.authDetails.UUID).snapshotChanges().subscribe(response => {
      if(response.payload.exists()){
        tempDetails = response.payload.toJSON();
        this.authDetails['userSet'] = tempDetails;
      }
    })
  }
  async userFollowUnfollow(story: any){
    this.clicked=true;
    if(localStorage.getItem("authDetails")){
     this.getAuthUserDetails();
      if(this.authDetails.userSet.following && this.authDetails.userSet.following.hasOwnProperty(story.userID)){
        await this._userService.removeUserFromFollower(story.userID,this.authDetails.UUID,this.authDetails.UUID)
        await this._userService.removeUserFromFollowing(this.authDetails.UUID,story.userID,story.userID)
        } else {
         await this._userService.addUserToFollower(story.userID,this.authDetails.UUID,this.authDetails.UUID)
         await this._userService.addUserToFollowing(this.authDetails.UUID,story.userID,story.userID)
        }
    } else {
      this.router.navigate(['/login']);
    }
  }
 

  async storyLikeDislike(story: any) {
    this.clicked=true;
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
      if(this.authDetails.UUID !== story.userID){
        await this.saveNotification(story);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
  saveNotification(story: any){
    const updateData = {
      time: Date.now(),
      userID: this.authDetails.userSet.userID,
      userImageURL: this.authDetails.userSet.userImageURL,
      userName: this.authDetails.userSet.userName
    };
    return this._interactionService.saveNotificationForStory(story.userID, story.stID, this.authDetails.UUID, updateData);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    
    window.addEventListener('scroll', this.scrolling, true)
      if(this.authDetails == undefined){
        setTimeout(()=> {this.getAuthDetails();this.getAuthUserDetails();}
        , 1000);
      } 
      this.sortType = 'recent';
      this.getStoriesList(); 
      this.getFirstStories();
      console.log(this.storySet);
  }
  cardClicked(stID: any) {
    if(this.clicked == false) {
      this.router.navigate(['/read-story'], { queryParams:{storyID : stID }});
    }
    this.clicked=false;
  }
   flagHandler(story:any) {
     if(this.clicked == false){
       this.router.navigate(['/read-story']);
     }
     else{
       this.clicked =false;
     }
    console.log(this.storySet);
    console.log(story.stID ,story.isReported);
    this._storiesService.reportedPrompt(story.stID);
    console.log('reported');
    alert('Story has been reported!')
    window.location.reload();
  // const filteredstorySet = this.storySet.filter((element: any) =>{
  //   if (element.isReported= false){
  //      return true;
  //   }
  //   return element.isReported = false;
  // });
  //   console.log(filteredstorySet);
  };

}
