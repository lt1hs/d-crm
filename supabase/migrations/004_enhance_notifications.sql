-- =====================================================
-- ENHANCED NOTIFICATION SYSTEM
-- =====================================================

-- Add notification preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Notification channels
  push_enabled BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT true,
  browser_enabled BOOLEAN DEFAULT true,
  sound_enabled BOOLEAN DEFAULT true,
  
  -- Notification types preferences
  task_assigned BOOLEAN DEFAULT true,
  task_completed BOOLEAN DEFAULT true,
  task_commented BOOLEAN DEFAULT true,
  task_due_soon BOOLEAN DEFAULT true,
  task_overdue BOOLEAN DEFAULT true,
  
  mention_in_chat BOOLEAN DEFAULT true,
  mention_in_comment BOOLEAN DEFAULT true,
  
  project_updates BOOLEAN DEFAULT true,
  project_deadline BOOLEAN DEFAULT false,
  
  chat_messages BOOLEAN DEFAULT true,
  direct_messages BOOLEAN DEFAULT true,
  
  system_updates BOOLEAN DEFAULT true,
  
  -- Quiet hours
  quiet_hours_enabled BOOLEAN DEFAULT false,
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '08:00',
  
  -- Digest settings
  daily_digest_enabled BOOLEAN DEFAULT false,
  daily_digest_time TIME DEFAULT '09:00',
  weekly_digest_enabled BOOLEAN DEFAULT false,
  weekly_digest_day INTEGER DEFAULT 1, -- 1 = Monday
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Add notification groups for batching similar notifications
CREATE TABLE IF NOT EXISTS public.notification_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  group_key TEXT NOT NULL, -- e.g., 'task_assigned_project_123'
  title TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  last_notification_id UUID,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add scheduled notifications
CREATE TABLE IF NOT EXISTS public.scheduled_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add notification delivery log
CREATE TABLE IF NOT EXISTS public.notification_delivery_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_id UUID REFERENCES public.notifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('push', 'email', 'browser', 'sms')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed', 'skipped')),
  error_message TEXT,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_notification_preferences_user ON public.notification_preferences(user_id);
CREATE INDEX idx_notification_groups_user ON public.notification_groups(user_id);
CREATE INDEX idx_notification_groups_key ON public.notification_groups(group_key);
CREATE INDEX idx_scheduled_notifications_user ON public.scheduled_notifications(user_id);
CREATE INDEX idx_scheduled_notifications_scheduled ON public.scheduled_notifications(scheduled_for) WHERE NOT sent;
CREATE INDEX idx_notification_delivery_log_notification ON public.notification_delivery_log(notification_id);
CREATE INDEX idx_notification_delivery_log_user ON public.notification_delivery_log(user_id);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_delivery_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notification_preferences
CREATE POLICY "Users can view own notification preferences"
  ON public.notification_preferences FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notification preferences"
  ON public.notification_preferences FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own notification preferences"
  ON public.notification_preferences FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for notification_groups
CREATE POLICY "Users can view own notification groups"
  ON public.notification_groups FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can manage notification groups"
  ON public.notification_groups FOR ALL
  USING (true);

-- RLS Policies for scheduled_notifications
CREATE POLICY "Users can view own scheduled notifications"
  ON public.scheduled_notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can manage scheduled notifications"
  ON public.scheduled_notifications FOR ALL
  USING (true);

-- RLS Policies for notification_delivery_log
CREATE POLICY "Users can view own delivery logs"
  ON public.notification_delivery_log FOR SELECT
  USING (user_id = auth.uid());

-- Function to create default notification preferences for new users
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default preferences
CREATE TRIGGER on_user_created_notification_preferences
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_notification_preferences();

