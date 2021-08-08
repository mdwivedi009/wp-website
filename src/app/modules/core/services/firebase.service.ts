import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireAction } from "@angular/fire/database";

@Injectable({
  providedIn: "root",
})
export class FirebaseService {
  constructor(private db: AngularFireDatabase) {}
  getRequestCreator(collection: any, where:any) {
    if(where !== '')
    return this.db.list(`Online_WP/${collection}/` + where).valueChanges();
    else
    return this.db.list(`Online_WP/${collection}`).valueChanges();
  }
}
