import { openDB } from 'idb';

const DB_NAME = 'localNewsDB';
const STORE_NAME = 'news';
const DB_VERSION = 1;

// Initialize the database
export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

// Add a news item
export const addNews = async (newsItem) => {
  const db = await initDB();
  return db.add(STORE_NAME, newsItem);
};

// Get all news items
export const getAllNews = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

// Update a news item
export const updateNews = async (newsItem) => {
  const db = await initDB();
  return db.put(STORE_NAME, newsItem);
};

// Delete a news item
export const deleteNews = async (id) => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};