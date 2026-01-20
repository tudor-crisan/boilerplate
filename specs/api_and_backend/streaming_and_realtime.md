# Streaming and Real-Time Updates

The project provides real-time interactivity using Server-Sent Events (SSE) backed by MongoDB Change Streams. This allows the UI to update instantly without polling.

## 1. Board Activity Stream (`/api/modules/boards/stream`)
This public-facing stream provides global updates for active feedback boards.
- **Technology**: Uses `ReadableStream` and `TextEncoder` to maintain a persistent HTTP connection.
- **Backend Trigger**: Utilizes `watch()` on the `Post`, `Board`, and `Comment` collections.
- **Event Types**:
    - `vote`: Triggered by updates to a post's `votesCounter`. Includes the `clientId` to prevent self-update loops.
    - `post-create` / `post-delete`: Real-time list updates when new content is published or removed.
    - `comment-update`: Notifies the UI when comments are added or hidden (soft-deleted).

## 2. Notification Stream (`/api/modules/boards/notifications/stream`)
An authenticated stream for user-specific real-time notifications.
- **Security**: Requires a valid user session. Events are strictly filtered by the authenticated `userId`.
- **Infrastructure**:
    - **Vercel Optimization**: Automatically closes after 40 seconds to comply with Serverless Function timeouts. The client-side is expected to reconnect.
    - **Data Population**: Manually populates related models (like `Board`) before sending the event, as MongoDB `watch()` returns raw documents.
- **Event Types**:
    - `notification-create`: Real-time alerts for new interactions.
    - `notification-update`: Syncs read/unread status across multiple tabs.

## 3. Webhooks and Svix
For external real-time events and high-reliability notification delivery, the project integrates with **Svix**.
- **Usage**: Typically used to power the outgoing webhooks for third-party integrations (e.g., notifying a user's Slack channel about a new board post).
- **Security**: Svix provides signed payloads to ensure that requests received at webhook endpoints (like `app/api/resend/webhook`) are authentic.

## 4. Client-Side Implementation
The UI uses the browser's native `EventSource` API (or a polyfill) to listen to these streams. The logic is centralized in the board and dashboard modules to ensure that state remains synced without triggering unnecessary re-renders.
