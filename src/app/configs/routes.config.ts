import { InjectionToken } from "@angular/core";

export let ROUTES_CONFIG = new InjectionToken("routes.config");

const basePaths = {
  heroes: "heroes",
};

const routesNames = {
  home: "",
  login: "login",
  promptsFeed: "prompts-feed",
  followFeed: "follow-feed",
  interactionFeed: "interaction-feed",
  storiesFeed: "stories-feed",
  authProfile: "profile",
  otherProfile: "user-profile",
  writepage: "write-story",
  readpage: "read-story",
  admin: "admin",
  reply: "reply",
  comment: "comment",
  seereplies: "see-replies",
  storyList: 'story-list',
  adminStory: 'admin-story',
  error404: "404",
  heroes: {
    basePath: basePaths.heroes,
  },
};

export const RoutesConfig: any = {
  routesNames,
  routes: {
    home: `/${routesNames.home}`,
    login: `/${routesNames.login}`,
    promptsFeed: `/${routesNames.promptsFeed}`,
    followFeed: `${routesNames.followFeed}`,
    interactionFeed: `${routesNames.interactionFeed}`,
    storiesFeed: `${routesNames.storiesFeed}`,
    authProfile: `${routesNames.authProfile}`,
    otherProfile: `${routesNames.otherProfile}`,
    writepage: `${routesNames.writepage}`,
    readpage: `${routesNames.readpage}`,
    admin: `${routesNames.admin}`,
    reply: `${routesNames.reply}`,
    comment: `${routesNames.comment}`,
    seereplies: `${routesNames.seereplies}`,
    storyList: `${routesNames.storyList}`,
    adminStory: `${routesNames.adminStory}`,
    error404: `/${routesNames.error404}`,
  },
};
