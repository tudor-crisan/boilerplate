# Copywriting Configuration

The `copywriting.json` file in `data/modules/` centralizes the text content for major landing page sections.

## Sections
- `SectionHeader`: Header menu items and paths.
- `SectionPricing`: Pricing plan details, including price points, labels, and benefits for monthly and lifetime options.
- `SectionBlog`: Headline and cta for the blog section on the home page.
- `SectionFooter`: Footer menu structure (Legal, Support), brand rights text, and social links.

## Purpose
By centralizing text in this file, the application can easily support white-labeling or multi-tenant deployments by overriding these values in `data/apps/[appName]/copywriting.json`.
