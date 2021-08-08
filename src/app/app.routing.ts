import { Routes } from "@angular/router";
import { RoutesConfig } from "../app/configs/routes.config";
import { FullComponent } from "./layouts/full/full.component";
import { LoginComponent } from "./pages/login/login.component";
import { PromptsFeedComponent } from "./pages/prompts-feed/prompts-feed.component";
import { FollowsFeedComponent } from "./pages/follows-feed/follows-feed.component";
import { InteractionFeedComponent } from "./pages/interaction-feed/interaction-feed.component";
import { StoriesFeedComponent } from "./pages/stories-feed/stories-feed.component";
import { AuthGuard } from "../app/modules/core/_helpers/guard/auth.guard";
import { Error404PageComponent } from "./pages/error404-page/error404-page.component";
import { AuthProfileComponent } from "./pages/auth-profile/auth-profile.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { WritePageComponent } from "./pages/write-page/write-page.component";
import { ReadPageComponent } from "./pages/read-page/read-page.component";
import { AdminComponent } from "./pages/admin/admin.component";
import { ReplyComponent } from "./pages/reply/reply.component";
import { CommentComponent } from "./pages/comment/comment.component";
import { SeeRepliesComponent } from "./pages/see-replies/see-replies.component";
import { StoryListComponent } from "./pages/story-list/story-list.component";
import { AdminStoryComponent } from './pages/admin-story/admin-story.component';

const routesNames = RoutesConfig.routesNames;

export const AppRoutes: Routes = [
  {
    path: "",
    component: FullComponent,
    children: [
      {
        path: "",
        redirectTo: "/dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
    ],
  },
  { path: routesNames.login, component: LoginComponent, pathMatch: "full" },
  {
    path: routesNames.promptsFeed,
    component: PromptsFeedComponent,
    pathMatch: "full",
  },
  {
    path: routesNames.followFeed,
    component: FollowsFeedComponent,
    pathMatch: "full",
    canActivate: [AuthGuard],
  },
  {
    path: routesNames.interactionFeed,
    component: InteractionFeedComponent,
    pathMatch: "full",
    canActivate: [AuthGuard],
  },
  {
    path: routesNames.storiesFeed,
    component: StoriesFeedComponent,
    pathMatch: "full",
  },
  {
    path: routesNames.authProfile,
    component: AuthProfileComponent,
    pathMatch: "full",
    canActivate: [AuthGuard],
  },
  { path: routesNames.otherProfile, component: ProfileComponent },
  { path: routesNames.writepage, component: WritePageComponent },
  { path: routesNames.readpage, component: ReadPageComponent },
  { path: routesNames.admin, component: AdminComponent },
  { path: routesNames.adminStory, component: AdminStoryComponent },
  { path: routesNames.reply, component: ReplyComponent },
  { path: routesNames.comment, component: CommentComponent },
  { path: routesNames.seereplies, component: SeeRepliesComponent },
  { path: routesNames.storyList, component: StoryListComponent},
  { path: routesNames.error404, component: Error404PageComponent },
];
