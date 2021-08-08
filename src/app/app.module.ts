
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { LoginComponent } from './pages/login/login.component';
import { FacebookLoginComponent } from './components/facebook-login/facebook-login.component';
import { GoogleLoginComponent } from './components/google-login/google-login.component';
import { PromptsFeedComponent } from './pages/prompts-feed/prompts-feed.component';
import { StoriesFeedComponent } from './pages/stories-feed/stories-feed.component';
import { InteractionFeedComponent } from './pages/interaction-feed/interaction-feed.component';
import { FollowsFeedComponent } from './pages/follows-feed/follows-feed.component';
import { AuthProfileComponent } from './pages/auth-profile/auth-profile.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { WritePageComponent } from './pages/write-page/write-page.component';
import { ReadPageComponent } from './pages/read-page/read-page.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ReplyComponent } from './pages/reply/reply.component';
import { CommentComponent } from './pages/comment/comment.component';
import { SeeRepliesComponent } from './pages/see-replies/see-replies.component';
import { StoryListComponent } from './pages/story-list/story-list.component';
import {  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ClipboardModule } from 'ngx-clipboard';
// Import library module
import { NgxSpinnerModule } from "ngx-spinner";
import { AdminStoryComponent } from './pages/admin-story/admin-story.component';

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    AppHeaderComponent,
    SpinnerComponent,
    AppSidebarComponent,
    Error404PageComponent,
    LoginComponent,
    FacebookLoginComponent,
    GoogleLoginComponent,
    PromptsFeedComponent,
    StoriesFeedComponent,
    InteractionFeedComponent,
    FollowsFeedComponent,
    AuthProfileComponent,
    ProfileComponent,
    WritePageComponent,
    ReadPageComponent,
    AdminComponent,
    ReplyComponent,
    CommentComponent,
    SeeRepliesComponent,
    StoryListComponent,
    AdminStoryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    NgxSpinnerModule,
    ClipboardModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    }
  ],
  
  bootstrap: [AppComponent]
})

export class AppModule {}
