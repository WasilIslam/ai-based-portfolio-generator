import { db } from './init';
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  where,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

export interface Portfolio {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  portfolioId: string;
  data: any;
  createdAt: any;
  updatedAt: any;
}

export const createPortfolio = async (userId: string, userEmail: string, userName: string, portfolioId: string, data: any) => {
  try {
    const portfolioRef = doc(db, 'portfolios', userId);
    const portfolio: Portfolio = {
      id: userId,
      userId,
      userEmail,
      userName,
      portfolioId,
      data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(portfolioRef, portfolio);
    return portfolio;
  } catch (error) {
    console.error('Error creating portfolio:', error);
    throw error;
  }
};

export const getPortfolioByUserId = async (userId: string) => {
  try {
    const portfolioRef = doc(db, 'portfolios', userId);
    const portfolioSnap = await getDoc(portfolioRef);
    
    if (portfolioSnap.exists()) {
      return portfolioSnap.data() as Portfolio;
    }
    return null;
  } catch (error) {
    console.error('Error getting portfolio:', error);
    throw error;
  }
};

export const getPortfolioByPortfolioId = async (portfolioId: string) => {
  try {
    const portfoliosRef = collection(db, 'portfolios');
    const q = query(portfoliosRef, where('portfolioId', '==', portfolioId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as Portfolio;
    }
    return null;
  } catch (error) {
    console.error('Error getting portfolio by ID:', error);
    throw error;
  }
};

export const checkPortfolioIdAvailability = async (portfolioId: string) => {
  try {
    const portfolio = await getPortfolioByPortfolioId(portfolioId);
    return !portfolio;
  } catch (error) {
    console.error('Error checking portfolio ID availability:', error);
    throw error;
  }
};

export const updatePortfolio = async (userId: string, data: any) => {
  try {
    const portfolioRef = doc(db, 'portfolios', userId);
    await updateDoc(portfolioRef, {
      data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating portfolio:', error);
    throw error;
  }
}; 