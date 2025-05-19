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

// Doktorun hasta listesini getir (mock)
export const getHealthcarePatients = async (doctorId: string) => {
  // Gerçek uygulamada Firestore'dan çekilecek
  // Şimdilik örnek veri
  return [
    { patientId: '1', patientName: 'Ahmet Yılmaz', patientEmail: 'ahmet@example.com' },
    { patientId: '2', patientName: 'Ayşe Demir', patientEmail: 'ayse@example.com' },
  ];
};

// Doktorun hasta listesinden hastayı sil (mock)
export const removePatientFromHealthcare = async (doctorId: string, patientEmail: string) => {
  // Gerçek uygulamada Firestore'dan silinecek
  return true;
};

// Hastanın istatistiklerini getir (mock)
export const getPatientStats = async (patientId: string) => {
  // Gerçek uygulamada Firestore'dan çekilecek
  return {
    glucose: [
      { value: 120 },
      { value: 110 },
      { value: 130 },
    ],
    insulin: [
      { value: 8 },
      { value: 10 },
    ],
    meals: [
      { name: 'Kahvaltı' },
      { name: 'Öğle Yemeği' },
    ],
  };
}; 