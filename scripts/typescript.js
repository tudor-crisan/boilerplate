import { LandingPageConfigSchema } from '../types/copywriting.schema';
import copywriting from '@/libs/copywriting';

try {
  LandingPageConfigSchema.parse(copywriting);
  console.log("\n✅ Data is valid!");
} catch (error) {
  console.error(error);
  console.log("\n❌ Data is invalid!")
}
