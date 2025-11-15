import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { supabase } from '../config/supabase';
import { notificationsApi } from '../utils/api';

export const useChatNotifications = () => {
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();

  useEffect(() => {
    if (!currentUser) {
      console.log('⏸️ Chat notifications: waiting for currentUser');
      return;
    }

    console.log('🔔 Setting up chat notifications for user:', currentUser.id);

    // Subscribe to new messages
    const channel = supabase
      .channel('chat-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        async (payload) => {
          try {
            const message = payload.new as any;
            console.log('📨 New message received:', message.id, 'from:', message.sender_id);

            // Skip if it's our own message
            if (message.sender_id === currentUser.id) {
              console.log('⏭️ Skipping own message');
              return;
            }

            // Check if message is in a conversation we're part of
            const { data: participant, error: participantError } = await supabase
              .from('conversation_participants')
              .select('conversation_id')
              .eq('conversation_id', message.conversation_id)
              .eq('user_id', currentUser.id)
              .single();

            console.log('👥 Participant check result:', { participant, participantError });

            if (participantError || !participant) {
              console.log('⏭️ Not a participant in this conversation');
              return;
            }

            // Get sender info
            const { data: sender, error: senderError } = await supabase
              .from('users')
              .select('full_name')
              .eq('id', message.sender_id)
              .single();

            console.log('👤 Sender info:', { sender, senderError });

            // Get conversation info
            const { data: conversation, error: conversationError } = await supabase
              .from('conversations')
              .select('name, type')
              .eq('id', message.conversation_id)
              .single();

            console.log('💬 Conversation info:', { conversation, conversationError });

            const senderName = sender ? (sender as any).full_name : 'Someone';
            const conversationType = conversation ? (conversation as any).type : 'direct';

            console.log('💬 Conversation type:', conversationType);

            // Don't notify for personal chat (it's just you talking to yourself)
            if (conversationType === 'personal') {
              console.log('⏭️ Skipping personal chat notification');
              return;
            }

            console.log('✅ Creating notification for message from:', senderName);

            // Create notification in database
            const notificationResult = await notificationsApi.createNotification({
              user_id: currentUser.id,
              title: `New message from ${senderName}`,
              message: message.content.substring(0, 100),
              type: 'mention',
              action_url: `/chat/${message.conversation_id}`,
              metadata: {
                conversationId: message.conversation_id,
                messageId: message.id,
                senderId: message.sender_id
              }
            });

            console.log('🎉 Notification created successfully:', notificationResult);
          } catch (error) {
            console.error('❌ Error creating chat notification:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Chat notifications subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to chat notifications');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Chat notifications subscription error');
        }
      });

    return () => {
      console.log('🔌 Unsubscribing from chat notifications');
      channel.unsubscribe();
    };
  }, [currentUser?.id]); // Only depend on user ID, not the whole object
};
