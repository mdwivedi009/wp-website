import { Component, AfterViewInit, OnInit, HostListener } from "@angular/core";
import { Router, RouterEvent } from "@angular/router";
import {
  NgbActiveModal,
  NgbModal,
  ModalDismissReasons,
} from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "app/modules/core/services/common.service";
import { StoriesService } from "app/modules/core/services/stories.service";
import { UserService } from "app/modules/core/services/user.service";
import { PromptService } from "../modules/core/services/prompt.service";
import { InteractionService } from 'app/modules/core/services/interaction.service';
import { ClipboardService } from 'ngx-clipboard';


declare var require: any;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})

export class DashboardComponent implements OnInit, AfterViewInit {
  constructor(
    public modalService: NgbModal,
    private _promptService: PromptService,
    private router: Router,
    private _userService: UserService,
    private _commonService: CommonService,
    private _storyService: StoriesService,
    private _interactionService: InteractionService,
    private _clipboardService: ClipboardService,



  ) {
    this.sortType = 'recent';
    this.getPromptList();
    this.getFirstPrompt();
  }
  scrollLimit: number = 625;
  selectedGenre: any = [];
  selectedGenre2: any = [];
  authToken: any = undefined;
  progressBarMode: any = undefined;
  currentUrl: any = undefined;
  authDetails: any;
  profilePic = "";
  promptString: string = "";
  stringLength: number = 0;
  stringLengthLimit: number = 240;
  promptSet: any = [];
  promptSetTemp: any = [];
  sliderButton = ["Tragedy", "Fantasy", "Adventure", "Science", "Mythology", "Mystery", "Drama",
    "Romance", "Action", "Satire", "Horror", "Tragic", "Young", "Dystopia", "Thriller"];
  sliderButton2 = [{ Tragedy: "Trag" }, { Fantasy: "Fant" }, { Adventure: "Adv" }, { Science: "Scifi" }, { Mythology: "Myth" },
  { Mystery: "Myst" }, { Drama: "Drama" }, { Romance: "Rom" }, { Action: "Act" }, { Satire: "Sat" }, { Horror: "Hor" }, { Tragic: "Tragicom" },
  { Young: "YA" }, { Dystopia: "Dyst" }, { Thriller: "Thril" }];
  filterGenre = '';
  tempArray: string[] = [];
  clickedClass: boolean = false;
  nextScrolledCheck: number = 1800;
  startKey: String = '';
  endKey: String = '';
  tempData: any = [];
  promptIDCheck: string = '';
  checklike: boolean = true;
  sortType: string = '';
  includeMore = 0;
  facebookLink: string = '';
  whatsappLink: string = '';
  googlePlusLink: string = '';
  twitterLink: string = '';
  linkedinLink: string = '';
  prompt: any;
  linkCopied: string = '';
  addClass: any;
  removeClass: any;

  ngOnInit() {
    this.sortType = 'recent';
    if (this.authToken !== undefined) {
      if (this.authDetails == undefined) {
        setTimeout(() => { this.getAuthDetails(); this.getAuthUserDetails(); }
          , 1000);
      }
    }
  }
  async ngAfterViewInit() {
    await this.getAuthToken();
    await this.getAuthDetails();
    if (this.authDetails) {
      await this.getAuthUserDetails();
    }
    window.addEventListener('scroll', this.scrolling, true)
    if (this.authDetails == undefined) {
      setTimeout(() => this.getAuthDetails(), 3000);
    }
    console.log(this.authDetails);
  }

  scrolling = (s: any) => {
    if (s.target.scrollTop >= 1800) {
      if (this.nextScrolledCheck - s.target.scrollTop <= 0) {
        this.nextScrolledCheck += 1700;
        if (this.startKey == this.promptIDCheck) {
          return false;
        }
        if (this.sortType == 'likesCount') {
          this.includeMore = this.includeMore + 9;
        }
        this.getPromptList();
      }
    }
  }

