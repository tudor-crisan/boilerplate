import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadJSON = (p) => {
  const fullPath = path.join(__dirname, p);
  try {
    if (!fs.existsSync(fullPath)) return {};
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (e) {
    return {};
  }
};

const settings = {
  copywriting: loadJSON("../data/modules/copywriting.json"),
  styling: loadJSON("../data/modules/styling.json"),
  visual: loadJSON("../data/modules/visual.json"),
  setting: loadJSON("../data/modules/setting.json"),
  blog: loadJSON("../data/modules/blog.json"),
  boards: loadJSON("../data/modules/boards.json"),
  loyalboards_copywriting: loadJSON("../data/apps/loyalboards/copywriting.json"),
  loyalboards_styling: loadJSON("../data/apps/loyalboards/styling.json"),
  loyalboards_visual: loadJSON("../data/apps/loyalboards/visual.json"),
  loyalboards_setting: loadJSON("../data/apps/loyalboards/setting.json"),
  loyalboards_blog: loadJSON("../data/apps/loyalboards/blog.json"),
  taskflow_copywriting: loadJSON("../data/apps/taskflow/copywriting.json"),
  taskflow_styling: loadJSON("../data/apps/taskflow/styling.json"),
  taskflow_visual: loadJSON("../data/apps/taskflow/visual.json"),
  taskflow_setting: loadJSON("../data/apps/taskflow/setting.json"),
  tudorcrisan_copywriting: loadJSON("../data/apps/tudorcrisan/copywriting.json"),
  tudorcrisan_styling: loadJSON("../data/apps/tudorcrisan/styling.json"),
  tudorcrisan_visual: loadJSON("../data/apps/tudorcrisan/visual.json"),
  tudorcrisan_setting: loadJSON("../data/apps/tudorcrisan/setting.json"),
};

export default settings;
