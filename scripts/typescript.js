import { CopywritingSchema } from '../types/copywriting.schema';
import { StylingSchema } from '../types/styling.schema';
import copywriting0 from "../data/copywriting/copywriting0.json";
import copywriting1 from "../data/copywriting/copywriting1.json";
import copywriting2 from "../data/copywriting/copywriting2.json";
import copywriting3 from "../data/copywriting/copywriting3.json";
import copywriting4 from "../data/copywriting/copywriting4.json";
import copywriting5 from "../data/copywriting/copywriting5.json";
import copywriting6 from "../data/copywriting/copywriting6.json";

import styling0 from "../data/styling/styling0.json";
import styling1 from "../data/styling/styling1.json";
import styling2 from "../data/styling/styling2.json";
import styling3 from "../data/styling/styling3.json";

[
  copywriting0,
  copywriting1,
  copywriting2,
  copywriting3,
  copywriting4,
  copywriting5,
  copywriting6
].forEach((copywriting, index) => {
  try {
    CopywritingSchema.parse(copywriting);
    console.log(`\n✅ Data is valid - copywriting${index}`);
  } catch (error) {
    console.error(error);
    console.log(`\n❌ Data is invalid! - copywriting${index}`)
  }
});

[
  styling0,
  styling1,
  styling2,
  styling3
].forEach((styling, index) => {
  try {
    StylingSchema.parse(styling);
    console.log(`\n✅ Data is valid - styling${index}`);
  } catch (error) {
    console.error(error);
    console.log(`\n❌ Data is invalid! - styling${index}`)
  }
});
