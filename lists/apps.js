
import copywritings from "@/lists/copywritings";
import settings from "@/lists/settings";
import visuals from "@/lists/visuals";
import stylings from "@/lists/stylings";
import { formatWebsiteUrl } from "@/libs/utils.server";

const apps = {
  "loyalboards": {
    "copywriting": {
      "default": "copywriting0",
      "override": "lb0_copywriting"
    },
    "styling": {
      "default": "styling0",
      "override": "lb0_styling"
    },
    "visual": {
      "default": "visual0",
      "override": "lb0_visual"
    },
    "setting": {
      "default": "setting0",
      "override": "lb0_setting"
    }
  },
  "taskflow": {
    "copywriting": {
      "default": "copywriting0",
      "override": "tf0_copywriting"
    },
    "styling": {
      "default": "styling0",
      "override": "tf0_styling"
    },
    "visual": {
      "default": "visual0",
      "override": "tf0_visual"
    },
    "setting": {
      "default": "setting0",
      "override": "tf0_setting"
    }
  },
  "tudorcrisan": {
    "copywriting": {
      "default": "copywriting0",
      "override": "tc0_copywriting"
    },
    "styling": {
      "default": "styling0",
      "override": "tc0_styling"
    },
    "visual": {
      "default": "visual0",
      "override": "tc0_visual"
    },
    "setting": {
      "default": "setting0",
      "override": "tc0_setting"
    }
  },
  "contentcalendar": {
    "copywriting": "copywriting2",
    "styling": "styling0",
    "visual": "visual0",
    "setting": "setting0"
  },
  "invoicesnap": {
    "copywriting": "copywriting3",
    "styling": "styling0",
    "visual": "visual0",
    "setting": "setting0"
  },
  "meetingmind": {
    "copywriting": "copywriting4",
    "styling": "styling0",
    "visual": "visual0",
    "setting": "setting0"
  },
  "emailwarmup": {
    "copywriting": "copywriting5",
    "styling": "styling0",
    "visual": "visual0",
    "setting": "setting0"
  }
}

export const getAppDetails = (appName) => {
  const appConfig = apps[appName];
  if (!appConfig) return null;

  // Resolve keys
  const resolveKey = (configItem) => {
    if (typeof configItem === "string") return configItem;
    return configItem.override || configItem.default;
  };

  const copyKey = resolveKey(appConfig.copywriting);
  const settingKey = resolveKey(appConfig.setting);
  const visualKey = resolveKey(appConfig.visual);
  const stylingKey = resolveKey(appConfig.styling);

  // Fetch data
  const copywriting = copywritings[copyKey];
  const setting = settings[settingKey];
  const visual = visuals[visualKey];
  const styling = stylings[stylingKey];

  if (!copywriting || !setting || !visual || !styling) return null;

  return {
    copywriting,
    setting,
    visual,
    styling,

    title: copywriting.SectionHero?.headline || "",
    description: copywriting.SectionHero?.paragraph || "",
    favicon: visual.favicon?.href || "",

    appName: setting.appName || "",
    website: formatWebsiteUrl(setting.website || ""),
  };
};

export default apps;