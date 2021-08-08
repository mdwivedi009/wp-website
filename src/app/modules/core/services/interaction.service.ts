import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from "@angular/fire/database";


@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  constructor(private db: AngularFireDatabase) { }

  saveNotificationForLike(otherUser: any, promptID: any, authDetails: any, dataSet: any) {
    return this.db.database.ref(`Online_WP/Notif/${otherUser}/prompts/likes/${promptID}/${authDetails}`).set(dataSet);
  }

  saveNotificationForStory(storyUser: any, storyID: any, authDetails: any, dataSet: any) {
    return this.db.database.ref(`Online_WP/Notif/${storyUser}/stories/likes/${storyID}/${authDetails}`).set(dataSet);
  }

  saveNotificationForFollow(userForFollow: any, userFollowing: any, dataSet: any) {
    return this.db.database.ref(`Online_WP/Notif/${userForFollow}/followers/${userFollowing}`).set(dataSet);
  }

  saveNotificationForReply(commentUser: any, commentID: any, replyID: any, dataSet: any) {
    return this.db.database.ref(`Online_WP/Notif/${commentUser}/commentReplies/${commentID}/${replyID}`).set(dataSet);
  }

  saveNotificationForComment(userID: any, storyID: any, commentID: any, dataSet: any) {
    return this.db.database.ref(`Online_WP/Notif/${userID}/stories/comments/${storyID}/${commentID}`).set(dataSet);
  }

  getRequestCreatorById(userID: any): AngularFireObject<any> {
    return this.db.object(`Online_WP/Notif/${userID}`) as AngularFireObject<any>
  }

  getPromptsLikes(userID: any)  {
    return this.db.list(`Online_WP/Notif/${userID}/prompts/`).valueChanges()
  }

  getStoriesLikes(userID: any)  {
    return this.db.list(`Online_WP/Notif/${userID}/stories/`).valueChanges()
  }

  getFollowersList(userID: any)  {
    return this.db.list(`Online_WP/Notif/${userID}/followers`).valueChanges()
  }

  getCommentReplyList(userID: any)  {
    return this.db.object(`Online_WP/Notif/${userID}/commentReplies`).valueChanges()
  }
}
