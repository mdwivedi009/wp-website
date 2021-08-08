import { Injectable } from '@angular/core';
import { auth } from 'firebase';
import { UserService } from './user.service';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  commentSet: any;

  constructor(
    private _userService: UserService, 
    private title: Title, 
    private meta: Meta) { }

    updateTitle(title: string) {
      this.title.setTitle(title);
    }
  
    updateOgDetails(ogDetails: any) {
      this.meta.updateTag({ name: 'og:url', content: ogDetails.url });
      this.meta.updateTag({ name: 'og:title', content: ogDetails.title });
      this.meta.updateTag({ name: 'og:description', content: ogDetails.description });
      this.meta.updateTag({ name: 'og:image', content: ogDetails.image });
    }
  
    updateDescription(desc: string) {
      this.meta.updateTag({ name: 'description', content: desc })
    }

  saveAuthTokenInLocalStorage(authDetails: any) {
    if(authDetails.accessToken){
      localStorage.setItem('accessToken', authDetails.accessToken);
      return 'SAVED';
    } else {
      return 'SOMETHING WENT WRONG';
    }
  }

  async saveAuthDetails(authDetails: any, userID: any) {
    if(authDetails){
      this._userService.getUserByEmail(authDetails.email).subscribe(async (response) => {
        if(response.length) {
          const tempData: any = response[0];
          authDetails['UUID'] = userID;
          authDetails = {...authDetails, name: tempData.userName};
          localStorage.setItem('authDetails', JSON.stringify(authDetails));
          return 'SAVED';
        } else {
          // const uuid = await this.getUUIDForUser();
          const uuid = userID;
          const userSavedData = await this._userService.saveUserDetails({
            userEmail: authDetails.email,
            userImageURL: typeof authDetails.picture == 'object' ? authDetails.picture.data.url : authDetails.picture,
            userName: authDetails.name,
            userID: uuid
          },uuid);
          authDetails.UUID = uuid;
          console.log(authDetails);
          localStorage.setItem('authDetails', JSON.stringify(authDetails));
          return 'SAVED';
        }
      })
      
    } else {
      return 'SOMETHING WENT WRONG';
    }
  }

  getUUIDForUser() { 
    const tempid = this._userService.getUserUUID()
    // console.log(tempid);
    return tempid;
  }

  clearAuthDetailsFromLocalStorage(){
    localStorage.removeItem('accessToken')
    localStorage.removeItem('authDetails')
  }

  getAuthToken() {
    const accessToken = localStorage.getItem('accessToken');
    return accessToken;
  }

  getAuthDetails() {
    const authDetails = localStorage.getItem('authDetails');
    return authDetails;
  }
}
