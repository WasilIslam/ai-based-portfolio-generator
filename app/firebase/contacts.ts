import { db } from './init';
import { 
  addDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

export interface ContactResponse {
  id: string;
  portfolioId: string;
  userId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: any;
  status: 'sent' | 'read' | 'replied';
  ipAddress?: string;
  userAgent?: string;
}

export const saveContactResponse = async (contactData: Omit<ContactResponse, 'id' | 'createdAt'>) => {
  try {
    const contactResponse = {
      ...contactData,
      createdAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, 'contactResponses'), contactResponse);
    return { ...contactResponse, id: docRef.id };
  } catch (error) {
    console.error('Error saving contact response:', error);
    throw error;
  }
};

export const getContactResponsesByUserId = async (userId: string) => {
  try {
    const responsesRef = collection(db, 'contactResponses');
    const q = query(
      responsesRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ContactResponse[];
  } catch (error) {
    console.error('Error getting contact responses by user ID:', error);
    throw error;
  }
}; 