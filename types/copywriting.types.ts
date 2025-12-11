/**
 * Structure for the Landing Page Content.
 * Defines all sections and their respective data requirements.
 */
export interface LandingPageConfig {
  /**
   * Global metadata for the landing page.
   * Used for SEO and browser tab titles.
   * @required
   */
  Metadata: Metadata;

  /**
   * Configuration for Product Hunt launch or display.
   * @required
   */
  ProductHunt: ProductHunt;

  /**
   * Header section configuration including navigation and branding.
   * @required
   */
  SectionHeader: SectionHeader;

  /**
   * Hero section configuration.
   * This is the first meaningful content the user sees.
   * @required
   */
  SectionHero: SectionHero;

  /**
   * Pricing section configuration.
   * @required
   */
  SectionPricing: SectionPricing;

  /**
   * FAQ section configuration.
   * @required
   */
  SectionFAQ: SectionFAQ;
}

/**
 * SEO and Page Metadata.
 */
export interface Metadata {
  /**
   * The primary title of the page.
   * @required
   * @minLength 10
   * @maxLength 60 - Recommended max length for SEO.
   * @example "LoyalBoards - Collect customer feedback to build better products"
   */
  title: string;

  /**
   * A short description of the page content.
   * Used in meta tags for search engines.
   * @required
   * @minLength 50
   * @maxLength 160 - Recommended max length for SEO meta description.
   * @example "Create a feedback board in minutes..."
   */
  description: string;
}

/**
 * Product Hunt specific content.
 */
export interface ProductHunt {
  /**
   * A list of catchy taglines to display.
   * @required
   * @minItems 1
   * @maxItems 5 - Don't overwhelm the user with too many taglines.
   */
  taglines: string[];
}

/**
 * Header navigation and branding.
 */
export interface SectionHeader {
  /**
   * The name of the application displayed in the header.
   * @required
   * @maxLength 30
   */

  name: string;
  /**
   * Navigation menu items.
   * @required
   * @maxItems 7 - Keep navigation simple.
   */
  menus: MenuItem[];
}

/**
 * A single menu item link.
 */
export interface MenuItem {
  /**
   * Text to display for the link.
   * @required
   * @maxLength 20
   */

  label: string;
  /**
   * URL or anchor path (e.g., "#pricing").
   * @required
   * @pattern ^(/|#|http) - Must start with /, #, or http.
   */
  path: string;
}

/**
 * Hero section content (above the fold).
 */
export interface SectionHero {
  /**
   * The main H1 headline.
   * @required
   * @maxLength 80
   */

  headline: string;
  /**
   * Supporting paragraph text.
   * @required
   * @maxLength 300
   */
  paragraph: string;
}

/**
 * Pricing section configuration.
 */
export interface SectionPricing {
  /**
   * Section label or small eyebrow text.
   * @required
   * @maxLength 20
   */
  label: string;

  /**
   * Main headline for pricing.
   * @required
   * @maxLength 60
   */
  headline: string;

  /**
   * Price display string.
   * @required
   * @example "$19"
   */
  price: string;

  /**
   * Billing period.
   * @required
   * @example "/month"
   */
  period: string;

  /**
   * List of features included in the plan.
   * @required
   * @minItems 1
   */
  features: string[];
}

/**
 * FAQ Section configuration.
 */
export interface SectionFAQ {
  /**
   * Section label.
   * @required
   */
  label: string;

  /**
   * Section headline.
   * @required
   */
  headline: string;

  /**
   * List of questions and answers.
   * @required
   * @minItems 1
   */
  questions: QuestionItem[];
}
/**
 * A single Q&A item.
 */
export interface QuestionItem {
  /**
   * The question being asked.
   * @required
   * @maxLength 100
   */
  question: string;

  /**
   * The answer to the question.
   * @required
   * @maxLength 500
   */
  answer: string;
}
