import React, {createContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextProps {
  isAuthenticated: boolean;
  signIn: (token: string) => Promise<void>; // Chuyển thành Promise để xử lý bất đồng bộ tốt hơn
  signOut: () => Promise<void>; // Chuyển thành Promise
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  signIn: async () => {},
  signOut: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to load token', error);
      }
    };
    checkAuth();
  }, []);

  const signIn = async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem('accessToken', token);
      setIsAuthenticated(true);
      console.log('Token đã được lưu:', token); // Thêm log để kiểm tra
    } catch (error) {
      console.error('Failed to save token', error);
      throw error; // Throw để xử lý lỗi nếu cần
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('accessToken');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Failed to remove token', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{isAuthenticated, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};
