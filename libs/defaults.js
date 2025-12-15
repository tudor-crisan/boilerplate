
import copywritings from "@/lists/copywritings.js";
import stylings from "@/lists/stylings.js";
import apps from "@/lists/apps.js";
import visuals from "@/lists/visuals";

const { copywriting, styling, visual } = apps[process.env.NEXT_PUBLIC_APP];

export const defaultCopywriting = copywritings[copywriting];
export const defaultStyling = stylings[styling];
export const defaultVisual = visuals[visual];
