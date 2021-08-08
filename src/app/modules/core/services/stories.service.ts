import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from "@angular/fire/database";
import { AngularFireStorage, AngularFireUploadTask,} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StoriesService {

  constructor(private db: AngularFireDatabase, 
    private readonly storage: AngularFireStorage,
    ) {}

  getRequestCreatorById(collection: any, where:any): AngularFireObject<any> {
    return this.db.object(`Online_WP/${collection}/` + where) as AngularFireObject<any>
  }

  getRequestCreator(collection: any, startAtValue: string = '') {
    if(startAtValue == ''){
      return this.db.list(`Online_WP/${collection}`, ref=>ref
      .orderByChild('isReported')
       .equalTo(false)
      .limitToLast(10))
      .valueChanges();
    } else {
      return this.db.list(`Online_WP/${collection}`, ref=>ref
      //  .orderByChild('stID')
      .orderByChild('isReported')
      .equalTo(false)
     .endAt(startAtValue)
      .limitToLast(10))
      .valueChanges();
    }
    
  }
  getStoryPrompts() {
    return this.db.list(`Online_WP/Stories`, ref=>ref
    .orderByChild('isReported')
    .equalTo(true)
    .limitToLast(100)).valueChanges();
  }
  getFirstRecordFromStory() {  
      return this.db.list(`Online_WP/Stories`, ref=>ref
    .limitToFirst(1))
    .valueChanges();
  }
  getFirstRecordFromSortedStories(){
    return this.db.list(`Online_WP/Stories`, ref=>ref
    .orderByChild('likesCount')
    .limitToFirst(1))
    .valueChanges();
  }
  getStoriesForUser(collection: any, userID: any) {
    return this.db.list(`Online_WP/${collection}`, ref=>ref
    .orderByChild('userID')
    .equalTo(userID)
    .limitToLast(5))
    .valueChanges();
  }

  savePrompt (promptDataSet: any) {
    return this.db.database.ref('Online_WP/Prompts').push(promptDataSet);
  }
  
  storyLike(where: any, dataSet: any, key: any) {
    return this.db.database.ref(`Online_WP/Stories/${where}/likes/${key}`).set(dataSet);
  }

  increaseLikeCount(where: any, dataSet: any, key: any){
    return this.db.database.ref(`Online_WP/Stories/${where}/likesCount`).set(dataSet);
  }

  storyDislike(where: any, dataSet: any, key: any) {
    return this.db.database.ref(`Online_WP/Stories/${where}/likes/${key}`).remove();
  }

  decreaseLikeCount(where: any, dataSet: any, key: any){
    return this.db.database.ref(`Online_WP/Stories/${where}/likesCount`).set(dataSet);
  }

  getSortedStories(sortType: any, includeMore:any){
    return this.db.list(`Online_WP/Stories`, ref=>ref
    .orderByChild(sortType)
    .limitToLast(7 + includeMore))
    .valueChanges();
  }
  getStoryUUID() {
    return this.db.database.ref('Online_WP/Stories').push().key;
  }

  saveStory(key: any, storySet: any) {
    return this.db.database.ref(`Online_WP/Stories/${key}`).set(storySet);
  }

  storeStoryInStorage(string: any, path: any) {
    return this.storage.ref(path).putString(string);
  }

  getStoryID(storyUUID: any){
    return this.db.database.ref(`Online_WP/Stories/${storyUUID}`);
  }

  getCompleteStory(userID: string, storyID: any) {
    return this.storage.ref(`/stories/${userID}/${storyID}`).getDownloadURL();
  }

  getStoryDownloadURL(userID: string, storyID: any) {
    return this.storage.ref(`/stories/${userID}/${storyID}`).getDownloadURL();
  }

  getStoryFromPrompt(promptID: any){
    return this.db.list(`Online_WP/Stories`, ref => ref
    .orderByChild('promptID')
    .equalTo(promptID))
    .valueChanges();
  }
  reportedPrompt(where: any){
    console.log(where)
    this.db.database.ref(`Online_WP/Stories/${where}/isReported`).set(true);
    return true;
    
  }
  approveStory(where: any){
    console.log(where);
    this.db.database.ref(`Online_WP/Stories/${where}/isReported`).set(false);
    return true;
  }
  rejectStory(where: any, userID: any){
    console.log({where, userID});
     this.db.database.ref(`Online_WP/Stories/${where}`).remove();
     this.db.database.ref(`Online_WP/Users/${userID}/stories/${where}`).remove();
    return true;
  }

}