  open(content: any) {
    if (this.authDetails == undefined) {
      this.router.navigate(['/login']);
      return false;
    }
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title", centered: true })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }

  leftclick() {
    let element = <HTMLElement>document.getElementById("content");
    if (element.scrollLeft > 0) {
      element.scrollLeft -= 73;
    } else return false;
  }

  rightclick() {
    let element = <HTMLElement>document.getElementById("content");
    if (element.scrollLeft < this.scrollLimit) {
      element.scrollLeft += 73;
    } else return false;
  }

  selectgenre(event: any) {
    if (event.target.checked == true) {
      if (!this.selectedGenre.includes(event.target.value)) {
        this.selectedGenre.push(event.target.value);
      }
    } else {
      const index = this.selectedGenre.indexOf(event.target.value);
      this.selectedGenre.splice(index, 1);
    }
  }
  myFunction(data: any) {
    const tempFilterGenre = this.filterGenre
    this.filterGenre = data;
    this.clickedClass = data;
    this.changeGenreName();
    if (tempFilterGenre == this.filterGenre) {

      //alternative 1 to cancel filter on consecutive click on filter buttons
      // this.filterGenre = '';
      // this.clickedClass=false;
      // this.startKey='';
      // this.checklike=false;

      //alternative 2 to cancel filter on consecutive click on filter buttons
      window.location.reload();
    }
    this.getPromptList();
    this.getFirstPrompt();
  }


  changeGenreName() {
    if (this.filterGenre == 'Tragedy') {
      this.filterGenre = 'Trag';
    }
    if (this.filterGenre == 'Fantasy') {
      this.filterGenre = 'Fant';
    }
    if (this.filterGenre == 'Adventure') {
      this.filterGenre = 'Adv';
    }
    if (this.filterGenre == 'Science') {
      this.filterGenre = 'Scifi';
    }
    if (this.filterGenre == 'Mythology') {
      this.filterGenre = 'Mytho';
    }
    if (this.filterGenre == 'Mystery') {
      this.filterGenre = 'Myst';
    }
    if (this.filterGenre == 'Drama') {
      this.filterGenre = 'Drama';
    }
    if (this.filterGenre == 'Romance') {
      this.filterGenre = 'Rom';
    }
    if (this.filterGenre == 'Action') {
      this.filterGenre = 'Act';
    }
    if (this.filterGenre == 'Satire') {
      this.filterGenre = 'Sat';
    }
    if (this.filterGenre == 'Horror') {
      this.filterGenre = 'Hor';
    }
    if (this.filterGenre == 'Tragic') {
      this.filterGenre = 'Tragcom';
    }
    if (this.filterGenre == 'Young') {
      this.filterGenre = 'YA';
    }
    if (this.filterGenre == 'Dystopia') {
      this.filterGenre = 'Dyst';
    }
    if (this.filterGenre == 'Thriller') {
      this.filterGenre = 'Thril';
    }
  }

  handlePromptString(event: any) {
    this.promptString = event.target.value;
    this.stringLength = event.target.value.length;
  }

  getAuthToken() {
    this.authToken = localStorage.getItem("accessToken");
  }

  getAuthDetails() {
    const temp = localStorage.getItem("authDetails");
    if (temp) {
      this.authDetails = JSON.parse(temp);
      if (typeof this.authDetails.picture == "object")
        this.profilePic = this.authDetails.picture.data.url;
      if (typeof this.authDetails.picture == "string")
        this.profilePic = this.authDetails.picture;
    }
  }

  async getPromptList() {
    const collection = 'Prompts';
    if (this.filterGenre == '' && this.sortType == 'recent') {
      await this._promptService.getRequestCreator(collection, this.startKey).subscribe((data) => {
        const temp: any = data;
        this.startKey = temp[0].promptID;
        data.shift();
        if (this.checklike) {
          this.promptSet = this.promptSet.concat(data.slice().reverse());
          this.promptSetTemp = this.promptSetTemp.concat(data.slice().reverse());
        }
        if (!this.checklike) {
          this.promptSet = this.promptSet = data.slice().reverse();
          this.promptSetTemp = this.promptSetTemp = data.slice().reverse();
        }
        this.promptSet = this.promptSet.filter((prompt: any) => prompt.isApproved == true);
        this.promptSet.forEach(async (element: any, index: any) => {
          await this._storyService.getStoryFromPrompt(element.promptID).subscribe(result => {
            this.promptSet[index].storyList = result;
          })
        });
      });
    }
    if (this.filterGenre != '') {
      this.filterPromptSet();
    }
    if (this.filterGenre == '' && this.sortType == 'likesCount') {
      console.log("sortprompts is working")
      this._promptService.getSortedPrompts(this.sortType, this.includeMore).subscribe((data) => {
        this.promptSet = this.promptSet = data.slice().reverse();
        this.promptSetTemp = this.promptSetTemp = data.slice().reverse();

        this.promptSet.forEach((element: any, index: any) => {
          this._storyService.getStoryFromPrompt(element.promptID).subscribe(result => {
            this.promptSet[index].storyList = result;
          })
        });
        this.promptSet = this.promptSet.filter((prompt: any) => prompt.isApproved == true);
      });
    }
  }

  sortPrompts(event: any) {
    if (event.target.value == 'likes') {
      this.sortType = 'likesCount';
      this.startKey = ''
      this.promptSet = []
      this.promptSetTemp = []
      this.getFirstPrompt();
      this.getPromptList();
      //old code
      // if(this.filterGenre == '') {
      //   this._promptService.getSortedPrompts(this.sortType, '').subscribe((data) => {
      //     this.promptSet = data.slice().reverse();
      //     this.promptSetTemp = data.slice().reverse();
      //     if(this.startKey !== ''){
      //       const temp = data.slice().reverse();
      //       this.promptSet = [...this.promptSet, ...temp]
      //     }
      //     if(this.promptSet) this.startKey = this.promptSet[this.promptSet.length-1].promptID;
      //   });
      // }
      // else {
      //   this.filterPromptSet();
      // }
    }
    if (event.target.value == 'recent') {
      this.startKey = ''
      this.promptSet = []
      this.promptSetTemp = []
      this.sortType = 'recent';
      this.getFirstPrompt();
      this.getPromptList();
    };
  }

  getFirstPrompt() {
    if (this.sortType == 'likesCount') {
      this._promptService.getFirstRecordFromSortedPrompt().subscribe((data: any) => {
        this.promptIDCheck = data[0].promptID;
      })
    }
    if (this.sortType == 'recent') {
      this._promptService.getFirstRecordFromPrompt().subscribe((data: any) => {
        this.promptIDCheck = data[0].promptID;
      })
    }
  }

  filterPromptSet() {
    this.clickedClass = true;
    //new alternative to filter prompts according to specific genre
    this.tempArray = [];
    this._promptService.getRequestCreatorById('Genres', this.filterGenre).snapshotChanges().subscribe(response => {
      if (response.payload.exists()) {
        const promptIds: any = response.payload.toJSON();
        Object.keys(promptIds).reverse().forEach((element: any, index: any) => {
          this._promptService.getRequestCreatorById('Prompts', element).snapshotChanges()
            .subscribe(result => {
              if (result.payload.exists()) {
                const prompt: any = result.payload.toJSON();
                if(prompt.isApproved == true){
                  this.tempArray.push(prompt);
                }               
              }
            })
        })
      }
    })
    this.promptSet = this.tempArray;



    //old alternative to filter prompt of specific genre
    // this.tempArray = [];
    // this.promptSetTemp.map((prompt: any) => {
    //   if(prompt.genre.includes(this.filterGenre)){
    //     const tempdata = prompt;
    //     this.tempArray.push(tempdata);
    //   }
    // })
    // this.promptSet = this.tempArray;
  }

  rearrageGenre() {
    this.selectedGenre.map((genre: any, index: any) => {
      if (genre == 'Tragedy') {
        this.selectedGenre2.push('Trag');
      }
      if (genre == 'Fantasy') {
        this.selectedGenre2.push('Fant');
      }
      if (genre == 'Adventure') {
        this.selectedGenre2.push('Adv');
      }
      if (genre == 'Science fiction') {
        this.selectedGenre2.push('Scifi');
      }
      if (genre == 'Mythology') {
        this.selectedGenre2.push('Mytho');
      }
      if (genre == 'Mystery') {
        this.selectedGenre2.push('Myst');
      }
      if (genre == 'Drama') {
        this.selectedGenre2.push('Drama');
      }
      if (genre == 'Romance') {
        this.selectedGenre2.push('Rom');
      }
      if (genre == 'Action') {
        this.selectedGenre2.push('Act');
      }
      if (genre == 'Satire') {
        this.selectedGenre2.push('Sat');
      }
      if (genre == 'Horror') {
        this.selectedGenre2.push('Hor');
      }
      if (genre == 'Tragic comedy') {
        this.selectedGenre2.push('Tragcom');
      }
      if (genre == 'Young Adult') {
        this.selectedGenre2.push('YA');
      }
      if (genre == 'Dystopia') {
        this.selectedGenre2.push('Dyst');
      }
      if (genre == 'Thriller') {
        this.selectedGenre2.push('Thril');
      }
    })
  }

  async createPrompt() {
    this.selectedGenre2 = [];
    await this.rearrageGenre();
    if (this.promptString == '' || this.selectedGenre.length == 0) return false;
    const uuid = await this.getUUIDForPrompt();
    const savedResponse = await this._promptService.savePrompt({
      genre: this.selectedGenre2,
      isApproved: false,
      isDeleted: false,
      isPending: true,
      isReported: false,
      promptID: uuid,
      likesCount: 0,
      time: { time: -1 * Date.now() },
      userID: this.authDetails.UUID,
      userImageURL: this.profilePic,
      userName: this.authDetails.name,
      userPrompt: this.promptString
    });
    await this.setPromptIDForUser(uuid);
    this.modalService.dismissAll();
    await this.selectedGenre2.forEach((element: any) => {
      this._promptService.addPromptToGenres(element, uuid);
    })
  }

  async confirmSubmit(content: any) {
    await this.createPrompt();
    this.selectedGenre = []
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title", centered: true })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }

  submitOneMore(content: any) {
    this.modalService.dismissAll();
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title", centered: true })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }

  setPromptIDForUser(uuid: any) {
    const tempResponse = this._userService.updateRequestCreator(this.authDetails.UUID, uuid, uuid);
  }

  getUUIDForPrompt() {
    const tempid = this._promptService.getPromptUUID()
    return tempid;
  }

  async promptLikeDislike(prompt: any) {
    this.checklike = false;
    if (localStorage.getItem("authDetails")) {
      if (prompt.likes && prompt.likes.hasOwnProperty(this.authDetails.UUID)) {
        await this._userService.promptDislikeByUser(this.authDetails.UUID, prompt.promptID, prompt.promptID);
        await this._promptService.promptDislike(prompt.promptID, this.authDetails.UUID, this.authDetails.UUID);
        await this._promptService.decreaseLikeCount(prompt.promptID, prompt.likesCount - 1, '');
      } else {
        await this._userService.promptLikeByUser(this.authDetails.UUID, prompt.promptID, prompt.promptID);
        await this._promptService.promptLike(prompt.promptID, this.authDetails.UUID, this.authDetails.UUID);
        await this._promptService.increaseLikeCount(prompt.promptID, prompt.likesCount + 1, '');
        await this.saveNotification(prompt);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  saveNotification(prompt: any) {
    const updateData = {
      time: Date.now(),
      userID: this.authDetails.userSet.userID,
      userImageURL: this.authDetails.userSet.userImageURL,
      userName: this.authDetails.userSet.userName
    };
    return this._interactionService.saveNotificationForLike(prompt.userID, prompt.promptID, this.authDetails.UUID, updateData);
  }

  async userFollowUnfollow(prompt: any) {
    if (localStorage.getItem("authDetails")) {
      if (this.authDetails.UUID !== prompt.userID) {
        if (this.authDetails.userSet.following && this.authDetails.userSet.following.hasOwnProperty(prompt.userID)) {
          await this._userService.removeUserFromFollower(prompt.userID, this.authDetails.UUID, this.authDetails.UUID)
          await this._userService.removeUserFromFollowing(this.authDetails.UUID, prompt.userID, prompt.userID)
        } else {
          await this._userService.addUserToFollower(prompt.userID, this.authDetails.UUID, this.authDetails.UUID)
          await this._userService.addUserToFollowing(this.authDetails.UUID, prompt.userID, prompt.userID)
          if (this.authDetails.UUID !== prompt.userID)
            await this.saveNotificationForFollow(prompt);
        }
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  saveNotificationForFollow(prompt: any) {
    const updateData = {
      time: Date.now(),
      userID: this.authDetails.userSet.userID,
      userImageURL: this.authDetails.userSet.userImageURL,
      userName: this.authDetails.userSet.userName
    };
    return this._interactionService.saveNotificationForFollow(prompt.userID, this.authDetails.userSet.userID, updateData)
  }

  getAuthUserDetails() {
    let tempDetails: any;
    this._userService.getRequestCreatorById('Users', this.authDetails.UUID).snapshotChanges().subscribe(response => {
      if (response.payload.exists()) {
        tempDetails = response.payload.toJSON();
        this.authDetails['userSet'] = tempDetails;
      }
    })
  }

  async bookmarkPrompt(prompt: any) {
    if (localStorage.getItem("authDetails")) {
      if (this.authDetails.userSet.bookmarks && this.authDetails.userSet.bookmarks.hasOwnProperty(prompt.promptID))
        await this._promptService.promptRemoveBookmark(this.authDetails.UUID, prompt.promptID, prompt.promptID);
      else
        await this._promptService.promptBookmark(this.authDetails.UUID, prompt.promptID, prompt.promptID);
    }
    else {
      this.router.navigate(['/login']);
    }
  }


  writeStory(prompt: any) {
    this.router.navigate(['/write-story']);
  }

  sharePrompt(prompt: any, content: any) {
    this.linkCopied = '';
    this.prompt = prompt;
    const postUrl = `http://3.113.55.162/story-list?id=${prompt.promptID}`
    const postTitle = prompt.userPrompt
    this.facebookLink = `https://www.facebook.com/sharer.php?u=${postUrl}`;
    this.whatsappLink = `https://web.whatsapp.com/send?text=${postUrl}`;
    this.twitterLink = `https://twitter.com/share?url=${postUrl}&text=${postTitle}`;
    this.linkedinLink = `https://www.linkedin.com/shareArticle?url=${postUrl}&title=${postTitle}`;
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title", centered: true })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }
  copyPromptLink() {
    this._clipboardService.copy(`http://3.113.55.162/story-list?id=${this.prompt.promptID}`)
    this.linkCopied = 'COPIED!';

  }


} //class ends here
