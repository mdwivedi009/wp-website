import { MediaMatcher } from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit, OnDestroy,AfterViewInit} from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CommentService } from 'app/modules/core/services/comment.service';
import { CommonService } from 'app/modules/core/services/common.service';
import { MenuItems } from '../../shared/menu-items/menu-items';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  storyID: any;
  commentList: any = [];
  authDetails: any;
  commentString: any;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private router: ActivatedRoute,
    private _commentService: CommentService,
    private _commonService: CommonService,
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
      this.storyID = params.storyID;
      this.getAuthDetails()
      this.getCommentForStory();
    })
  }

  getCommentForStory(){
    this.commentList = [];
    let temp: any
    this._commentService.getCommentForStory(this.storyID)
    .subscribe(comment => {
      let tempData = comment.slice().reverse();
      tempData.forEach((comment: any,index: any) => {
        if((!comment.hasOwnProperty('inReplyTo')) && !(this.commentList.some((com: any) => com.cID === comment.cID))) {
          this.commentList.push(comment);  
        }
      });
      let replyLength = this.commentList.map((comment: any, index: any) => {
        if(comment.replies){
         temp = Object.keys(comment.replies);
         this.commentList[index].replyLength = temp.length
        }
      })
    })
  }

  getAuthDetails(){
    const temp = localStorage.getItem('authDetails');
    if(temp){
      this.authDetails = JSON.parse(temp);
    }
  }

  reply(comment: any) {
    if(this.authDetails == null || this.authDetails == undefined){
      this.route.navigate(['/login']);
    }
    this._commonService.commentSet = comment;
    this.route.navigate(['/reply']);
  }

  handleComment(event:any){
    this.commentString = event.target.innerText;
  }

  async sendComment(){
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
      time: {time: -1 * Date.now()},
      userEmail: this.authDetails.email,
      userID: this.authDetails.UUID,
      userImageURL: this.authDetails.picture,
      userName: this.authDetails.name
    };
    await this._commentService.saveComment(updateData);
    await this._commentService.updateCommentForStory(this.storyID, commentKey);
    window.location.reload();
  }

}
