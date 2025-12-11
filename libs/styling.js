
import styling0 from "@/data/styling/styling0.json";
import styling1 from "@/data/styling/styling1.json";
import styling2 from "@/data/styling/styling2.json";
import styling3 from "@/data/styling/styling3.json";
import settings from "@/config/settings.json";

const stylings = {
  styling0,
  styling1,
  styling2,
  styling3
}

export const styling = stylings[settings.styling];
export default stylings;

