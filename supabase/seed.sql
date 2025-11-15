-- Seed data for testing
-- Run this after the initial migration to populate test data

-- Note: You'll need to create auth users first through the Supabase dashboard or API
-- Then use their UUIDs here

-- Example: Insert test users (replace with actual auth.users IDs)
-- INSERT INTO public.users (id, email, full_name, role, department, position, avatar_url) VALUES
-- ('user-uuid-1', 'admin@example.com', 'Admin User', 'admin', 'Management', 'CEO', '/imgs/avatars/admin.jpg'),
-- ('user-uuid-2', 'manager@example.com', 'Manager User', 'manager', 'Engineering', 'Engineering Manager', '/imgs/avatars/manager.jpg'),
-- ('user-uuid-3', 'employee@example.com', 'Employee User', 'employee', 'Engineering', 'Software Developer', '/imgs/avatars/employee.jpg');

-- Sample Projects
INSERT INTO public.projects (id, name, description, color, icon, owner_id, status, start_date) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Website Redesign', 'Complete redesign of company website', '#3B82F6', 'globe', (SELECT id FROM public.users LIMIT 1), 'active', CURRENT_DATE),
('550e8400-e29b-41d4-a716-446655440002', 'Mobile App Development', 'Build iOS and Android mobile applications', '#10B981', 'smartphone', (SELECT id FROM public.users LIMIT 1), 'active', CURRENT_DATE),
('550e8400-e29b-41d4-a716-446655440003', 'Marketing Campaign Q4', 'Q4 marketing initiatives and campaigns', '#F59E0B', 'megaphone', (SELECT id FROM public.users LIMIT 1), 'active', CURRENT_DATE);

-- Sample Tasks
INSERT INTO public.tasks (title, description, project_id, creator_id, assignee_id, priority, status, due_date, tags) VALUES
('Design homepage mockup', 'Create initial design mockups for the new homepage', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM public.users LIMIT 1), (SELECT id FROM public.users LIMIT 1), 'high', 'in-progress', CURRENT_DATE + INTERVAL '7 days', ARRAY['design', 'ui']),
('Set up development environment', 'Configure development environment for mobile app', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM public.users LIMIT 1), (SELECT id FROM public.users LIMIT 1), 'urgent', 'todo', CURRENT_DATE + INTERVAL '3 days', ARRAY['setup', 'dev']),
('Research competitor campaigns', 'Analyze competitor marketing strategies', '550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM public.users LIMIT 1), (SELECT id FROM public.users LIMIT 1), 'medium', 'todo', CURRENT_DATE + INTERVAL '14 days', ARRAY['research', 'marketing']);

-- Sample Subtasks
INSERT INTO public.subtasks (task_id, title, completed) VALUES
((SELECT id FROM public.tasks WHERE title = 'Design homepage mockup' LIMIT 1), 'Create wireframes', true),
((SELECT id FROM public.tasks WHERE title = 'Design homepage mockup' LIMIT 1), 'Design hero section', false),
((SELECT id FROM public.tasks WHERE title = 'Design homepage mockup' LIMIT 1), 'Design features section', false);

-- Sample Events
INSERT INTO public.events (title, description, type, start_time, end_time, creator_id, color) VALUES
('Team Standup', 'Daily team standup meeting', 'meeting', CURRENT_TIMESTAMP + INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '30 minutes', (SELECT id FROM public.users LIMIT 1), '#3B82F6'),
('Project Deadline', 'Website redesign phase 1 deadline', 'deadline', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP + INTERVAL '30 days', (SELECT id FROM public.users LIMIT 1), '#EF4444'),
('Company Holiday', 'Thanksgiving Holiday', 'holiday', CURRENT_TIMESTAMP + INTERVAL '60 days', CURRENT_TIMESTAMP + INTERVAL '60 days', (SELECT id FROM public.users LIMIT 1), '#10B981');

-- Sample Publications
INSERT INTO public.publications (title, content, excerpt, type, status, author_id, category, tags, featured_image) VALUES
('Welcome to Our New Platform', 'We are excited to announce the launch of our new HR platform...', 'Announcing our new HR platform', 'news', 'published', (SELECT id FROM public.users LIMIT 1), 'Announcements', ARRAY['platform', 'launch'], '/imgs/news/platform-launch.jpg'),
('Best Practices for Remote Work', 'In this article, we explore the best practices for effective remote work...', 'Tips for working remotely', 'article', 'published', (SELECT id FROM public.users LIMIT 1), 'Productivity', ARRAY['remote', 'productivity'], '/imgs/articles/remote-work.jpg'),
('Q4 Training Schedule', 'Check out our comprehensive training schedule for Q4...', 'Q4 training opportunities', 'news', 'published', (SELECT id FROM public.users LIMIT 1), 'Training', ARRAY['training', 'development'], '/imgs/news/training.jpg');

-- Sample Notifications
INSERT INTO public.notifications (user_id, title, message, type, read) VALUES
((SELECT id FROM public.users LIMIT 1), 'Welcome!', 'Welcome to Aspire HR Dashboard', 'info', false),
((SELECT id FROM public.users LIMIT 1), 'New Task Assigned', 'You have been assigned to "Design homepage mockup"', 'task', false),
((SELECT id FROM public.users LIMIT 1), 'Meeting Reminder', 'Team standup meeting in 1 hour', 'info', false);

-- Sample Activity Logs
INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, metadata) VALUES
((SELECT id FROM public.users LIMIT 1), 'created', 'project', '550e8400-e29b-41d4-a716-446655440001', '{"project_name": "Website Redesign"}'),
((SELECT id FROM public.users LIMIT 1), 'created', 'task', (SELECT id FROM public.tasks LIMIT 1), '{"task_title": "Design homepage mockup"}'),
((SELECT id FROM public.users LIMIT 1), 'updated', 'task', (SELECT id FROM public.tasks LIMIT 1), '{"field": "status", "old_value": "todo", "new_value": "in-progress"}');

-- Note: For chat/conversations, you'll need to create these through the API
-- as they require proper participant relationships

COMMENT ON TABLE public.users IS 'Seed data loaded successfully';
