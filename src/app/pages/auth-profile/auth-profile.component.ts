import { MediaMatcher } from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit, OnDestroy,AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { PromptService } from 'app/modules/core/services/prompt.service';
import { StoriesService } from 'app/modules/core/services/stories.service';
import { UserService } from 'app/modules/core/services/user.service';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { NgbActiveModal, NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { ClipboardService } from 'ngx-clipboard';
@Component({
  selector: 'app-auth-profile',
  templateUrl: './auth-profile.component.html',
  styleUrls: ['./auth-profile.component.css']
})
export class AuthProfileComponent implements OnInit {
  authDetails:any;
  profilePic:string = '';
  followers: Number = 0;
  following: Number = 0;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  value: any;
  promptList: any = [];
  userPrompts: any;
  buttonType = 'prompts';
  storiesList: any = [];
  bookmarksList: any = [];
  likesList: any = [];
  promptGenres:any = [];
  tempPromptGenres:any =[];
  userDetails: any;
  UserId = '';
  selectedGenre: any = [];
  promptId: any;
  followList:any = [];
  followListIds:any = [];
  usersType:any;
  promptUserId='';
  facebookLink: string = '';
  whatsappLink: string = '';
  googlePlusLink: string = '';
  twitterLink: string = '';
  linkedinLink: string = '';
  prompt: any;
  linkCopied:string='';
  tempData:any;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private _userService: UserService,
    private _storiesService: StoriesService,
    private _promptService: PromptService,
    private router: Router,
    public modalService: NgbModal,
    private _clipboardService: ClipboardService,
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
    this.getAuthDetails();
    this.getAuthUserDetails();
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
  getAuthDetails() {
    const temp = localStorage.getItem('authDetails')
   if(temp) {
    this.authDetails = JSON.parse(temp);
    if(typeof this.authDetails.picture == 'object') this.profilePic = this.authDetails.picture.data.url;
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
        if(this.userDetails){
          this.followers = this.userDetails.followers ? Object.keys(userDetails.followers).length : 0;
          this.following = this.userDetails.following ? Object.keys(userDetails.following).length : 0;
        }
        if(this.userDetails.userPrompts) this.getUserPromptList(); 
      }
    })
  }

  getUserPromptList() {
    (this.userDetails.userPrompts);
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

  getUserLikesPrompts() {
    let temp = Object.keys(this.userDetails.likes);
    temp = temp.slice().reverse();
    temp.forEach(async (element) => {
      const temp: any =element;
      let temp1 = this._promptService.getRequestCreatorById('Prompts', element).snapshotChanges().subscribe(res => {
        if(res.payload.exists()){
          this.likesList.push(res.payload.toJSON());
        }
      })
    });
  }

  getuserStoriesList() {
    this.spinner.show();
    this._storiesService.getStoriesForUser('Stories', this.authDetails.UUID).subscribe(result => {
     let temp1 = result.slice().reverse();
      temp1.forEach(async (element: any, index) => {
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
        const response = await fetch(element.stURL);
        let text = await response.text();
        this.storiesList[index].completeStory = text.substring(184);
      })
    })
    this.spinner.hide();
  }

  clicked(button:any) {
    this.buttonType = button;
    if(button == 'stories'){
      this.storiesList = [];
      if(this.userDetails.stories !== undefined) this.getuserStoriesList();
    }
    if(button == 'bookmarks'){
      this.bookmarksList = [];
      if(this.userDetails.bookmarks !== undefined) this.getUserBookmarkPrompts();
    }
    if(button == 'likes'){
      this.likesList = [];
      if(this.userDetails.likes !== undefined) this.getUserLikesPrompts();
    }
  }

  navigate(story: any){
    this.router.navigate(['/read-story'], { queryParams:{storyID : story.stID }});
  }
  navigateToUser(user:any){
    this.modalService.dismissAll();
    this.router.navigate(['/user-profile'], { queryParams:{id : this.followListIds[this.followList.indexOf(user)] }});
  }
  open(content: any){
    if(this.authDetails == undefined){
      this.router.navigate(['/login']);
      return false;
    }
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }
  openGenres(content: any, genres: any, pId: any,uId: any) {
    this.promptGenres = Object.values(genres);
    this.tempPromptGenres = Object.values(genres);
    this.promptId = pId;
    this.promptUserId=uId;
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title", size: 'lg',centered: true})
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  selectgenre(event: any) {
    this.selectedGenre = this.promptGenres;
    if (event.target.checked == true) {
      if (!this.selectedGenre.includes(event.target.value)) {
        this.selectedGenre.push(event.target.value);
      }
    } else {
      const index = this.selectedGenre.indexOf(event.target.value);
      this.selectedGenre.splice(index, 1);
    }
    this.promptGenres=this.selectedGenre;
    }
  
  async updateGenres() {
    console.log(this.tempPromptGenres);
    console.log(this.promptGenres);
    // console.log(this.selectedGenre);
    this.modalService.dismissAll();
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
    }, 3000);
    if(this.checkNeedForUpdate(this.tempPromptGenres, this.promptGenres)){
    await this._promptService.updateGenreRequest(this.promptId, this.promptGenres);
    this.modifyInGenres(this.tempPromptGenres,this.promptGenres,this.promptId);
    window.alert("Genre updated");
    window.location.reload();
  }
    

    // these alternatives not required since this is already added as *ngIF in ht`ml component
    // // alternative 1 to check wether to update or not
    // if((this.checkNeedForUpdate(this.tempPromptGenres, this.promptGenres))){
    //   console.log("need to update")

    //   // code to update genre in the database
      
    //   this.modalService.dismissAll();
    // } else {
    //   console.log("no need to update")
    //   this.modalService.dismissAll();
    // }
    
  }

  //this function is to add prompt Id to new genres and remove from ones that are not in it's genres more in Database(edit Genre functionality)
  async modifyInGenres(prevGenresSet: any, newGenresSet: any, prId: any){
    let remFromGenres = prevGenresSet.filter((e: any) => !newGenresSet.includes(e));
    let addToGenres = newGenresSet.filter((e: any) => !prevGenresSet.includes(e));
    if (remFromGenres.length){
      // console.log("Remove promptId ("+prId+") from these Genres : ")
      // console.log(remFromGenres)
      remFromGenres.forEach((element: any) => {
        this._promptService.removePromptFromGenres(element,prId);
      });  
    }
    if (addToGenres.length){
      // console.log("Add promptId ("+prId+") to these Genres : ")
      // console.log(addToGenres)
      addToGenres.forEach((element: any) => {
        this._promptService.addPromptToGenres(element,prId);
      }); 
      }
  }
  
  checkNeedForUpdate(previousGenreList: any, genreList: any){
    if(!genreList.length) return false;
    if(previousGenreList.length !== genreList.length){
       return true;
    };
    for(let i = 0; i < previousGenreList.length; i++){
       if(!genreList.includes(previousGenreList[i])){
          return true;
       };
    };
    return false;
 }

  async changeName() {
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 4000);
    await Object.keys(this.userDetails.userPrompts).forEach(prId => {
      let collection = 'Prompts'
      this._userService.updatePromptsUsername(collection,prId,this.userDetails.userName)
    });

   await this._userService.updateStoriesUsername('Stories', this.authDetails.UUID,this.userDetails.userName);
  
 
  await this._userService.saveUserDetails(this.userDetails,this.authDetails.UUID);
  let temp: any = localStorage.getItem('authDetails');
   if(temp) {
      temp = JSON.parse(temp);
      temp.name = this.userDetails.userName
      localStorage.setItem('authDetails', JSON.stringify(temp));
      // window.location.reload();
   }
   setTimeout(() => {window.location.reload();window.alert("Username Updated");}, 3000); 
   
   await this._userService.getCommentList('Comments', this.authDetails.UUID,this.userDetails.userName).subscribe((res:any) => {
    res.forEach((ele:any) => {
      this._userService.updateUsernameforComm(ele.cID,this.userDetails.userName)
    });
  })
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
      this.router.navigate(['/login']);
    }
  }
  async bookmarkPrompt(prompt: any){
    if(localStorage.getItem("authDetails")){
        if(this.authDetails.userSet.bookmarks && this.authDetails.userSet.bookmarks.hasOwnProperty(prompt.promptID))
        await this._promptService.promptRemoveBookmark(this.authDetails.UUID, prompt.promptID, prompt.promptID);
        else
        await this._promptService.promptBookmark(this.authDetails.UUID, prompt.promptID, prompt.promptID);
    }
    else {
      this.router.navigate(['/login']);
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
      this.router.navigate(['/login']);
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

  getFollow(type:any){
    let tempGetFollowList:any=[];
    let tempGetFollowIds:any=[];
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
      }
    })
    });
    this.followList = tempGetFollowList;
    this.followListIds = tempGetFollowIds;
  }
  sharePrompt(prompt: any, content: any) {
    this.linkCopied='';
    this.prompt = prompt;
    const postUrl = `http://3.113.55.162/story-list?id=${prompt.promptID}`
    const postTitle = prompt.userPrompt
    this.facebookLink = `https://www.facebook.com/sharer.php?u=${postUrl}`;
    this.whatsappLink = `https://web.whatsapp.com/send?text=${postUrl}`;
    this.twitterLink = `https://twitter.com/share?url=${postUrl}&text=${postTitle}`;
    this.linkedinLink = `https://www.linkedin.com/shareArticle?url=${postUrl}&title=${postTitle}`;
    this.modalService
    .open(content, { ariaLabelledBy: "modal-basic-title",centered: true })
    .result.then(
      (result) => {},
      (reason) => {}
    ); 
  }
  copyPromptLink() {
    this._clipboardService.copy(`http://3.113.55.162/story-list?id=${this.prompt.promptID}`)
    this.linkCopied='COPIED!';
    
  }
}
