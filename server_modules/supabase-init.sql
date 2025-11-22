-- Supabase 数据库初始化 SQL
-- 在 Supabase Dashboard 的 SQL Editor 中执行此脚本

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- 创建社区帖子表
CREATE TABLE IF NOT EXISTS community_posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    tags TEXT,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 创建社区评论表
CREATE TABLE IF NOT EXISTS community_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES community_posts (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 创建点赞表
CREATE TABLE IF NOT EXISTS post_likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES community_posts (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE(post_id, user_id)
);

-- 创建评论点赞表
CREATE TABLE IF NOT EXISTS comment_likes (
    id SERIAL PRIMARY KEY,
    comment_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES community_comments (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE(comment_id, user_id)
);

-- 创建用户关注表
CREATE TABLE IF NOT EXISTS user_follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL,
    following_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES users (id),
    FOREIGN KEY (following_id) REFERENCES users (id),
    UNIQUE(follower_id, following_id)
);

-- 创建签到表
CREATE TABLE IF NOT EXISTS user_checkins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    checkin_date DATE NOT NULL,
    streak_days INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE(user_id, checkin_date)
);

-- 创建学习目标表
CREATE TABLE IF NOT EXISTS user_study_goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    daily_words INTEGER DEFAULT 20,
    weekly_hours INTEGER DEFAULT 5,
    target_score INTEGER DEFAULT 85,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE(user_id)
);

-- 创建用户词汇表
CREATE TABLE IF NOT EXISTS user_vocabulary (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    word VARCHAR(100) NOT NULL,
    meaning TEXT NOT NULL,
    pronunciation VARCHAR(100),
    example_sentence TEXT,
    category VARCHAR(50),
    difficulty_level INTEGER DEFAULT 1,
    mastery_level INTEGER DEFAULT 0,
    next_review_date TIMESTAMP,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE(user_id, word)
);

-- 创建基础词汇表
CREATE TABLE IF NOT EXISTS base_vocabulary (
    id SERIAL PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    meaning TEXT NOT NULL,
    pronunciation VARCHAR(100),
    example_sentence TEXT,
    level VARCHAR(10) NOT NULL,
    difficulty_level INTEGER DEFAULT 1,
    frequency INTEGER DEFAULT 0,
    part_of_speech VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(word, level)
);

-- 创建日记表
CREATE TABLE IF NOT EXISTS diary_entries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title TEXT DEFAULT '',
    content TEXT NOT NULL,
    mood TEXT DEFAULT 'normal',
    achievements TEXT DEFAULT '',
    tags TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 创建学习活动表
CREATE TABLE IF NOT EXISTS learning_activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    activity_data TEXT,
    duration INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    score DECIMAL(5,2) DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    study_words_count INTEGER DEFAULT 0,
    mastered_words_count INTEGER DEFAULT 0,
    streak_bonus INTEGER DEFAULT 0,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 创建试卷表
CREATE TABLE IF NOT EXISTS exam_papers (
    id SERIAL PRIMARY KEY,
    exam_type VARCHAR(10) NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    paper_number INTEGER DEFAULT 1,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    total_score INTEGER DEFAULT 710,
    time_allowed INTEGER DEFAULT 125,
    questions_count INTEGER DEFAULT 0,
    sections_count INTEGER DEFAULT 0,
    difficulty VARCHAR(10) DEFAULT 'medium',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(exam_type, year, month, paper_number)
);

-- 创建试卷部分表
CREATE TABLE IF NOT EXISTS exam_sections (
    id SERIAL PRIMARY KEY,
    paper_id INTEGER NOT NULL,
    section_type VARCHAR(20) NOT NULL,
    section_name VARCHAR(100) NOT NULL,
    section_order INTEGER DEFAULT 0,
    time_allowed VARCHAR(20),
    directions TEXT,
    passage_content TEXT,
    passage_title VARCHAR(255),
    passage_type VARCHAR(20) DEFAULT 'reading',
    has_multiple_passages BOOLEAN DEFAULT false,
    translation_content TEXT,
    translation_requirements TEXT,
    questions_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paper_id) REFERENCES exam_papers (id) ON DELETE CASCADE
);

-- 创建题目表
CREATE TABLE IF NOT EXISTS exam_questions (
    id SERIAL PRIMARY KEY,
    section_id INTEGER NOT NULL,
    question_type VARCHAR(20) NOT NULL DEFAULT 'single_choice',
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    options TEXT,
    correct_answer TEXT,
    analysis TEXT,
    explanation TEXT,
    question_order INTEGER DEFAULT 0,
    score INTEGER DEFAULT 1,
    requires_passage BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES exam_sections (id) ON DELETE CASCADE
);

-- 创建考试会话表
CREATE TABLE IF NOT EXISTS exam_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    paper_id INTEGER NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    time_spent INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'in_progress',
    answers TEXT DEFAULT '{}',
    total_score INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    total_count INTEGER DEFAULT 0,
    accuracy DECIMAL(5,2) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (paper_id) REFERENCES exam_papers (id)
);

-- 创建用户答案表
CREATE TABLE IF NOT EXISTS exam_user_answers (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    user_answer TEXT,
    is_correct BOOLEAN DEFAULT false,
    score INTEGER DEFAULT 0,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES exam_sessions (id),
    FOREIGN KEY (question_id) REFERENCES exam_questions (id),
    UNIQUE(session_id, question_id)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_user_vocabulary_user_id ON user_vocabulary(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_user_id ON exam_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_paper_id ON exam_sessions(paper_id);
CREATE INDEX IF NOT EXISTS idx_learning_activities_user_id ON learning_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_activities_date ON learning_activities(date);

-- 插入默认用户（可选）
-- INSERT INTO users (username, password, name, phone, avatar) 
-- VALUES ('student2025', '$2a$10$...', '王梦琪', '13800138000', '/image/大头.jpg')
-- ON CONFLICT (username) DO NOTHING;

