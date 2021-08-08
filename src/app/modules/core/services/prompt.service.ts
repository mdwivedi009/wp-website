import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from "@angular/fire/database";


@Injectable({
  providedIn: 'root'
})
export class PromptService {
  constructor(private db: AngularFireDatabase) { }

  getRequestCreatorById(collection: any, where: any): AngularFireObject<any> {
    return this.db.object(`Online_WP/${collection}/` + where) as AngularFireObject<any>
  }

  getRequestCreator(collection: any, startAtValue: any) {
    if (startAtValue == '') {
      return this.db.list(`Online_WP/${collection}`, ref => ref
        .limitToLast(20))
        .valueChanges();
    } else {
      return this.db.list(`Online_WP/${collection}`, ref => ref
        .orderByChild('promptID')
        .endAt(startAtValue)
        .limitToLast(20))
        .valueChanges();
    }
  }

  getFirstRecordFromPrompt() {
    return this.db.list(`Online_WP/Prompts`, ref => ref
      .limitToFirst(1))
      .valueChanges();
  }
  getFirstRecordFromSortedPrompt() {
    return this.db.list(`Online_WP/Prompts`, ref => ref
      .orderByChild('likesCount')
      .limitToFirst(1)).valueChanges();
  }

  savePrompt(promptDataSet: any) {
    return this.db.database.ref(`Online_WP/Prompts/${promptDataSet.promptID}`).set(promptDataSet);
  }

  getPromptUUID() {
    return this.db.database.ref('Online_WP/Prompts').push().key;
  }

  promptBookmark(where: any, dataSet: any, key: any) {
    return this.db.database.ref(`Online_WP/Users/${where}/bookmarks/${key}`).set(dataSet);
  }

  promptRemoveBookmark(where: any, dataSet: any, key: any) {
    return this.db.database.ref(`Online_WP/Users/${where}/bookmarks/${key}`).remove();
  }

  promptLike(where: any, dataSet: any, key: any) {
    return this.db.database.ref(`Online_WP/Prompts/${where}/likes/${key}`).set(dataSet);
  }

  increaseLikeCount(where: any, dataSet: any, key: any) {
    return this.db.database.ref(`Online_WP/Prompts/${where}/likesCount`).set(dataSet);
  }

  promptDislike(where: any, dataSet: any, key: any) {
    return this.db.database.ref(`Online_WP/Prompts/${where}/likes/${key}`).remove();
  }

  decreaseLikeCount(where: any, dataSet: any, key: any) {
    return this.db.database.ref(`Online_WP/Prompts/${where}/likesCount`).set(dataSet);
  }

  getSortedPrompts(sortType: any, includeMore: any) {
    return this.db.list(`Online_WP/Prompts`, ref => ref
      .orderByChild(sortType)
      .limitToLast(8 + includeMore))
      .valueChanges();
  }

  getPromptOfUser(dataset: any) {
    return this.db.list(`Online_WP/Prompts`, ref => ref
      .orderByChild('userID')
      .equalTo(dataset.userID)
    ).valueChanges();
  }

  updateGenreRequest(where: any, genreDataset: any) {
    return this.db.database.ref(`Online_WP/Prompts/${where}/genre`).set(genreDataset);
  }

  addPromptToGenres(where: any, promptID: any) {
    return this.db.database.ref(`Online_WP/Genres/${where}/${promptID}`).set(true);
  }
  removePromptFromGenres(where: any, key: any) {
    return this.db.database.ref(`Online_WP/Genres/${where}/${key}`).remove();
  }

  getPendingPrompts() {
    return this.db.list(`Online_WP/Prompts`, ref => ref
      .orderByChild('isApproved')
      .equalTo(false)
      .limitToLast(100)).valueChanges();
  }

  approvePromt(where: any) {
    this.db.database.ref(`Online_WP/Prompts/${where}/isApproved`).set(true);
    return true;
  }
  rejectPrompt(where: any) {
    this.db.database.ref(`Online_WP/Prompts/${where}/isDeleted`).set(true);
    this.db.database.ref(`Online_WP/Prompts/${where}`).remove();
    return true;
  }
  updatePrompts(where: any, updatePrompt: any) {
    this.db.database.ref(`Online_WP/Prompts/${where}/userPrompt`).set(updatePrompt);
    return true;
  }

}
