import { MediaMatcher } from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit, OnDestroy,AfterViewInit} from '@angular/core';
import { CommonService } from 'app/modules/core/services/common.service';
import { FirebaseService } from 'app/modules/core/services/firebase.service';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { Location } from '@angular/common'
import { CommentService } from 'app/modules/core/services/comment.service';
import { Router } from '@angular/router';
import { InteractionService } from 'app/modules/core/services/interaction.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  commentSet: any;
  replyString: string = '';
  authDetails: any;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems ,
    private _commonService: CommonService,
    private _location: Location,
    private _commentService: CommentService,
    private route: Router,
    private spinner: NgxSpinnerService,
    private _interactionService: InteractionService,
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    
  }
  promptSet:any;
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }


  ngOnInit() {
    this.commentSet = this._commonService.commentSet;
    if(this.commentSet == null || this.commentSet == undefined){
      this._location.back();
      return false;
    }
    this.getAuthDetails();
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

  async sendReply() {
    if(this.replyString == ''){
      alert('reply can not be empty');
      return false;
    }
    const commentKey = this._commentService.getCommentUUID()
    const updateData = {
      cID: commentKey,
      cText: this.replyString,
      inReplyTo: this.commentSet.cID,
      storyID: this.commentSet.storyID,
      time: {time:-1 * Date.now()},
      userEmail: this.authDetails.email,
      userID: this.authDetails.UUID,
      userImageURL: this.authDetails.picture,
      userName: this.authDetails.name
    };
    await this._commentService.saveReply(commentKey, updateData);
    await this._commentService.updateCommentReply(this.commentSet.cID, commentKey);
    await this.saveNotification(this.commentSet.cID, commentKey);
    this.route.navigate([`/see-replies`], { queryParams: {id: this.commentSet.cID}});
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
    }, 3000); 
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

