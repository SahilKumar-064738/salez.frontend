/**
 * src/services/conversations.ts
 *
 * DEPRECATED — This file used /api/conversations which does not exist.
 *
 * The backend does not have a /conversations resource.
 * Conversations are accessed via:
 *   GET  /api/v1/messages/inbox                     — inbox list
 *   GET  /api/v1/messages/conversation/:contactId   — message thread
 *   POST /api/v1/messages/send                      — send message
 *
 * Use messagesService from "@/services/messagesService" instead.
 * This file re-exports messagesService methods to avoid breaking any
 * existing imports until callers are updated.
 */

export { messagesService as conversationsService } from "@/services/messagesService";

