import { LandingPageConfigSchema } from '../types/copywriting.schema';
import copywriting from '../data/copywriting/copywriting0.json';

try {
  LandingPageConfigSchema.parse(copywriting);
  console.log("\n✅ Data is valid!");
} catch (error) {
  console.error(error);
  console.log("\n❌ Data is invalid!")
}
