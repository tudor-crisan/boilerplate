import { CopywritingSchema } from '../types/copywriting.schema';
import copywritings from "../lists/copywritings.js";

Object.values(copywritings).forEach((copywriting, index) => {
  try {
    CopywritingSchema.parse(copywriting);
    console.log(`\n✅ Data is valid - copywriting${index}`);
  } catch (error) {
    console.error(error);
    console.log(`\n❌ Data is invalid! - copywriting${index}`)
  }
});

/***************************************************************/

import { StylingSchema } from '../types/styling.schema';
import stylings from "../lists/stylings.js";

Object.values(stylings).forEach((styling, index) => {
  try {
    StylingSchema.parse(styling);
    console.log(`\n✅ Data is valid - styling${index}`);
  } catch (error) {
    console.error(error);
    console.log(`\n❌ Data is invalid! - styling${index}`)
  }
});

/***************************************************************/

import { VisualSchema } from '../types/visual.schema';
import visuals from "../lists/visuals.js";

Object.values(visuals).forEach((visual, index) => {
  try {
    VisualSchema.parse(visual);
    console.log(`\n✅ Data is valid - visual${index}`);
  } catch (error) {
    console.error(error);
    console.log(`\n❌ Data is invalid! - visual${index}`)
  }
});

/***************************************************************/

import { SettingSchema } from '../types/setting.schema';
import settings from "../lists/settings.js";

Object.values(settings).forEach((setting, index) => {
  try {
    SettingSchema.parse(setting);
    console.log(`\n✅ Data is valid - setting${index}`);
  } catch (error) {
    console.error(error);
    console.log(`\n❌ Data is invalid! - setting${index}`)
  }
});
