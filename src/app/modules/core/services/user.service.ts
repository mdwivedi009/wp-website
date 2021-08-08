import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from "@angular/fire/database";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFireDatabase) {}

  getRequestCreatorById(collection: any, where:any): AngularFireObject<any> {
    return this.db.object(`Online_WP/${collection}/` + where) as AngularFireObject<any>
  }

  getRequestCreator(collection: any) {
    return this.db.object(`Online_WP/${collection}`).valueChanges()
  }

  saveUserDetails (userDataSet: any,userID: any) {
    console.log(userDataSet);
    return this.db.database.ref(`Online_WP/Users/${userID}`).set(userDataSet);
  }

  getUserUUID() {
    return this.db.database.ref('Online_WP/Users').push().key;
  }

  getAuthenticationID() {
    
  }

  getUserPromptUUID(UUID: any) {
    return this.db.database.ref(`Online_WP/Users/${UUID}/userPrompts`).push().key;
  }

  updateRequestCreator(where: any, dataSet: any, key: any ) {
    return this.db.database.ref(`Online_WP/Users/${where}/userPrompts/${key}`).set(dataSet);
  }

  promptLikeByUser(where: any, dataSet: any, key: any) {
    return this.db.database.ref(`Online_WP/Users/${where}/likes/${key}`).set(dataSet);
  }

  promptDislikeByUser(where: any, dataSet: any, key: any) {
    return this.db.database.ref(`Online_WP/Users/${where}/likes/${key}`).remove();
  }

  storyLikeByUser(where: any, dataSet: any, key: any) {
    return this.db.database.ref(`Online_WP/Users/${where}/likedStories/${key}`).set(dataSet);
  }

  storyDislikeByUser(where: any, dataSet: any, key: any) {
    return this.db.database.ref(`Online_WP/Users/${where}/likedStories/${key}`).remove();
  }

  updateUserDetail(where: any, updateData: any){
    return this.db.database.ref(`Online_WP/Users/${where}`).set(updateData);
  }
  
  addUserToFollower(where: any, dataSet: any, key: any) {
    return this.db.database.ref(`Online_WP/Users/${where}/followers/${key}`).set(dataSet);
  }
  addUserToFollowing(where: any, dataSet: any, key: any) {
    return this.db.database.ref(`Online_WP/Users/${where}/following/${key}`).set(dataSet);
  }
  removeUserFromFollower(where: any, dataSet: any, key: any) {
    return this.db.database.ref(`Online_WP/Users/${where}/followers/${key}`).remove()
  }
  removeUserFromFollowing(where: any, dataSet: any, key: any) {
    return this.db.database.ref(`Online_WP/Users/${where}/following/${key}`).remove()
  }

  getUserByEmail(email: any){
    console.log(email);
    return this.db.list(`Online_WP/Users`, ref=>ref
    .orderByChild('userEmail')
    .equalTo(email))
    .valueChanges();
  }

  // updateUserDetailByEmail(where: any, updateData: any){
  //   return this.db.list('Online_Wp/Users', ref => ref
  //   .orderByChild('userEmail')
  //   .equalTo(where)).
  // }
  
  updatePromptsUsername(collection:any, id: any, uName:any) {
    return this.db.database.ref(`Online_WP/${collection}/${id}/userName`).set(uName);
  }
  
  updateStoriesUsername(collection: any, userID: any,uName:any) {
    return this.db.list(`Online_WP/${collection}`, ref=>ref
    .orderByChild('userID')
    .equalTo(userID)).valueChanges().subscribe(res => {
      res.forEach((ele: any) => {
      //  console.log(ele.stID);
       this.db.database.ref(`Online_WP/${collection}/${ele.stID}/userName`).set(uName);
      })
    })
  }

  //these 2 functions below to update username in comments collection
    getCommentList(collection: any, userID: any,uName:any){
      return this.db.list(`Online_WP/${collection}`, ref=>ref
      .orderByChild('userID')
      .equalTo(userID)).valueChanges();
      }
    updateUsernameforComm(cID:any,uName:any){
      this.db.database.ref(`Online_WP/Comments/${cID}/userName`).set(uName);
    }
  
}
