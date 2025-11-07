-- Delete existing admin user
DELETE FROM "AdminUser" WHERE email = 'admin@mindseyeview.net';

-- Insert admin user with bcrypt hash for 'AdminPass2024!'
-- This hash was generated using bcryptjs with 10 rounds
INSERT INTO "AdminUser" (email, name, "passwordHash", "createdAt", "updatedAt")
VALUES (
  'admin@mindseyeview.net',
  'Admin',
  '$2a$10$ONx7QUwE6SNAezV5lG4JC.AT9BFUtHLfsngbfa4fMRinTkAq48HGO',
  NOW(),
  NOW()
);

SELECT id, email, name, "createdAt" FROM "AdminUser" WHERE email = 'admin@mindseyeview.net';
