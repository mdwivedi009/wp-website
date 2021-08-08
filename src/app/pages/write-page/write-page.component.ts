import { MediaMatcher } from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit, OnDestroy,AfterViewInit} from '@angular/core';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService } from 'app/modules/core/services/prompt.service';
import { StoriesService } from 'app/modules/core/services/stories.service';
import { UserService } from 'app/modules/core/services/user.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-write-page',
  templateUrl: './write-page.component.html',
  styleUrls: ['./write-page.component.css']
})
export class WritePageComponent implements OnInit {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private router: ActivatedRoute,
    private _promptService: PromptService,
    private _storyService: StoriesService,
    private _userService: UserService,
    private spinner: NgxSpinnerService,
    private route: Router
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  promptString: string = "";
  stringlength: number = 0;
  stringlengthLimit:number =5000;
  promptID: string = '';
  promptData: any;
  authDetails: any;

handlePromptString(event:any) {
  this.promptString = event.target.value;
  this.stringlengthLimit = event.target.value.length;
}

ngOnDestroy(): void {
  this.mobileQuery.removeListener(this._mobileQueryListener);
}

  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      this.promptID = params.id;
      this.getPromptDetail();
      this.getAuthDetails();
    })
  }

  getAuthDetails() {
    const temp = localStorage.getItem('authDetails');
    if(temp) {
      this.authDetails = JSON.parse(temp);
    }
  }

  getPromptDetail() {
    this._promptService.getRequestCreatorById('Prompts', this.promptID)
    .snapshotChanges()
    .subscribe(prompt => {
      if(prompt.payload.exists()){
        const promptData = prompt.payload.toJSON();
        this.promptData = promptData;
      }
    })
  }

  async submitStory(){
    this.spinner.show();
    if(!this.authDetails){
      this.route.navigate(['/login']);
      return false;
    }
    if(this.promptString == '') alert('Story should not be empty');
    else {
      let stURL = '';
      const stSnip = this.promptString.substr(0, 180);
      const storyID = await this._storyService.getStoryUUID();
      const path = `/stories/${this.authDetails.UUID}/${storyID}`;
      await this._storyService.storeStoryInStorage(this.promptString, path);
      await this._storyService.getStoryDownloadURL(this.authDetails.UUID, storyID)
      .subscribe(async (url) => {
        stURL = url;
        const storyDataSet = {
          isApproved : false,
          isDeleted : false,
          isDraft : false,
          isPending : false,
          isReported : false,
          len : this.stringlengthLimit,
          likesCount : 0,
          promptID : this.promptID,
          stID : storyID,
          stSnip : stSnip,
          stURL : stURL,
          time : { time : -1 * Date.now() },
          userID : this.authDetails.UUID,
          userImageURL : this.authDetails.picture,
          userName : this.authDetails.name
        };
        const updateData = {
          isDraft: false,
          stID: storyID,
          stSnip: stSnip,
          stURL: stURL
        }
        this.spinner.hide();
        alert('Story has been submitted successfully')
        await this._storyService.saveStory(storyID, storyDataSet);
        await this._userService.updateUserDetail(`${this.authDetails.UUID}/stories/${storyID}`, updateData);
        this.route.navigate(['/story-list'], {queryParams: {id: this.promptID}})
      });
      
    }
 
  }


} //class ends here...