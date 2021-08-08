import { MediaMatcher } from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit, OnDestroy,AfterViewInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService } from 'app/modules/core/services/prompt.service';
import { StoriesService } from 'app/modules/core/services/stories.service';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/modules/core/services/user.service';
import { InteractionService } from 'app/modules/core/services/interaction.service';
import { CommonService } from 'app/modules/core/services/common.service';

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.css']
})
export class StoryListComponent implements OnInit {

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  storyID: any = '';
  storySet: any;
  completeStory: string = '';
  promptID: string = '';
  storyList: any;
  prompt: any = '';
  authDetails: any;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private router: ActivatedRoute,
    private _storyService: StoriesService,
    private _promptService: PromptService,
    private http: HttpClient,
    private _userService: UserService,
    private route: Router,
    private _interactionService: InteractionService,
    private _commonService: CommonService
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.router.queryParams.subscribe(async (params) => {
      this.promptID = params.id;
      await this.getStoryList();
      await this.getAuthDetails();
    })
  }

  getStoryList(){
    this._promptService.getRequestCreatorById('Prompts', this.promptID)
    .snapshotChanges()
    .subscribe(result => {
      if(result.payload.exists()){
        this.prompt = result.payload.toJSON();
        this._commonService.updateTitle(this.prompt.userPrompt);
        this._commonService.updateDescription(this.prompt.userPrompt);
        this._commonService.updateOgDetails({
          url: `http://3.113.55.162/story-list?id=${this.prompt.promptID}`,
          title: this.prompt.userPrompt,
          description: this.prompt.userPrompt,
          image: '/assets/images/logo.png'
        });
      }
    })
    this._storyService.getStoryFromPrompt(this.promptID)
    .subscribe(story => {
      this.storyList = story;
      this.storySet = undefined;
    })
  }

  getAuthDetails() {
    const temp = localStorage.getItem('authDetails');
    if(temp) {
      this.authDetails = JSON.parse(temp);
      this.getAuthUserDetails();
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

  async storyLikeDislike(story: any) {
    if(localStorage.getItem("authDetails")){
      if(story.likes && story.likes.hasOwnProperty(this.authDetails.UUID)){
        await this._userService.storyDislikeByUser(this.authDetails.UUID, story.stID, story.stID);
        await this._storyService.storyDislike(story.stID, this.authDetails.UUID, this.authDetails.UUID);
        await this._storyService.decreaseLikeCount(story.stID, story.likesCount - 1, '' );
    } else {
      await this._userService.storyLikeByUser(this.authDetails.UUID, story.stID, story.stID);
      await this._storyService.storyLike(story.stID, this.authDetails.UUID, this.authDetails.UUID);
      await this._storyService.increaseLikeCount(story.stID, story.likesCount + 1, '' );
      if(this.authDetails.UUID !== story.userID){
        await this.saveNotification(story);
      }
    }
    } else {
      this.route.navigate(['/login']);
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

}
