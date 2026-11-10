import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  type ComicStory,
  type ComicPage,
  type OrderItem,
  type OrderStatus,
  type CommentItem,
  type CommentStatus,
  type SiteAnnouncement,
  type HomePageContent,
  type ServiceItem,
  type ResourceArticle,
  type ChecklistItem,
  type SiteSettings,
  type MediaAsset,
  sanitizeText,
  INITIAL_COMICS,
  INITIAL_ORDERS,
  INITIAL_COMMENTS,
  INITIAL_ANNOUNCEMENT,
  INITIAL_HOME_CONTENT,
  INITIAL_SERVICES,
  INITIAL_ARTICLES,
  INITIAL_CHECKLIST,
  INITIAL_SETTINGS,
  INITIAL_MEDIA,
} from '../lib/initialContent';

export type {
  ComicStory,
  ComicPage,
  OrderItem,
  OrderStatus,
  CommentItem,
  CommentStatus,
  SiteAnnouncement,
  HomePageContent,
  ServiceItem,
  ResourceArticle,
  ChecklistItem,
  SiteSettings,
  MediaAsset,
};

interface ContentContextType {
  comics: ComicStory[];
  orders: OrderItem[];
  comments: CommentItem[];
  announcement: SiteAnnouncement;
  homeContent: HomePageContent;
  servicesList: ServiceItem[];
  resourcesArticles: ResourceArticle[];
  checklistItems: ChecklistItem[];
  siteSettings: SiteSettings;
  mediaLibrary: MediaAsset[];
  mediaAssets: MediaAsset[];

  // Comic Operations
  addComic: (comic: Omit<ComicStory, 'id'>) => string;
  updateComic: (id: string, updates: Partial<ComicStory>) => void;
  deleteComic: (id: string) => void;
  addPageToComic: (comicId: string, page: Omit<ComicPage, 'pageNumber'>) => void;
  deletePageFromComic: (comicId: string, pageNumber: number) => void;

  // Order Operations
  addOrder: (order: Omit<OrderItem, 'id' | 'submittedAt' | 'status'>) => string;
  updateOrderStatus: (
    id: string,
    status: OrderStatus,
    notes?: string,
    assignedAssessor?: string
  ) => void;
  deleteOrder: (id: string) => void;

  // Comment Operations
  addComment: (comment: Omit<CommentItem, 'id' | 'createdAt' | 'status'>) => void;
  updateCommentStatus: (id: string, status: CommentStatus) => void;
  replyToComment: (id: string, reply: string) => void;
  deleteComment: (id: string) => void;

  // Home Page Operations
  updateHomeContent: (updates: Partial<HomePageContent>) => void;
  resetHomeContent: () => void;

  // Services Operations
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, updates: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  resetServices: () => void;

  // Resources Operations
  addArticle: (article: Omit<ResourceArticle, 'id'>) => void;
  updateArticle: (id: string, updates: Partial<ResourceArticle>) => void;
  deleteArticle: (id: string) => void;
  resetArticles: () => void;
  toggleChecklistItem: (id: number) => void;
  addChecklistItem: (text: string) => void;
  deleteChecklistItem: (id: number) => void;
  resetChecklist: () => void;

  // Site Settings Operations
  updateSiteSettings: (updates: Partial<SiteSettings>) => void;
  resetSiteSettings: () => void;

  // Media Library Operations
  uploadMedia: (name: string, dataUrl: string, sizeBytes: number) => void;
  deleteMedia: (id: string) => void;
  addMediaAsset: (asset: {
    title: string;
    url: string;
    category?: 'logo' | 'cover' | 'panel' | 'diagram' | 'general';
    sizeBytes: number;
  }) => void;
  deleteMediaAsset: (id: string) => void;

  // Announcement Operations
  updateAnnouncement: (updates: Partial<SiteAnnouncement>) => void;

  // Backup & Restore
  exportFullSiteBackupJSON: () => string;
  importFullSiteBackupJSON: (jsonStr: string) => boolean;
  exportAllContentJson: () => string;
  importAllContentJson: (jsonStr: string) => boolean;
  resetAllContent: () => void;
  resetAllToFactoryDefaults: () => void;
}

