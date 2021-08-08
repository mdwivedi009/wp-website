import { MediaMatcher } from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit, OnDestroy,AfterViewInit} from '@angular/core';
import { InteractionService } from 'app/modules/core/services/interaction.service';
import { MenuItems } from '../../shared/menu-items/menu-items';

@Component({
  selector: 'app-interaction-feed',
  templateUrl: './interaction-feed.component.html',
  styleUrls: ['./interaction-feed.component.scss']
})
export class InteractionFeedComponent implements OnInit {

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  authUserDetails: any;
  interactionList: any = [];
  promptIDList: any;
  userIDListForPromptLikes: any
  tempList: any = [];
  var2: any = [];
  dataSet: any;
  temp2: any;
  temp3: any;
  promptLikesFinal: any;
  storyIDList: any;
  var3: any = [];
  storyLikesFinal: any;
  storyCommentFinal: any
  followersFinal: any;
  commentReplyFinal: any;
  finalDataSet: any = [];
  promptLikeTemp: any = [];
  storyLikeTemp: any = [];
  storyCommentTemp: any = [];
  followersTemp: any = [];
  commentReply: any = [];

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private _interactionService: InteractionService,
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.getAuthUserDetails();
  }

  async getAuthUserDetails() {
    const temp = localStorage.getItem('authDetails');
    if(temp){
      this.authUserDetails = JSON.parse(temp);
      await this.getPromptsLikeNotification();
      await this.getStoryLikeNotification();
      await this.getFollowersList();
      await this.getCommentReplyNotification();
    }
  }

  getPromptsLikeNotification(){
    this._interactionService.getPromptsLikes(this.authUserDetails.UUID)
    .subscribe(response => {
      const tempData:any = response[0];
      const temp: any = response[0];
      this.dataSet = response[0];
      if(temp){
      this.promptIDList = Object.keys(temp); 
      this.promptIDList.forEach((element:any, index:any) => {
        const var1 = tempData[element]
        this.var2.push(Object.keys(var1))
      });
      this.promptIDList.forEach((promptID: any) => {
        this.var2.forEach((userIDList: any) => {
          userIDList.forEach((userID: any) => {
            if(this.dataSet[promptID][userID]){
              this.dataSet[promptID][userID]['promptID'] = promptID;
              this.dataSet[promptID][userID]['type'] = 'promptLike';
            }
            if(this.dataSet[promptID][userID])
            this.promptLikeTemp.push(this.dataSet[promptID][userID]);
          });
        });
      });
    }
      this.temp2 = [...new Set(this.promptLikeTemp)];
      this.promptLikesFinal = this.temp2;
    })
  }

  getStoryLikeNotification(){
    this._interactionService.getStoriesLikes(this.authUserDetails.UUID)
    .subscribe(response => {
      if(response[0]) {
      this.getStoryCommentNotification(response[0]);
      const tempData:any = response[1];
      const temp: any = response[1];
      this.dataSet = response[1];
      if(temp){
      this.storyIDList = Object.keys(temp); 
      this.storyIDList.forEach((element:any, index:any) => {
        const var1 = tempData[element]
        this.var3.push(Object.keys(var1))
      });
      this.storyIDList.forEach((storyID: any) => {
        this.var3.forEach((userIDList: any) => {
          userIDList.forEach((userID: any) => {
            if(this.dataSet[storyID][userID]){
              this.dataSet[storyID][userID]['storyID'] = storyID;
              this.dataSet[storyID][userID]['type'] = 'storyLike';
            }
            if(this.dataSet[storyID][userID])
            this.storyLikeTemp.push(this.dataSet[storyID][userID]);
          });
        });
      });
    }
      this.temp3 = [...new Set(this.storyLikeTemp)];
      this.storyLikesFinal = this.temp3;
    }
    })
  }

  getStoryCommentNotification(storyCommentList: any){
    const tempData:any = storyCommentList;
    const temp: any = storyCommentList;
    this.dataSet = storyCommentList;
    if(temp){
    this.storyIDList = Object.keys(temp); 
    this.storyIDList.forEach((element:any, index:any) => {
      const var1 = tempData[element]
      this.var3.push(Object.keys(var1))
    });
    this.storyIDList.forEach((storyID: any) => {
      this.var3.forEach((commentIDList: any) => {
        commentIDList.forEach((commentID: any) => {
          if(this.dataSet[storyID][commentID]){
            this.dataSet[storyID][commentID]['storyID'] = storyID;
            this.dataSet[storyID][commentID]['commentID'] = commentID;
            this.dataSet[storyID][commentID]['type'] = 'storyComment';
          }
          if(this.dataSet[storyID][commentID])
          this.storyCommentTemp.push(this.dataSet[storyID][commentID]);
        });
      });
    });
  }
    this.temp2 = [...new Set(this.storyCommentTemp)];
    this.storyCommentFinal = this.temp2;
  }

  getFollowersList(){
    this._interactionService.getFollowersList(this.authUserDetails.UUID)
    .subscribe(response => {
      this.followersFinal = response;
      this.followersFinal.forEach((element: any, index: any) => {
        this.followersFinal[index]['type'] = 'follow';
      });
    })
  }

  getCommentReplyNotification(){
    this._interactionService.getCommentReplyList(this.authUserDetails.UUID)
    .subscribe(response => {
      if(response){
      const tempData:any = response;
      const temp: any = response;
      this.dataSet = response;
      if(temp){
      this.storyIDList = Object.keys(temp); 
      this.storyIDList.forEach((element:any, index:any) => {
        const var1 = tempData[element]
        this.var3.push(Object.keys(var1))
      });
      this.storyIDList.forEach((storyID: any) => {
        this.var3.forEach((userIDList: any) => {
          userIDList.forEach((userID: any) => {
            if(this.dataSet[storyID][userID]){
              this.dataSet[storyID][userID]['commentID'] = storyID;
              this.dataSet[storyID][userID]['replyID'] = userID;
              this.dataSet[storyID][userID]['type'] = 'commentReply';
            }
            if(this.dataSet[storyID][userID])
            this.commentReply.push(this.dataSet[storyID][userID]);
          });
        });
      });
    }
      this.temp2 = [...new Set(this.commentReply)];
      this.commentReplyFinal = this.temp2;
    }
      this.mergerAllNotification();
    })
  }

  mergerAllNotification(){
    if(this.promptLikesFinal)
    this.finalDataSet.push(this.promptLikesFinal);
    if(this.followersFinal)
    this.finalDataSet.push(this.followersFinal);
    if(this.storyLikesFinal)
    this.finalDataSet.push(this.storyLikesFinal);
    if(this.storyCommentFinal)
    this.finalDataSet.push(this.storyCommentFinal);
    if(this.commentReplyFinal)
    this.finalDataSet.push(this.commentReplyFinal);
    this.finalDataSet = this.finalDataSet.flat();
    function compare(a: any, b:any) {
      const aDate = new Date(a.time);
      const bDate = new Date(b.time);
      let comparison = 0;
      if (aDate > bDate) {
        comparison = 1;
      } else if (aDate < bDate) {
        comparison = -1;
      }
      return comparison;
    }
    this.finalDataSet.sort(compare);
    this.finalDataSet = this.finalDataSet.slice().reverse();
    console.log(this.finalDataSet);
  }

  hideNotification() {
    this.finalDataSet = undefined;
  }

}
