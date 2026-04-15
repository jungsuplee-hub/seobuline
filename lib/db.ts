import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { ADMIN_EMAILS, normalizeEmail } from "@/lib/auth-config";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "seobuline.db");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.pragma("busy_timeout = 5000");

let initialized = false;

function addColumnIfMissing(table: string, column: string, ddl: string) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
  if (!columns.some((item) => item.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
  }
}

function promoteConfiguredAdminUsers() {
  const normalizedAdminEmails = ADMIN_EMAILS.map((email) => normalizeEmail(email));
  if (!normalizedAdminEmails.length) return;

  const placeholders = normalizedAdminEmails.map(() => "?").join(", ");
  db.prepare(
    `UPDATE users
     SET role = 'admin', updated_at = CURRENT_TIMESTAMP
     WHERE lower(trim(email)) IN (${placeholders}) AND role <> 'admin'`,
  ).run(...normalizedAdminEmails);
}

export function initDb() {
  if (initialized) return;

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      nickname TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      region TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      image_urls TEXT,
      author_id INTEGER NOT NULL,
      region TEXT,
      view_count INTEGER NOT NULL DEFAULT 0,
      is_deleted INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS post_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      file_url TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      author_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      is_pinned INTEGER NOT NULL DEFAULT 0,
      image_url TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS news_articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      source_name TEXT NOT NULL,
      summary TEXT NOT NULL,
      source_url TEXT NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT,
      published_date TEXT NOT NULL,
      is_featured INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS faq_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS timeline_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT,
      timeline_date TEXT NOT NULL,
      status TEXT NOT NULL,
      source_name TEXT,
      source_url TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS politicians (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      party TEXT,
      district TEXT,
      office_type TEXT,
      region_tags TEXT,
      summary TEXT,
      stance_or_relevance TEXT,
      election_2026_status TEXT,
      source_name TEXT,
      source_url TEXT,
      official_website TEXT,
      x_url TEXT,
      blog_url TEXT,
      office_phone TEXT,
      image_url TEXT,
      is_visible INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      file_url TEXT,
      description TEXT,
      category TEXT,
      thumbnail_url TEXT,
      published_date TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_content (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      about_content TEXT,
      image_url TEXT,
      route_map_image_url TEXT,
      route_map_image_urls TEXT,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_stats (
      key TEXT PRIMARY KEY,
      value INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      used_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
    CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_post_images_post_id ON post_images(post_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
    CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
  `);

  addColumnIfMissing("users", "role", "role TEXT NOT NULL DEFAULT 'user'");
  addColumnIfMissing("posts", "view_count", "view_count INTEGER NOT NULL DEFAULT 0");
  addColumnIfMissing("posts", "image_urls", "image_urls TEXT");
  addColumnIfMissing("notices", "image_url", "image_url TEXT");
  addColumnIfMissing("notices", "is_pinned", "is_pinned INTEGER NOT NULL DEFAULT 0");
  addColumnIfMissing("news_articles", "image_url", "image_url TEXT");
  addColumnIfMissing("timeline_items", "image_url", "image_url TEXT");
  addColumnIfMissing("timeline_items", "source_name", "source_name TEXT");
  addColumnIfMissing("timeline_items", "source_url", "source_url TEXT");
  addColumnIfMissing("politicians", "image_url", "image_url TEXT");
  addColumnIfMissing("politicians", "region_tags", "region_tags TEXT");
  addColumnIfMissing("politicians", "stance_or_relevance", "stance_or_relevance TEXT");
  addColumnIfMissing("politicians", "election_2026_status", "election_2026_status TEXT");
  addColumnIfMissing("politicians", "source_name", "source_name TEXT");
  addColumnIfMissing("politicians", "official_website", "official_website TEXT");
  addColumnIfMissing("politicians", "x_url", "x_url TEXT");
  addColumnIfMissing("politicians", "blog_url", "blog_url TEXT");
  addColumnIfMissing("politicians", "office_phone", "office_phone TEXT");
  addColumnIfMissing("politicians", "is_visible", "is_visible INTEGER NOT NULL DEFAULT 1");
  addColumnIfMissing("resources", "thumbnail_url", "thumbnail_url TEXT");
  addColumnIfMissing("resources", "description", "description TEXT");
  addColumnIfMissing("resources", "file_url", "file_url TEXT");
  addColumnIfMissing("resources", "published_date", "published_date TEXT");
  addColumnIfMissing("site_content", "route_map_image_url", "route_map_image_url TEXT");
  addColumnIfMissing("site_content", "route_map_image_urls", "route_map_image_urls TEXT");
  addColumnIfMissing("site_content", "introduce_sections_json", "introduce_sections_json TEXT");
  addColumnIfMissing("site_content", "home_sections_json", "home_sections_json TEXT");

  db.prepare(
    `INSERT INTO site_stats (key, value, updated_at)
     VALUES ('home_view_count', 0, CURRENT_TIMESTAMP)
     ON CONFLICT(key) DO NOTHING`,
  ).run();

  db.prepare("INSERT INTO site_content (id, about_content) VALUES (1, '') ON CONFLICT(id) DO NOTHING").run();
  promoteConfiguredAdminUsers();

  initialized = true;
}

initDb();
