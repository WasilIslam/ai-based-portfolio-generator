import { db } from './init';
import { 
  addDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  portfolioId: string;
  userId?: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: any;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    responseTime?: number;
  };
}

export interface ChatSession {
  id: string;
  portfolioId: string;
  userId?: string;
  sessionId: string;
  startedAt: any;
  lastActivity: any;
  messageCount: number;
  isActive: boolean;
}

export const saveChatMessage = async (messageData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
  try {
    const chatMessage = {
      ...messageData,
      timestamp: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, 'chatMessages'), chatMessage);
    return { ...chatMessage, id: docRef.id };
  } catch (error) {
    console.error('Error saving chat message:', error);
    throw error;
  }
};

export const getChatSession = async (sessionId: string) => {
  try {
    const sessionsRef = collection(db, 'chatSessions');
    const q = query(sessionsRef, where('sessionId', '==', sessionId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      } as ChatSession;
    }
    return null;
  } catch (error) {
    console.error('Error getting chat session:', error);
    throw error;
  }
};

export const createChatSession = async (sessionData: Omit<ChatSession, 'id' | 'startedAt' | 'lastActivity'>) => {
  try {
    const chatSession = {
      ...sessionData,
      startedAt: serverTimestamp(),
      lastActivity: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, 'chatSessions'), chatSession);
    return { ...chatSession, id: docRef.id };
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
};

export const updateChatSession = async (sessionId: string, updates: Partial<ChatSession>) => {
  try {
    const sessionsRef = collection(db, 'chatSessions');
    const q = query(sessionsRef, where('sessionId', '==', sessionId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        ...updates,
        lastActivity: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error updating chat session:', error);
    throw error;
  }
};

export const getChatMessagesBySession = async (sessionId: string) => {
  try {
    const messagesRef = collection(db, 'chatMessages');
    const q = query(
      messagesRef, 
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[];
  } catch (error) {
    console.error('Error getting chat messages:', error);
    throw error;
  }
};

export const getChatMessagesByUserId = async (userId: string, limit = 50) => {
  try {
    const messagesRef = collection(db, 'chatMessages');
    const q = query(
      messagesRef, 
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.slice(0, limit).map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[];
  } catch (error) {
    console.error('Error getting chat messages by user ID:', error);
    throw error;
  }
};

export const getActiveChatSessionsByUserId = async (userId: string) => {
  try {
    const sessionsRef = collection(db, 'chatSessions');
    const q = query(
      sessionsRef, 
      where('userId', '==', userId),
      where('isActive', '==', true),
      orderBy('lastActivity', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatSession[];
  } catch (error) {
    console.error('Error getting active chat sessions by user ID:', error);
    throw error;
  }
}; 