import { MediaMatcher } from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit, OnDestroy,AfterViewInit} from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { CommentService } from 'app/modules/core/services/comment.service';
import { InteractionService } from 'app/modules/core/services/interaction.service';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { CommonService } from 'app/modules/core/services/common.service';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-see-replies',
  templateUrl: './see-replies.component.html',
  styleUrls: ['./see-replies.component.css']
})
export class SeeRepliesComponent implements OnInit {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  commentID: any;
  replyList: any;
  replyString: any;
  authDetails: any;
  commentSet: any;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private router: ActivatedRoute,
    private _commentService: CommentService,
    private _commonService: CommonService,
    private _interactionService: InteractionService,
    private spinner: NgxSpinnerService,
    private route: Router
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
      this.commentID = params.id;
      this.getReplyForComment();
      this.getCommentDetails();
      this.getAuthDetails();
    })
  }

  
  getReplyForComment(){
    this._commentService.getReplyForComment(this.commentID).subscribe(reply => {
      this.replyList = Object.values(reply);
      this.replyList.map((comment: any, index: any) => {
      if(comment.replies){
         let temp: any = Object.keys(comment.replies);
         this.replyList[index].replyLength = temp.length
        }
      })
      // console.log(this.replyList);
    })
  }

  getCommentDetails(){
    this._commentService.getRequestCreatorById(this.commentID)
    .snapshotChanges()
    .subscribe(response => {
      if(response.payload.exists()){
        this.commentSet=response.payload.toJSON();
        console.log(this.commentSet);
      }
      
    })
  }

  getAuthDetails() {
    const temp = localStorage.getItem('authDetails');
    if(temp) {
      this.authDetails = JSON.parse(temp);
    }
  }

  handleReply(event: any) {
    this.replyString = event.target.innerText;
  }
  replyToReply(reply: any) {
    if(this.authDetails == null || this.authDetails == undefined){
      this.route.navigate(['/login']);
    }
    this._commonService.commentSet = reply;
    this.route.navigate(['/reply']);
  }

  async sendReply() {

    if(this.replyString == ''){
      alert('reply can not be empty');
      return false;
    }
    this.spinner.show();
 
    setTimeout(() => {
      /** spinner ends after 2 seconds */
      this.spinner.hide();
    }, 2000); 
    const commentKey = this._commentService.getCommentUUID()
    const updateData = {
      cID: commentKey,
      cText: this.replyString,
      inReplyTo: this.commentID,
      storyID: this.replyList[0].storyID,
      time: {time:-1 * Date.now()},
      userEmail: this.authDetails.email,
      userID: this.authDetails.UUID,
      userImageURL: this.authDetails.picture,
      userName: this.authDetails.name
    };
    // console.log(updateData);
    await this._commentService.saveReply(commentKey, updateData);
    await this._commentService.updateCommentReply(this.commentID, commentKey);
    await this.saveNotification(this.commentID, commentKey);
  }

  saveNotification(commentKey: any, replyID: any){
    const updateData = {
      time: Date.now(),
      userID: this.authDetails.UUID,
      userImageURL: this.authDetails.picture,
      userName: this.authDetails.name
    };
    return this._interactionService.saveNotificationForReply(this.commentSet.userID, commentKey, replyID, updateData);
  }

  

}

