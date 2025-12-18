import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadJSON = (p) =>
  JSON.parse(fs.readFileSync(path.join(__dirname, p), "utf8"));

const settings = {
  setting0: loadJSON("../data/setting/setting0.json"),
  setting1: loadJSON("../data/setting/setting1.json"),
};

export default settings;