-- Function to check if user should receive notification based on preferences
CREATE OR REPLACE FUNCTION should_send_notification(
  p_user_id UUID,
  p_notification_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_prefs RECORD;
  v_current_time TIME;
BEGIN
  -- Get user preferences
  SELECT * INTO v_prefs
  FROM public.notification_preferences
  WHERE user_id = p_user_id;
  
  -- If no preferences found, allow notification
  IF NOT FOUND THEN
    RETURN true;
  END IF;
  
  -- Check quiet hours
  IF v_prefs.quiet_hours_enabled THEN
    v_current_time := CURRENT_TIME;
    IF v_prefs.quiet_hours_start < v_prefs.quiet_hours_end THEN
      -- Normal case: e.g., 22:00 to 08:00
      IF v_current_time >= v_prefs.quiet_hours_start AND v_current_time < v_prefs.quiet_hours_end THEN
        RETURN false;
      END IF;
    ELSE
      -- Wraps midnight: e.g., 22:00 to 08:00
      IF v_current_time >= v_prefs.quiet_hours_start OR v_current_time < v_prefs.quiet_hours_end THEN
        RETURN false;
      END IF;
    END IF;
  END IF;
  
  -- Check type-specific preferences
  CASE p_notification_type
    WHEN 'task_assigned' THEN RETURN v_prefs.task_assigned;
    WHEN 'task_completed' THEN RETURN v_prefs.task_completed;
    WHEN 'task_commented' THEN RETURN v_prefs.task_commented;
    WHEN 'task_due_soon' THEN RETURN v_prefs.task_due_soon;
    WHEN 'task_overdue' THEN RETURN v_prefs.task_overdue;
    WHEN 'mention_in_chat' THEN RETURN v_prefs.mention_in_chat;
    WHEN 'mention_in_comment' THEN RETURN v_prefs.mention_in_comment;
    WHEN 'project_updates' THEN RETURN v_prefs.project_updates;
    WHEN 'project_deadline' THEN RETURN v_prefs.project_deadline;
    WHEN 'chat_messages' THEN RETURN v_prefs.chat_messages;
    WHEN 'direct_messages' THEN RETURN v_prefs.direct_messages;
    WHEN 'system_updates' THEN RETURN v_prefs.system_updates;
    ELSE RETURN true;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process scheduled notifications
CREATE OR REPLACE FUNCTION process_scheduled_notifications()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER := 0;
  v_notification RECORD;
BEGIN
  FOR v_notification IN
    SELECT * FROM public.scheduled_notifications
    WHERE scheduled_for <= NOW()
    AND NOT sent
    ORDER BY scheduled_for
    LIMIT 100
  LOOP
    -- Check if user should receive this notification
    IF should_send_notification(v_notification.user_id, v_notification.type) THEN
      -- Create the notification
      INSERT INTO public.notifications (
        user_id,
        title,
        message,
        type,
        action_url,
        metadata
      ) VALUES (
        v_notification.user_id,
        v_notification.title,
        v_notification.message,
        v_notification.type,
        v_notification.action_url,
        v_notification.metadata
      );
      
      v_count := v_count + 1;
    END IF;
    
    -- Mark as sent
    UPDATE public.scheduled_notifications
    SET sent = true, sent_at = NOW()
    WHERE id = v_notification.id;
  END LOOP;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to group similar notifications
CREATE OR REPLACE FUNCTION group_notification(
  p_user_id UUID,
  p_group_key TEXT,
  p_title TEXT,
  p_notification_id UUID
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.notification_groups (
    user_id,
    group_key,
    title,
    count,
    last_notification_id,
    updated_at
  ) VALUES (
    p_user_id,
    p_group_key,
    p_title,
    1,
    p_notification_id,
    NOW()
  )
  ON CONFLICT (user_id, group_key)
  DO UPDATE SET
    count = notification_groups.count + 1,
    last_notification_id = p_notification_id,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add unique constraint for notification groups
ALTER TABLE public.notification_groups
ADD CONSTRAINT unique_user_group_key UNIQUE (user_id, group_key);

-- Create view for notification summary
CREATE OR REPLACE VIEW public.notification_summary AS
SELECT
  n.user_id,
  n.type,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE NOT n.read) as unread_count,
  MAX(n.created_at) as latest_notification
FROM public.notifications n
GROUP BY n.user_id, n.type;

-- Grant permissions
GRANT SELECT ON public.notification_summary TO authenticated;

COMMENT ON TABLE public.notification_preferences IS 'User-specific notification preferences and settings';
COMMENT ON TABLE public.notification_groups IS 'Groups similar notifications together for better UX';
COMMENT ON TABLE public.scheduled_notifications IS 'Notifications scheduled for future delivery';
COMMENT ON TABLE public.notification_delivery_log IS 'Log of notification delivery attempts across channels';
