-- Insert Mind's Eye View schedule events

INSERT INTO "events" (title, description, venue, address, event_date, end_date, is_acoustic, created_at, updated_at)
VALUES
  (
    'Mind''s Eye View Acoustic',
    'Acoustic performance at Casa Carmen Farm and Winery',
    'Casa Carmen Farm and Winery',
    '49 Camino Way, West Grove, PA 19390',
    '2025-11-20 17:00:00',
    '2025-11-20 19:00:00',
    true,
    NOW(),
    NOW()
  ),
  (
    'Mind''s Eye View Full Band',
    'Full band performance at Liberty Tavern',
    'Liberty Tavern',
    '1937 Mac Dade Boulevard, Woodlyn, PA',
    '2025-11-29 19:30:00',
    '2025-11-29 23:30:00',
    false,
    NOW(),
    NOW()
  ),
  (
    'Mind''s Eye View Acoustic',
    'Acoustic performance at Casa Carmen Farm and Winery',
    'Casa Carmen Farm and Winery',
    '49 Camino Way, West Grove, PA 19390',
    '2025-12-18 17:00:00',
    '2025-12-18 19:00:00',
    true,
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- Show all upcoming events
SELECT id, title, venue, event_date, end_date, is_acoustic 
FROM "events" 
WHERE event_date >= NOW()
ORDER BY event_date ASC;
