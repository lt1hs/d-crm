import { supabase } from '../../config/supabase';
import type { Database } from '../../types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];

export const chatApi = {
  // Get all conversations for user
  getMyConversations: async (userId: string) => {
    const { data, error } = await supabase
      .from('conversation_participants')
      .select(`
        conversation:conversations(
          *,
          participants:conversation_participants(
            user:users(id, full_name, avatar_url, status)
          ),
          last_message:messages(content, created_at, sender:users(full_name))
        )
      `)
      .eq('user_id', userId)
      .order('last_read_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get conversation messages
  getMessages: async (conversationId: string, limit: number = 50) => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users(id, full_name, avatar_url),
        reactions:message_reactions(emoji, user:users(id, full_name))
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Send message
  sendMessage: async (
    conversationId: string,
    senderId: string,
    content: string,
    type: 'text' | 'file' = 'text',
    fileUrl?: string,
    fileName?: string,
    fileSize?: number
  ) => {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        type,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize
      })
      .select('*, sender:users(id, full_name, avatar_url)')
      .single();

    if (error) throw error;

    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return data;
  },

  // Edit message
  editMessage: async (messageId: string, content: string) => {
    const { data, error } = await supabase
      .from('messages')
      .update({ content, edited: true })
      .eq('id', messageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete message
  deleteMessage: async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;
  },

  // Add reaction to message
  addReaction: async (messageId: string, userId: string, emoji: string) => {
    const { data, error } = await supabase
      .from('message_reactions')
      .upsert({
        message_id: messageId,
        user_id: userId,
        emoji
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Remove reaction
  removeReaction: async (messageId: string, userId: string, emoji: string) => {
    const { error } = await supabase
      .from('message_reactions')
      .delete()
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .eq('emoji', emoji);

    if (error) throw error;
  },

  // Create direct conversation
  createDirectConversation: async (userId1: string, userId2: string) => {
    // Check if conversation already exists
    const { data: existing } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', userId1)
      .in('conversation_id', 
        supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', userId2)
      );

    if (existing && existing.length > 0) {
      return existing[0].conversation_id;
    }

    // Create new conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        type: 'direct',
        created_by: userId1
      })
      .select()
      .single();

    if (convError) throw convError;

    // Add participants
    const { error: partError } = await supabase
      .from('conversation_participants')
      .insert([
        { conversation_id: conversation.id, user_id: userId1 },
        { conversation_id: conversation.id, user_id: userId2 }
      ]);

    if (partError) throw partError;

    return conversation.id;
  },

  // Create group conversation
  createGroupConversation: async (
    name: string,
    creatorId: string,
    participantIds: string[]
  ) => {
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        name,
        type: 'group',
        created_by: creatorId
      })
      .select()
      .single();

    if (convError) throw convError;

    // Add participants
    const participants = participantIds.map(userId => ({
      conversation_id: conversation.id,
      user_id: userId,
      role: userId === creatorId ? 'admin' : 'member'
    }));

    const { error: partError } = await supabase
      .from('conversation_participants')
      .insert(participants);

    if (partError) throw partError;

    return conversation;
  },

  // Mark conversation as read
  markAsRead: async (conversationId: string, userId: string) => {
    const { error } = await supabase.rpc('mark_conversation_read', {
      conv_id: conversationId,
      user_uuid: userId
    });

    if (error) throw error;
  },

  // Get unread count
  getUnreadCount: async (userId: string) => {
    const { data, error } = await supabase.rpc('get_unread_message_count', {
      user_uuid: userId
    });

    if (error) throw error;
    return data;
  },

  // Pin/unpin conversation
  togglePin: async (conversationId: string, pinned: boolean) => {
    const { error } = await supabase
      .from('conversations')
      .update({ pinned })
      .eq('id', conversationId);

    if (error) throw error;
  },

  // Archive/unarchive conversation
  toggleArchive: async (conversationId: string, archived: boolean) => {
    const { error } = await supabase
      .from('conversations')
      .update({ archived })
      .eq('id', conversationId);

    if (error) throw error;
  },

  // Search messages
  searchMessages: async (conversationId: string, query: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:users(id, full_name, avatar_url)')
      .eq('conversation_id', conversationId)
      .ilike('content', `%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
