import { MediaMatcher } from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit, OnDestroy,AfterViewInit} from '@angular/core';
import { PromptService } from 'app/modules/core/services/prompt.service';
import { UserService } from 'app/modules/core/services/user.service';
import { StoriesService } from 'app/modules/core/services/stories.service';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { Router } from '@angular/router';

@Component({
  selector: 'app-follows-feed',
  templateUrl: './follows-feed.component.html',
  styleUrls: ['./follows-feed.component.scss']
})
export class FollowsFeedComponent implements OnInit {

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  userDetails: any;
  authDetails: any;
  followUserList: any;
  promptList: any = [];
  likesCount: number = 0;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private _userService: UserService,
    private _promptService: PromptService,
    private _storyService: StoriesService,
    private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.getAuthDetails();
  }

  getAuthDetails() {
    const temp = localStorage.getItem('authDetails')
   if(temp) {
    this.authDetails = JSON.parse(temp);
    this.getUserDetails();
   }
  }

  getUserDetails() {
    let temp = this._userService.getRequestCreatorById('Users', this.authDetails.UUID)
    .snapshotChanges()
    .subscribe(res => {
      if(res.payload.exists()){
        const userDetails: any = res.payload.toJSON();
        this.userDetails = userDetails;
        this.followUserList = Object.keys(this.userDetails.following);
        this.getPromptForUser();
      }
    })
  }

  getPromptForUser() {
    this.followUserList.forEach(async (element:any, index:any) => {
      const filterSet = { userID: element };
      const tempData = await this._promptService.getPromptOfUser(filterSet).subscribe(prompt => {
        this.promptList[index] = prompt;
        this.promptList = this.promptList.flat();
        this.promptList.forEach((element: any, index: any) => {
          this._storyService.getStoryFromPrompt(element.promptID).subscribe(result => {
            this.promptList[index].storyList = result;
          })
        });
      })
    });
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
    window.location.reload()
    } else {
      this.router.navigate(['/login']);
    }
  }

  async bookmarkPrompt(prompt: any){
    if(localStorage.getItem("authDetails")){
    if(this.userDetails.bookmarks && this.userDetails.bookmarks.hasOwnProperty(prompt.promptID))
    await this._promptService.promptRemoveBookmark(this.authDetails.UUID, prompt.promptID, prompt.promptID);
    else
    await this._promptService.promptBookmark(this.authDetails.UUID, prompt.promptID, prompt.promptID);
    
    window.location.reload()
  } else {
      this.router.navigate(['/login']);
    }
  }

}
