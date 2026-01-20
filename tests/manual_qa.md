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

## 3. Owner Dashboard & Analytics
- [ ] **Analytics Stats**: 
    - [ ] Verify that the dashboard displays views, posts, votes, and comments (from `BoardAnalytics` model).
    - [ ] Check if the charts/metrics update when navigating between different time periods (if applicable).
- [ ] **Notifications**: Check that `BoardDashboardNotifications` shows recent activity.
- [ ] **Create Board**:
    - [ ] Create a new board using the `FormCreate` component.
    - [ ] Verify the board appears immediately in the `BoardDashboardList`.

## 4. Advanced Board Settings (Edit Mode)
- [ ] **Board Details**:
    - [ ] Open the **Board Edit Modal** and change the board name and description.
    - [ ] **Slug Management**: Change the board slug. 
    - [ ] Verify the "You can only change this once per day" warning is displayed.
    - [ ] Save and verify the new public URL works and the old one redirects or 404s correctly.
- [ ] **Extra Settings**:
    - [ ] Toggle settings in `BoardExtraSettings` (e.g., General Form rules, Empty State messages).
    - [ ] **Comment Settings**: Toggle comment sections on/off for specific boards.
    - [ ] **Appearance**: Use the board-specific appearance editor to change colors or styles.
    - [ ] **Preview**: Verify the real-time preview matches the settings being changed.

## 5. Profile & Appearance
- [ ] **Profile Editing (`DashboardProfileEditModal`)**:
    - [ ] **Display Name**: Change your name and verify it updates in the header/dashboard.
    - [ ] **Profile Image**: 
        - [ ] Upload a new image and verify it crops/displays correctly.
        - [ ] Remove the image and verify it reverts to name initials fallback.
    - [ ] **App Appearance**:
        - [ ] Toggle global themes and verify the UI updates instantly.
        - [ ] Click "Reset to default" and verify it clears the custom `styling-config` from local storage.
    - [ ] **Randomizer**: Test the "SettingsRandomizer" to generate a random look.

## 6. Feedback Board (Public View)
- [ ] **Search & Filtering (`FilterBar`)**:
    - [ ] **Search**: Type a keyword in the search bar and verify only matching posts are displayed.
    - [ ] **Sort**: Change the sort order (Newest, Top Voted, etc.) and verify the list reorders correctly.
- [ ] **Anonymous Upvoting**: In an **Incognito** window, upvote a post. Verify it works without login.
- [ ] **Anonymous Posting**: Submit a new feedback post without being logged in.

## 7. Billing & Subscriptions
- [ ] **Checkout Process**:
    - [ ] Click the "Pricing/Subscribe" button (`ButtonCheckout`).
    - [ ] Select a plan (Monthly or Lifetime) and verify it redirects to **Stripe Checkout**.
    - [ ] **Success Redirection**: After a test payment (e.g., Stripe test card), verify the application redirects to `/success`.
- [ ] **Billing Management**:
    - [ ] Click "Billing" (`ButtonPortal`) while logged in.
    - [ ] Verify it redirects to the **Stripe Customer Portal**.

## 8. Real-time Updates & Streaming (2-Window Test)
To verify real-time data flow without page refreshes, open **Window A** (Logged in Owner) and **Window B** (Incognito/Guest) side-by-side.
- [ ] **Post Streaming (`/api/modules/boards/stream`)**:
    - [ ] In **Window B**, submit a new post. Verify it appears instantly in **Window A**.
    - [ ] In **Window B**, upvote an existing post. Verify the vote count increments instantly in **Window A**.
    - [ ] In **Window A**, delete the post. Verify it disappears instantly in **Window B**.
- [ ] **Comment Streaming**:
    - [ ] In **Window B**, add a comment to a post. Verify the comment count and list update instantly in **Window A**.
- [ ] **Real-time Notifications (`/api/modules/boards/notifications/stream`)**:
    - [ ] In **Window B**, upvote a post or comment. Verify a browser notification or dashboard notification indicator appears instantly in **Window A**.

## 9. Weekly Digest & CLI Verification
The Weekly Digest aggregates performance data and notifies owners.
- [ ] **CURL Verification**:
    - [ ] Run the following command in your terminal (replace placeholders):
      ```bash
      curl -X GET "http://localhost:3000/api/modules/boards/weekly-digest" \
           -H "Authorization: Bearer YOUR_CRON_SECRET"
      ```
    - [ ] Verify the response is `{ "success": true, "emailsSent": X }`.
- [ ] **Email Content**: Check the received email to ensure it contains accurate stats (views, posts, votes) for the previous 7 days.

## 10. Moderation & Content Management
- [ ] **Delete Post**: As an owner on the dashboard, delete a post and verify it is removed from the board.
- [ ] **Comments**: Add a comment to a post and verify it displays correctly.

## 11. Legal & Support Pages
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

## 12. Responsive Design & Browser Verification
### 12.1 General Layout (Mobile vs Desktop)
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

### 12.2 Browser Matrix
Check the following for layout shifts, broken buttons, or crashes:
- [ ] **Chrome** (Latest)
- [ ] **Firefox** (Latest)
- [ ] **Safari** (macOS)
- [ ] **Mobile Safari / Chrome** (iOS/Android) 

## 13. Performance & Stability
- [ ] **Rapid Voting**: Click the upvote button multiple times quickly to ensure no race conditions or crashes.
- [ ] **Large Datasets**: (If test data exists) Ensure the board list scrolls smoothly without lag.

## 14. Access Control (No Subscription)
Tests to verify behavior when a user exists but `hasAccess` is set to `false` (e.g. subscription cancelled or expired).
- [ ] **Dashboard State**:
    - [ ] Log in as a user with `hasAccess: false`.
    - [ ] Verify the header displays a **"Subscribe"** (`ButtonCheckout`) button instead of "Billing" (`ButtonPortal`).
    - [ ] Verify the user can still access their profile settings.
- [ ] **API Restrictions**:
    - [ ] Attempt to perform an action requiring access (e.g. creating a board).
    - [ ] Verify the server responds with a "No Access" error (or redirects to pricing).
- [ ] **Logout**:
    - [ ] Verify the user can still log out successfully.
