import api from '../api';
import { Product } from '../types'; 

export const fetchHomeGroups = async (): Promise<Product[]> => {
  try {
    const response = await api.get('/combined/groups-with-products');
    return response.data;
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
};