# Boards Module Configuration

The `boards.json` file in `data/modules/` is a core configuration that defines the behavior, routing, and UI for the feedback boards system.

## Key Sections
- `paths`: Maps public and dashboard routes to their internal module destinations. It also defines API endpoints for boards, posts, comments, and analytics.
- `metadata`: SEO title and description templates for board pages.
- `rateLimits`: Defines usage limits for various actions (create post, vote, comment, etc.) to prevent spam.
- `forms`: Contains detailed configuration for and UI components:
  - `Post`: Inputs for suggesting features.
  - `Board`: Inputs for creating new feedback boards.
  - `Comment`: Inputs and rules for guest or user comments.
  - `Vote`: Backend responses for voting actions.
- `defaultExtraSettings`: Fallback UI text for forms and empty states.

## Forms & Inputs
Each form defines its `apiUrl`, `inputsConfig` (type, label, placeholder, validation), and `backend` responses for various states (success, error, required fields).
