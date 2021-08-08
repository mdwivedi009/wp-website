import { MediaMatcher } from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit, OnDestroy,AfterViewInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService } from 'app/modules/core/services/prompt.service';
import { StoriesService } from 'app/modules/core/services/stories.service';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { HttpClient } from '@angular/common/http';
import { CommentService } from 'app/modules/core/services/comment.service';
import { CommonService } from 'app/modules/core/services/common.service';
import { InteractionService } from 'app/modules/core/services/interaction.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-read-page',
  templateUrl: './read-page.component.html',
  styleUrls: ['./read-page.component.css']
})
export class ReadPageComponent implements OnInit {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  storyID: any = '';
  storySet: any;
  completeStory: string = '';
  commentList: any;
  commentSet: any = [];
  authDetails: any;
  commentString: string = '';
  
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private router: ActivatedRoute,
    private _storyService: StoriesService,
    private _promptService: PromptService,
    private http: HttpClient,
    private _commentService: CommentService,
    private route: Router,
    private _commonService: CommonService,
    private _interactionService: InteractionService,
    private spinner: NgxSpinnerService,
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  comment(event:any){
    console.log(event.target.value)
    this.comment(event.Target.value)
    }

    
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      this.storyID = params.storyID;
      this.getStory();
      this.getAuthDetails();
      
    })
   
  }

  getAuthDetails(){
    const temp = localStorage.getItem('authDetails');
    if(temp) {
      this.authDetails = JSON.parse(temp);
    }
  }

  getStory(){
    this._storyService.getRequestCreatorById('Stories', this.storyID)
    .snapshotChanges()
    .subscribe(story=> {
      if(story.payload.exists()){
        this.storySet = story.payload.toJSON();
        this._promptService.getRequestCreatorById('Prompts', this.storySet.promptID)
        .snapshotChanges()
        .subscribe(async (prompt) => {
          this.storySet.promptSet = prompt.payload.toJSON();
          const response = await fetch(this.storySet.stURL);
          let text = await response.text();
          this.storySet.completeStory = text.substring(184);
          if(this.storySet.comments){
            this.commentList = Object.keys(this.storySet.comments);
            await this.getCommentsForStory();
          }
        })
      }
    })
  }

  getCommentsForStory() {
    this.commentList.forEach((commentID:any,index: any) => {  
      this._commentService.getRequestCreatorById(commentID)
      .snapshotChanges()
      .subscribe(comment => {
        if(comment.payload.exists()){
          let temp: any = comment.payload.toJSON();
          this.commentSet.push(temp);
          const tempData: any = this.commentSet;
          if(tempData[0].replies){
            let tempReply = Object.keys(tempData[0].replies)
            this.commentSet[index].replyLength = tempReply;
          }
        }
      })    
    });
  }

  reply(comment: any) {
    if(this.authDetails == null || this.authDetails == undefined){
      this.route.navigate(['/login']);
      return false;
    }
    this._commonService.commentSet = comment;
    this.route.navigate(['/reply']);
  }

  handleComment(event:any){
    this.commentString = event.target.innerText;
  }

  async sendComment(){
    this.spinner.show();
    if(this.authDetails == null ||  this.authDetails == undefined){
      this.route.navigate(['/login']);
      return false;
    }
    if(this.commentString == ''){
      alert('Comment can not be empty');
      return false;
    }
 
    const commentKey = this._commentService.getCommentUUID();
    const updateData = {
      cID: commentKey,
      cText: this.commentString,
      storyID: this.storyID,
      time: {time:-1 * Date.now()},
      userEmail: this.authDetails.email,
      userID: this.authDetails.UUID,
      userImageURL: this.authDetails.picture,
      userName: this.authDetails.name
    };
    await this._commentService.saveComment(updateData);
    await this._commentService.updateCommentForStory(this.storyID, commentKey);
    if(this.authDetails.UUID !== this.storySet.userID)
    await this.saveNotification(commentKey);
    let temp: any = document.getElementById('editMe');
    temp.innerText = null;
    this.spinner.hide();
  }

  saveNotification(commentID: any){
   const updateData = {
      time: Date.now(),
      userID: this.authDetails.UUID,
      userImageURL: this.authDetails.picture,
      userName: this.authDetails.name
    };
    return this._interactionService.saveNotificationForComment(this.storySet.userID, this.storyID, commentID, updateData)
  }

}


