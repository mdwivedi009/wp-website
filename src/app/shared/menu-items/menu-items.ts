import { Injectable } from "@angular/core";

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  // { state: 'changeTheme', type: 'link', name: 'Switch To Night (Dark)', icon: 'crop_7_5' },
  // { state: 'offlinePrompts', name: 'Offline Prompts?', type: 'link', icon: '/assets/images/sidebar-icon/icn_online_community.png' },
  {
    state: "profile",
    type: "link",
    name: "Your Prompts/Profile",
    icon: "/assets/images/sidebar-icon/icn_your_profile.png",
  },
  {
    state: "writingChallenge",
    type: "link",
    name: "Writing Challenge",
    icon: "/assets/images/sidebar-icon/icn_writing_challenge.png",
  },
  {
    state: "writerDictionary",
    type: "link",
    name: "Writer's Dictionary",
    icon: "/assets/images/sidebar-icon/ic_launcher.png",
  },
  {
    state: "requestFeature",
    type: "link",
    name: "Request a feature",
    icon: "/assets/images/sidebar-icon/icn_request_a_feature.png",
  },
 
  {
    state: "feedback",
    type: "link",
    name: "Contact Us (Feedback)",
    icon: "/assets/images/sidebar-icon/icn_contact_us.png",
  },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
