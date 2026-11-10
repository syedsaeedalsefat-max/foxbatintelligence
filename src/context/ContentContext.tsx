import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  type ComicStory,
  type ComicPage,
  type OrderItem,
  type OrderStatus,
  type CommentItem,
  type CommentStatus,
  type SiteAnnouncement,
  INITIAL_COMICS,
  INITIAL_ORDERS,
  INITIAL_COMMENTS,
  INITIAL_ANNOUNCEMENT,
} from '../lib/initialContent';

export type {
  ComicStory,
  ComicPage,
  OrderItem,
  OrderStatus,
  CommentItem,
  CommentStatus,
  SiteAnnouncement,
};

interface ContentContextType {
  comics: ComicStory[];
  orders: OrderItem[];
  comments: CommentItem[];
  announcement: SiteAnnouncement;

  // Comic Operations
  addComic: (comic: Omit<ComicStory, 'id'>) => string;
  updateComic: (id: string, updates: Partial<ComicStory>) => void;
  deleteComic: (id: string) => void;
  addPageToComic: (comicId: string, page: Omit<ComicPage, 'pageNumber'>) => void;
  deletePageFromComic: (comicId: string, pageNumber: number) => void;

  // Order / Service Request Operations
  addOrder: (order: Omit<OrderItem, 'id' | 'submittedAt' | 'status'>) => string;
  updateOrderStatus: (
    id: string,
    status: OrderStatus,
    notes?: string,
    assignedAssessor?: string
  ) => void;
  deleteOrder: (id: string) => void;

  // Comment & Feedback Operations
  addComment: (comment: Omit<CommentItem, 'id' | 'createdAt' | 'status'>) => void;
  updateCommentStatus: (id: string, status: CommentStatus) => void;
  replyToComment: (id: string, reply: string) => void;
  deleteComment: (id: string) => void;

  // Announcement Operations
  updateAnnouncement: (updates: Partial<SiteAnnouncement>) => void;

  // Reset helper
  resetAllContent: () => void;
}

const STORAGE_KEYS = {
  COMICS: 'foxbat_cms_comics',
  ORDERS: 'foxbat_cms_orders',
  COMMENTS: 'foxbat_cms_comments',
  ANNOUNCEMENT: 'foxbat_cms_announcement',
};

const ContentContext = createContext<ContentContextType | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`[ContentStore] Error loading ${key}:`, e);
  }
  return fallback;
}

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comics, setComics] = useState<ComicStory[]>(() =>
    loadFromStorage<ComicStory[]>(STORAGE_KEYS.COMICS, INITIAL_COMICS)
  );

  const [orders, setOrders] = useState<OrderItem[]>(() =>
    loadFromStorage<OrderItem[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
  );

  const [comments, setComments] = useState<CommentItem[]>(() =>
    loadFromStorage<CommentItem[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS)
  );

  const [announcement, setAnnouncement] = useState<SiteAnnouncement>(() =>
    loadFromStorage<SiteAnnouncement>(STORAGE_KEYS.ANNOUNCEMENT, INITIAL_ANNOUNCEMENT)
  );

  // Sync state to localStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMICS, JSON.stringify(comics));
    } catch (err) {
      console.warn('Storage sync failed', err);
    }
  }, [comics]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (err) {
      console.warn('Storage sync failed', err);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    } catch (err) {
      console.warn('Storage sync failed', err);
    }
  }, [comments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENT, JSON.stringify(announcement));
    } catch (err) {
      console.warn('Storage sync failed', err);
    }
  }, [announcement]);

  // Comic CRUD
  const addComic = (comicData: Omit<ComicStory, 'id'>): string => {
    const newId = 'comic-' + Date.now().toString(36);
    const newComic: ComicStory = {
      ...comicData,
      id: newId,
    };
    setComics((prev) => [newComic, ...prev]);
    return newId;
  };

  const updateComic = (id: string, updates: Partial<ComicStory>) => {
    setComics((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteComic = (id: string) => {
    setComics((prev) => prev.filter((item) => item.id !== id));
  };

  const addPageToComic = (
    comicId: string,
    pageData: Omit<ComicPage, 'pageNumber'>
  ) => {
    setComics((prev) =>
      prev.map((comic) => {
        if (comic.id !== comicId) return comic;
        const newPageNum = comic.pages.length + 1;
        const newPage: ComicPage = {
          ...pageData,
          pageNumber: newPageNum,
        };
        return {
          ...comic,
          pages: [...comic.pages, newPage],
        };
      })
    );
  };

  const deletePageFromComic = (comicId: string, pageNumber: number) => {
    setComics((prev) =>
      prev.map((comic) => {
        if (comic.id !== comicId) return comic;
        const filtered = comic.pages
          .filter((p) => p.pageNumber !== pageNumber)
          .map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
        return { ...comic, pages: filtered };
      })
    );
  };

  // Order CRUD
  const addOrder = (orderData: Omit<OrderItem, 'id' | 'submittedAt' | 'status'>): string => {
    const newId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newOrder: OrderItem = {
      ...orderData,
      id: newId,
      submittedAt: now,
      status: 'pending',
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newId;
  };

  const updateOrderStatus = (
    id: string,
    status: OrderStatus,
    notes?: string,
    assignedAssessor?: string
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== id) return order;
        return {
          ...order,
          status,
          ...(notes !== undefined ? { notes } : {}),
          ...(assignedAssessor !== undefined ? { assignedAssessor } : {}),
        };
      })
    );
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  // Comments CRUD
  const addComment = (commentData: Omit<CommentItem, 'id' | 'createdAt' | 'status'>) => {
    const newId = 'cmt-' + Date.now().toString(36);
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newComment: CommentItem = {
      ...commentData,
      id: newId,
      createdAt: now,
      status: 'pending',
    };
    setComments((prev) => [newComment, ...prev]);
  };

  const updateCommentStatus = (id: string, status: CommentStatus) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  const replyToComment = (id: string, reply: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, reply, status: 'approved' } : c))
    );
  };

  const deleteComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  // Announcement
  const updateAnnouncement = (updates: Partial<SiteAnnouncement>) => {
    setAnnouncement((prev) => ({ ...prev, ...updates }));
  };

  // Reset
  const resetAllContent = () => {
    setComics(INITIAL_COMICS);
    setOrders(INITIAL_ORDERS);
    setComments(INITIAL_COMMENTS);
    setAnnouncement(INITIAL_ANNOUNCEMENT);
    localStorage.removeItem(STORAGE_KEYS.COMICS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.COMMENTS);
    localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENT);
  };

  return (
    <ContentContext.Provider
      value={{
        comics,
        orders,
        comments,
        announcement,
        addComic,
        updateComic,
        deleteComic,
        addPageToComic,
        deletePageFromComic,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        addComment,
        updateCommentStatus,
        replyToComment,
        deleteComment,
        updateAnnouncement,
        resetAllContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
