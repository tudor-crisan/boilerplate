# LoyalBoards Manual QA Test Plan

This document outlines the manual tests required to ensure the LoyalBoards application is functioning correctly across different browsers and devices.

## 1. Authentication & Session Management
- [ ] **Magic Link Login**: Navigate to the login page, enter a valid email, and ensure the Resend magic link is sent and works.
- [ ] **Logout**: Verify that clicking 'Logout' clears the session and redirects to the landing page.
- [ ] **Protected Routes**: Ensure that trying to access `/dashboard` while logged out redirects to `/login`.
- [ ] **Auth Navigation (Logged Out)**:
    - [ ] Navigate to `/auth/signin`: Should display the sign-in/login form.
    - [ ] Navigate to `/auth/error`: Should display the authentication error page.
    - [ ] Navigate to `/auth/verify-request`: Should display the "Check your email" message.
- [ ] **Auth Navigation (Logged In)**:
    - [ ] Navigate to `/auth/signin`: Should automatically redirect to the dashboard or homepage.
    - [ ] Navigate to `/auth/error`: Should display the error page (or handle gracefully if no error).
    - [ ] Navigate to `/auth/verify-request`: Should automatically redirect since the session is already active.

## 2. Marketing & Static Pages
- [ ] **Landing Page**: Check that SectionHero, SectionPricing, and SectionFAQ render correctly.
- [ ] **Pricing Toggles**: If applicable, toggle between Monthly and Lifetime plans to ensure prices update ($19 vs $59).
- [ ] **FAQ Accordion**: Verify that clicking questions in the FAQ section expands the answers.
- [ ] **Blog**: Navigate to `/blog` and verify that articles from `blog.json` are listed and readable.
- [ ] **Help Center**: Navigate to `/help` and verify articles like "Creating a Board" are accessible.

## 3. Owner Dashboard
- [ ] **Analytics Overview**: Verify that the `BoardDashboardAnalytics` component displays charts/stats.
- [ ] **Notifications**: Check that `BoardDashboardNotifications` shows recent activity.
- [ ] **Create Board**:
    - [ ] Create a new board using the `FormCreate` component.
    - [ ] Verify the board appears immediately in the `BoardDashboardList`.
- [ ] **Board Management**: Click on a board from the list and ensure it navigates to the private management URL.

## 4. Feedback Board (Public View)
- [ ] **Anonymous Upvoting**: In an **Incognito/Private window**, navigate to a public board and upvote a post. Verify it works without login.
- [ ] **Anonymous Posting**: Submit a new feedback post without being logged in. Ensure it appears on the board.
- [ ] **Post Ranking**: Verify that posts with more upvotes rise to the top of the list.

## 5. Moderation & Content Management
- [ ] **Delete Post**: As an owner on the dashboard, delete a post and verify it is removed from the board.
- [ ] **Comments**: Add a comment to a post and verify it displays correctly.

## 6. Legal & Support Pages
Check the following routes for correct content and responsive behavior:
- [ ] **Terms of Service (`/terms`)**:
    - [ ] Verify "Last updated" date is pulled correctly from settings.
    - [ ] Check that the support email and business address are correctly displayed and dynamic.
    - [ ] Ensure layout is readable on both **Mobile and Desktop**.
- [ ] **Privacy Policy (`/privacy`)**:
    - [ ] Verify legal entity name and contact details match the project configuration.
    - [ ] Ensure no horizontal scrolling on **Mobile**.
- [ ] **Support (`/support`)**:
    - [ ] Verify the "View Help Articles" button redirects correctly to `/help`.
    - [ ] Check that contact details and the `HelpSupport` component render correctly.

## 7. Responsive Design & Browser Verification
### 7.1 General Layout (Mobile vs Desktop)
- [ ] **SectionHero**: 
    - [ ] Desktop: Headlines and CTA are centered or side-by-side. 
    - [ ] Mobile: Headline stacks vertically; text size is legible; CTA button is full-width or appropriately sized.
- [ ] **SectionPricing**:
    - [ ] Desktop: Pricing cards display side-by-side.
    - [ ] Mobile: Pricing cards stack vertically; toggles are easy to tap.
- [ ] **Blog Components**:
    - [ ] **BlogCardArticle**: Check grid layout on Desktop (3-col) vs Mobile (1-col). Verify image aspect ratios.
    - [ ] **BlogRelatedArticles**: Ensure horizontal scroll or vertical stack on small screens.
- [ ] **Help Center**:
    - [ ] **HelpArticles List**: Verify grid behavior and spacing between category cards.
    - [ ] **HelpArticle Content**: Ensure paragraphs and code blocks do not overflow horizontally on mobile.
- [ ] **Navigation**:
    - [ ] Desktop: Header menu links are visible.
    - [ ] Mobile: Header menu transforms into a working Hamburger Menu.

### 7.2 Browser Matrix
Check the following for layout shifts, broken buttons, or crashes:
- [ ] **Chrome** (Latest)
- [ ] **Firefox** (Latest)
- [ ] **Safari** (macOS)
- [ ] **Mobile Safari / Chrome** (iOS/Android) 

## 8. Performance & Stability
- [ ] **Rapid Voting**: Click the upvote button multiple times quickly to ensure no race conditions or crashes.
- [ ] **Large Datasets**: (If test data exists) Ensure the board list scrolls smoothly without lag.
