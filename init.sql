-- Create tables for Minds Eye View website

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    venue VARCHAR(255) NOT NULL,
    address TEXT,
    event_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    ticket_url VARCHAR(500),
    is_acoustic BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    thumbnail_path VARCHAR(500),
    uploaded_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Videos table (for YouTube embeds and metadata)
CREATE TABLE IF NOT EXISTS videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    youtube_url VARCHAR(500) NOT NULL,
    youtube_id VARCHAR(50) NOT NULL,
    is_acoustic BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    unsubscribe_token VARCHAR(100) UNIQUE
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Insert initial YouTube videos from questionnaire
INSERT INTO videos (title, youtube_url, youtube_id, is_acoustic, display_order) VALUES
    ('Minds Eye View Performance 1', 'https://www.youtube.com/watch?v=e2jAxUtMTkY', 'e2jAxUtMTkY', false, 1),
    ('Minds Eye View Performance 2', 'https://www.youtube.com/watch?v=3v_o0CGAlf0', '3v_o0CGAlf0', false, 2),
    ('Minds Eye View Performance 3', 'https://www.youtube.com/watch?v=YPEwez8orC4', 'YPEwez8orC4', false, 3),
    ('Minds Eye View Performance 4', 'https://www.youtube.com/watch?v=xMl3uu246wc', 'xMl3uu246wc', false, 4),
    ('Minds Eye View Performance 5', 'https://www.youtube.com/watch?v=2Oxycuh_tPI', '2Oxycuh_tPI', false, 5),
    ('Minds Eye View Performance 6', 'https://www.youtube.com/watch?v=WFY-9BmVchc', 'WFY-9BmVchc', false, 6),
    ('Minds Eye View Performance 7', 'https://www.youtube.com/watch?v=6DGYFEB3xok', '6DGYFEB3xok', false, 7);

-- Create indexes for better performance
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_videos_display_order ON videos(display_order);
