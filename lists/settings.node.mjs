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
  copywriting: loadJSON("../data/copywriting.json"),
  styling: loadJSON("../data/styling.json"),
  visual: loadJSON("../data/visual.json"),
  setting: loadJSON("../data/setting.json"),
  blog: loadJSON("../modules/blog/data/blog.json"),
  boards: loadJSON("../modules/boards/data/boards.json"),
  help: loadJSON("../modules/help/data/help.json"),
  loyalboards_copywriting: loadJSON("../apps/loyalboards/copywriting.json"),
  loyalboards_styling: loadJSON("../apps/loyalboards/styling.json"),
  loyalboards_visual: loadJSON("../apps/loyalboards/visual.json"),
  loyalboards_setting: loadJSON("../apps/loyalboards/setting.json"),
  loyalboards_blog: loadJSON("../apps/loyalboards/blog.json"),
  loyalboards_help: loadJSON("../apps/loyalboards/help.json"),
  loyalboards_video: loadJSON("../apps/loyalboards/video.json"),
  taskflow_copywriting: loadJSON("../apps/taskflow/copywriting.json"),
  taskflow_styling: loadJSON("../apps/taskflow/styling.json"),
  taskflow_visual: loadJSON("../apps/taskflow/visual.json"),
  taskflow_setting: loadJSON("../apps/taskflow/setting.json"),
  tudorcrisan_copywriting: loadJSON("../apps/tudorcrisan/copywriting.json"),
  tudorcrisan_styling: loadJSON("../apps/tudorcrisan/styling.json"),
  tudorcrisan_visual: loadJSON("../apps/tudorcrisan/visual.json"),
  tudorcrisan_setting: loadJSON("../apps/tudorcrisan/setting.json"),
};

export default settings;