const STORAGE_KEYS = {
  COMICS: 'foxbat_cms_comics_v2',
  ORDERS: 'foxbat_cms_orders_v2',
  COMMENTS: 'foxbat_cms_comments_v2',
  ANNOUNCEMENT: 'foxbat_cms_announcement_v2',
  HOME: 'foxbat_cms_home_v2',
  SERVICES: 'foxbat_cms_services_v2',
  ARTICLES: 'foxbat_cms_articles_v2',
  CHECKLIST: 'foxbat_cms_checklist_v2',
  SETTINGS: 'foxbat_cms_settings_v2',
  MEDIA: 'foxbat_cms_media_v2',
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

  const [homeContent, setHomeContent] = useState<HomePageContent>(() =>
    loadFromStorage<HomePageContent>(STORAGE_KEYS.HOME, INITIAL_HOME_CONTENT)
  );

  const [servicesList, setServicesList] = useState<ServiceItem[]>(() =>
    loadFromStorage<ServiceItem[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES)
  );

  const [resourcesArticles, setResourcesArticles] = useState<ResourceArticle[]>(() =>
    loadFromStorage<ResourceArticle[]>(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES)
  );

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(() =>
    loadFromStorage<ChecklistItem[]>(STORAGE_KEYS.CHECKLIST, INITIAL_CHECKLIST)
  );

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() =>
    loadFromStorage<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS)
  );

  const [mediaLibrary, setMediaLibrary] = useState<MediaAsset[]>(() =>
    loadFromStorage<MediaAsset[]>(STORAGE_KEYS.MEDIA, INITIAL_MEDIA)
  );

  // Sync state to localStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMICS, JSON.stringify(comics));
    } catch (err) {
      console.warn('Storage sync failed for comics', err);
    }
  }, [comics]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (err) {
      console.warn('Storage sync failed for orders', err);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    } catch (err) {
      console.warn('Storage sync failed for comments', err);
    }
  }, [comments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENT, JSON.stringify(announcement));
    } catch (err) {
      console.warn('Storage sync failed for announcement', err);
    }
  }, [announcement]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HOME, JSON.stringify(homeContent));
    } catch (err) {
      console.warn('Storage sync failed for homeContent', err);
    }
  }, [homeContent]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(servicesList));
    } catch (err) {
      console.warn('Storage sync failed for servicesList', err);
    }
  }, [servicesList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(resourcesArticles));
    } catch (err) {
      console.warn('Storage sync failed for resourcesArticles', err);
    }
  }, [resourcesArticles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(checklistItems));
    } catch (err) {
      console.warn('Storage sync failed for checklistItems', err);
    }
  }, [checklistItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(siteSettings));
    } catch (err) {
      console.warn('Storage sync failed for siteSettings', err);
    }
  }, [siteSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(mediaLibrary));
    } catch (err) {
      console.warn('Storage sync failed for mediaLibrary', err);
    }
  }, [mediaLibrary]);

  // Comic CRUD
  const addComic = (comicData: Omit<ComicStory, 'id'>): string => {
    const newId = 'comic-' + Date.now().toString(36);
    const newComic: ComicStory = {
      ...comicData,
      id: newId,
      title: sanitizeText(comicData.title),
      synopsis: sanitizeText(comicData.synopsis),
    };
    setComics((prev) => [newComic, ...prev]);
    return newId;
  };

  const updateComic = (id: string, updates: Partial<ComicStory>) => {
    setComics((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              ...(updates.title ? { title: sanitizeText(updates.title) } : {}),
              ...(updates.synopsis ? { synopsis: sanitizeText(updates.synopsis) } : {}),
            }
          : item
      )
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
          chapterTitle: pageData.chapterTitle ? sanitizeText(pageData.chapterTitle) : undefined,
          narrativeText: pageData.narrativeText ? sanitizeText(pageData.narrativeText) : undefined,
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
      clientName: sanitizeText(orderData.clientName),
      clientEmail: sanitizeText(orderData.clientEmail),
      targetScope: sanitizeText(orderData.targetScope),
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
          ...(notes !== undefined ? { notes: sanitizeText(notes) } : {}),
          ...(assignedAssessor !== undefined ? { assignedAssessor: sanitizeText(assignedAssessor) } : {}),
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
      authorName: sanitizeText(commentData.authorName),
      authorEmail: sanitizeText(commentData.authorEmail),
      content: sanitizeText(commentData.content),
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
      prev.map((c) => (c.id === id ? { ...c, reply: sanitizeText(reply), status: 'approved' } : c))
    );
  };

  const deleteComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  // Home Page Content
  const updateHomeContent = (updates: Partial<HomePageContent>) => {
    setHomeContent((prev) => ({
      ...prev,
      ...updates,
      ...(updates.heroTitlePrefix ? { heroTitlePrefix: sanitizeText(updates.heroTitlePrefix) } : {}),
      ...(updates.heroTitleHighlight ? { heroTitleHighlight: sanitizeText(updates.heroTitleHighlight) } : {}),
      ...(updates.heroSubtitle ? { heroSubtitle: sanitizeText(updates.heroSubtitle) } : {}),
      ...(updates.heroBadge ? { heroBadge: sanitizeText(updates.heroBadge) } : {}),
    }));
  };

  // Services CRUD
  const addService = (serviceData: Omit<ServiceItem, 'id'>) => {
    const newId = 'srv-' + Date.now().toString(36);
    const newService: ServiceItem = {
      ...serviceData,
      id: newId,
      title: sanitizeText(serviceData.title),
      description: sanitizeText(serviceData.description),
    };
    setServicesList((prev) => [...prev, newService]);
  };

  const updateService = (id: string, updates: Partial<ServiceItem>) => {
    setServicesList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteService = (id: string) => {
    setServicesList((prev) => prev.filter((s) => s.id !== id));
  };

  // Resources Articles CRUD
  const addArticle = (articleData: Omit<ResourceArticle, 'id'>) => {
    const newId = 'art-' + Date.now().toString(36);
    const newArticle: ResourceArticle = {
      ...articleData,
      id: newId,
      title: sanitizeText(articleData.title),
      summary: sanitizeText(articleData.summary),
    };
    setResourcesArticles((prev) => [newArticle, ...prev]);
  };

  const updateArticle = (id: string, updates: Partial<ResourceArticle>) => {
    setResourcesArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const deleteArticle = (id: string) => {
    setResourcesArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleChecklistItem = (id: number) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const addChecklistItem = (text: string) => {
    const newId = Date.now();
    setChecklistItems((prev) => [
      ...prev,
      { id: newId, text: sanitizeText(text), checked: false },
    ]);
  };

  const deleteChecklistItem = (id: number) => {
    setChecklistItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Site Settings
  const updateSiteSettings = (updates: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({
      ...prev,
      ...updates,
      ...(updates.brandTitle ? { brandTitle: sanitizeText(updates.brandTitle) } : {}),
      ...(updates.brandSubtitle ? { brandSubtitle: sanitizeText(updates.brandSubtitle) } : {}),
      ...(updates.footerTagline ? { footerTagline: sanitizeText(updates.footerTagline) } : {}),
      ...(updates.contactEmail ? { contactEmail: sanitizeText(updates.contactEmail) } : {}),
      ...(updates.pgpFingerprint ? { pgpFingerprint: sanitizeText(updates.pgpFingerprint) } : {}),
    }));
  };

  // Media Library
  const uploadMedia = (
    name: string,
    dataUrl: string,
    sizeBytes: number,
    category: 'logo' | 'cover' | 'panel' | 'diagram' | 'general' = 'general'
  ) => {
    const cleanName = sanitizeText(name);
    const now = new Date().toISOString();
    const newAsset: MediaAsset = {
      id: 'media-' + Date.now().toString(36),
      name: cleanName,
      title: cleanName,
      dataUrl,
      url: dataUrl,
      category,
      sizeBytes,
      uploadedAt: now.replace('T', ' ').slice(0, 16),
      createdAt: now,
    };
    setMediaLibrary((prev) => [newAsset, ...prev]);
  };

  const deleteMedia = (id: string) => {
    setMediaLibrary((prev) => prev.filter((m) => m.id !== id));
  };

  // Announcement
  const updateAnnouncement = (updates: Partial<SiteAnnouncement>) => {
    setAnnouncement((prev) => ({
      ...prev,
      ...updates,
      ...(updates.headline ? { headline: sanitizeText(updates.headline) } : {}),
      ...(updates.message ? { message: sanitizeText(updates.message) } : {}),
    }));
  };

  // Full Site Backup & Restore
  const exportFullSiteBackupJSON = (): string => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      comics,
      orders,
      comments,
      announcement,
      homeContent,
      servicesList,
      resourcesArticles,
      checklistItems,
      siteSettings,
      mediaLibrary,
    };
    return JSON.stringify(backup, null, 2);
  };

  const importFullSiteBackupJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.homeContent) setHomeContent(data.homeContent);
      if (data.servicesList) setServicesList(data.servicesList);
      if (data.resourcesArticles) setResourcesArticles(data.resourcesArticles);
      if (data.checklistItems) setChecklistItems(data.checklistItems);
      if (data.siteSettings) setSiteSettings(data.siteSettings);
      if (data.comics) setComics(data.comics);
      if (data.orders) setOrders(data.orders);
      if (data.comments) setComments(data.comments);
      if (data.announcement) setAnnouncement(data.announcement);
      if (data.mediaLibrary) setMediaLibrary(data.mediaLibrary);
      return true;
    } catch (e) {
      console.error('Backup import error', e);
      return false;
    }
  };

  // Reset helper
  const resetAllContent = () => {
    setComics(INITIAL_COMICS);
    setOrders(INITIAL_ORDERS);
    setComments(INITIAL_COMMENTS);
    setAnnouncement(INITIAL_ANNOUNCEMENT);
    setHomeContent(INITIAL_HOME_CONTENT);
    setServicesList(INITIAL_SERVICES);
    setResourcesArticles(INITIAL_ARTICLES);
    setChecklistItems(INITIAL_CHECKLIST);
    setSiteSettings(INITIAL_SETTINGS);
    setMediaLibrary(INITIAL_MEDIA);

    Object.values(STORAGE_KEYS).forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch (err) {
        console.warn('Storage clear error:', err);
      }
    });
  };

  const resetHomeContent = () => setHomeContent(INITIAL_HOME_CONTENT);
  const resetServices = () => setServicesList(INITIAL_SERVICES);
  const resetArticles = () => setResourcesArticles(INITIAL_ARTICLES);
  const resetChecklist = () => setChecklistItems(INITIAL_CHECKLIST);
  const resetSiteSettings = () => setSiteSettings(INITIAL_SETTINGS);

  const addMediaAsset = (asset: {
    title: string;
    url: string;
    category?: 'logo' | 'cover' | 'panel' | 'diagram' | 'general';
    sizeBytes: number;
  }) => {
    uploadMedia(asset.title, asset.url, asset.sizeBytes, asset.category || 'general');
  };

  return (
    <ContentContext.Provider
      value={{
        comics,
        orders,
        comments,
        announcement,
        homeContent,
        servicesList,
        resourcesArticles,
        checklistItems,
        siteSettings,
        mediaLibrary,
        mediaAssets: mediaLibrary,
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
        updateHomeContent,
        resetHomeContent,
        addService,
        updateService,
        deleteService,
        resetServices,
        addArticle,
        updateArticle,
        deleteArticle,
        resetArticles,
        toggleChecklistItem,
        addChecklistItem,
        deleteChecklistItem,
        resetChecklist,
        updateSiteSettings,
        resetSiteSettings,
        uploadMedia,
        deleteMedia,
        addMediaAsset,
        deleteMediaAsset: deleteMedia,
        updateAnnouncement,
        exportFullSiteBackupJSON,
        importFullSiteBackupJSON,
        exportAllContentJson: exportFullSiteBackupJSON,
        importAllContentJson: importFullSiteBackupJSON,
        resetAllContent,
        resetAllToFactoryDefaults: resetAllContent,
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
