import { UserType } from '../navigation/types';

interface UserData {
  email: string;
  name: string;
  surname: string;
  userType: UserType;
}

// Mock kullanıcı veritabanı
const mockUsers: { [key: string]: UserData } = {};

export const registerUser = async (
  email: string,
  password: string,
  userData: Omit<UserData, 'email'>
) => {
  try {
    // Email kullanımda mı kontrol et
    if (mockUsers[email]) {
      throw new Error('Bu email adresi zaten kullanımda');
    }

    // Yeni kullanıcı oluştur
    const newUser = {
      email,
      ...userData,
    };

    // Mock veritabanına kaydet
    mockUsers[email] = newUser;

    return { email };
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    // Kullanıcı var mı kontrol et
    const user = mockUsers[email];
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    // Gerçek uygulamada şifre kontrolü yapılır
    return { email };
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    // Mock logout işlemi
    return true;
  } catch (error) {
    throw error;
  }
}; 