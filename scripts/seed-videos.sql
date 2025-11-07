-- Insert YouTube videos for Mind's Eye View
-- Based on videos from client information folder

-- Full Band Videos
INSERT INTO "videos" (title, description, youtube_url, youtube_id, is_acoustic, display_order, created_at)
VALUES
  ('Brown Eyed Girl - Mind''s Eye View', 'Live performance of Brown Eyed Girl', 'https://www.youtube.com/watch?v=2Oxycuh_tPI', '2Oxycuh_tPI', false, 1, NOW()),
  ('Mind''s Eye View - Live Performance', 'Live band performance', 'https://www.youtube.com/watch?v=e2jAxUtMTkY', 'e2jAxUtMTkY', false, 2, NOW()),
  ('Mind''s Eye View - Live Show', 'Full band live performance', 'https://www.youtube.com/watch?v=3v_o0CGAlf0', '3v_o0CGAlf0', false, 3, NOW()),
  ('Mind''s Eye View - Performance', 'Band performance showcase', 'https://www.youtube.com/watch?v=YPEwez8orC4', 'YPEwez8orC4', false, 4, NOW()),
  ('Mind''s Eye View - Live Music', 'Live performance highlights', 'https://www.youtube.com/watch?v=xMl3uu246wc', 'xMl3uu246wc', false, 5, NOW()),
  ('Mind''s Eye View - Concert', 'Concert performance', 'https://www.youtube.com/watch?v=WFY-9BmVchc', 'WFY-9BmVchc', false, 6, NOW()),
  ('Mind''s Eye View - Band Performance', 'Full band showcase', 'https://www.youtube.com/watch?v=6DGYFEB3xok', '6DGYFEB3xok', false, 7, NOW())
ON CONFLICT DO NOTHING;

-- Show all videos
SELECT id, title, youtube_id, is_acoustic, display_order FROM "videos" ORDER BY is_acoustic, display_order;
