import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from "@angular/fire/database";


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private db: AngularFireDatabase) { }

  getRequestCreatorById(where:any): AngularFireObject<any> {
    return this.db.object(`Online_WP/Comments/` + where) as AngularFireObject<any>;
  }

  getReplyForComment(commentID: any){
    return this.db.list(`Online_WP/Comments`, ref=> ref
    .orderByChild('inReplyTo')
    .equalTo(commentID)
    ).valueChanges();
  }

  getCommentForStory(storyID: any){
    return this.db.list(`Online_WP/Comments`, ref=> ref
    .orderByChild('storyID')
    .equalTo(storyID)
    ).valueChanges();
  }

  getCommentUUID() {
    return this.db.database.ref('Online_WP/Comments').push().key;
  }

  saveReply(where: any, dataSet: any){
    return this.db.database.ref(`Online_WP/Comments/${where}`).set(dataSet);
  }

  saveComment(dataSet: any){
    return this.db.database.ref(`Online_WP/Comments/${dataSet.cID}`).set(dataSet);
  }

  updateCommentReply(where: any, dataSet: any) {
    return this.db.database.ref(`Online_WP/Comments/${where}/replies/${dataSet}`).set(dataSet);
  }

  updateCommentForStory(storyID: any, dataSet: any) {
    return this.db.database.ref(`Online_WP/Stories/${storyID}/comments/${dataSet}`).set(dataSet);
  }
}

// This is the first comment for the prompt : This story is written for this prompt. Prompts can have multiple stories for them
