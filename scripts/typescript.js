import copywritings from "@/lists/copywritings.js";
import { CopywritingSchema } from "@/types/copywriting.schema";

Object.values(copywritings).forEach((copywriting, index) => {
  try {
    CopywritingSchema.partial().parse(copywriting);
  } catch (error) {
    console.error(error);
    console.log(`\n❌ Data is invalid! - copywriting${index}`)
  }
});

/***************************************************************/

import stylings from "@/lists/stylings.js";
import { StylingSchema } from "@/types/styling.schema";

Object.values(stylings).forEach((styling, index) => {
  try {
    StylingSchema.partial().parse(styling);
  } catch (error) {
    console.error(error);
    console.log(`\n❌ Data is invalid! - styling${index}`)
  }
});

/***************************************************************/

import visuals from "@/lists/visuals.js";
import { VisualSchema } from "@/types/visual.schema";

Object.values(visuals).forEach((visual, index) => {
  try {
    VisualSchema.partial().parse(visual);
  } catch (error) {
    console.error(error);
    console.log(`\n❌ Data is invalid! - visual${index}`)
  }
});

/***************************************************************/

import settings from "@/lists/settings.js";
import { SettingSchema } from "@/types/setting.schema";

Object.values(settings).forEach((setting, index) => {
  try {
    SettingSchema.partial().parse(setting);
  } catch (error) {
    console.error(error);
    console.log(`\n❌ Data is invalid! - setting${index}`)
  }
});
