# Chat System Documentation

## Overview
A real-time messaging system integrated into the dashboard with a compact, expandable interface positioned in the left sidebar.

## Features

### 1. Compact Floating Button
- Fixed position in bottom-left corner
- Shows unread message count badge
- Click to expand full chat interface
- Blue circular button with message icon

### 2. Expandable Chat Panel
- 396px width × 600px height panel
- Smooth expand/collapse animation
- Two main views: Conversations List & Active Chat

### 3. Conversations List View
- Search conversations by participant name
- "New Chat" button to start conversations
- List of all conversations with:
  - Participant avatar with online/offline status indicator
  - Last message preview
  - Timestamp (relative time: "2m ago", "1h ago", etc.)
  - Unread message count badge
- Empty state when no conversations exist

### 4. Active Conversation View
- Back button to return to conversations list
- Message history with:
  - Sender avatar
  - Message bubbles (blue for sent, gray for received)
  - Timestamps
  - Auto-scroll to latest message
- Message input with:
  - Multi-line textarea
  - Attachment button (paperclip icon)
  - Send button
  - Enter to send, Shift+Enter for new line

### 5. User Status Indicators
- Green dot: Online
- Gray dot: Offline
- Status shown on avatars in conversations list

## Technical Implementation

### Context & State Management
**ChatContext** (`context/ChatContext.tsx`)
- Manages all chat state
- Provides hooks for chat operations
- Persists conversations to localStorage

### Types
**Chat Types** (`types/chat.ts`)
```typescript
- ChatMessage: Individual message data
- ChatConversation: Conversation with participant
- ChatUser: User information for chat
```

### Components
**ChatPanel** (`components/chat/ChatPanel.tsx`)
- Main chat interface component
- Handles compact/expanded states
- Manages conversation and message views

### Utilities
**Chat Helpers** (`utils/chatHelpers.ts`)
- `formatDistanceToNow()`: Relative time formatting
- `formatMessageTime()`: Message timestamp formatting
- `groupMessagesByDate()`: Group messages by date

## Usage

### Starting a Conversation
1. Click the chat button in bottom-left corner
2. Click "New Chat" button
3. Select a user from the available users list
4. Start typing your message

### Sending Messages
1. Type message in the input field
2. Press Enter or click Send button
3. Message appears in conversation history

### Viewing Conversations
- All conversations appear in the list
- Unread conversations show badge count
- Click any conversation to open it

### Searching Conversations
- Use search bar at top of conversations list
- Filters by participant name in real-time

## Integration

The chat system is integrated into the main App:

```typescript
<ChatProvider>
  <AppContent />
</ChatProvider>
```

And rendered as a floating panel:

```typescript
<ChatPanel 
  isExpanded={isChatExpanded} 
  onToggle={() => setIsChatExpanded(!isChatExpanded)} 
/>
```

## Data Persistence

- Conversations stored in `localStorage` under key `chatConversations`
- Automatically saves on every message
- Loads on app initialization

## Styling

- Uses Tailwind CSS for all styling
- Dark mode support throughout
- Smooth transitions and animations
- Responsive design (optimized for desktop)

## Future Enhancements

Potential improvements:
- Real-time updates via WebSocket
- File/image attachments
- Message reactions
- Typing indicators
- Read receipts
- Group chats
- Message search
- Voice messages
- Video calls
- Message deletion/editing
- Push notifications
