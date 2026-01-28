import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetFile = path.resolve(__dirname, "../node_modules/next/dist/compiled/browserslist/index.js");

if (fs.existsSync(targetFile)) {
  try {
    let content = fs.readFileSync(targetFile, "utf8");
    const searchString = "1764339020978<(new Date).setMonth((new Date).getMonth()-2)&&console.warn";
    const replaceString = "false&&console.warn";

    if (content.includes(searchString)) {
      content = content.replace(searchString, replaceString);
      fs.writeFileSync(targetFile, content, "utf8");
      console.log("Successfully patched Next.js browserslist to silence baseline-browser-mapping warning.");
    } else if (content.includes(replaceString)) {
      console.log("Next.js browserslist is already patched.");
    } else {
      console.warn("Could not find the target string in Next.js browserslist. It might have changed in this version of Next.js.");
    }
  } catch (error) {
    console.error("Failed to patch Next.js browserslist:", error.message);
  }
} else {
  console.warn("Next.js browserslist file not found at:", targetFile);
}
