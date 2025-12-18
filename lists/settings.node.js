import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadJSON = (p) =>
  JSON.parse(fs.readFileSync(path.join(__dirname, p), "utf8"));

const settings = {
  lb0_setting: loadJSON("../data/apps/loyalboards/lb0_setting.json"),
  tf0_setting: loadJSON("../data/apps/taskflow/tf0_setting.json"),
  setting0: loadJSON("../data/modules/setting/setting0.json"),
  setting1: loadJSON("../data/modules/setting/setting1.json"),
};

export default settings;
