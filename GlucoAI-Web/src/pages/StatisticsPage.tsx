import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Chart.js kayıt işlemi
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    averageGlucose: '0',
    averageInsulin: '0',
    mealCount: '0',
  });
  const [glucoseData, setGlucoseData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.error('Kullanıcı oturumu bulunamadı');
        return;
      }

      // Son 7 günün başlangıç tarihini hesapla
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      // Kan şekeri verilerini çek
      const glucoseRef = collection(db, 'glucose');
      const glucoseQuery = query(
        glucoseRef,
        where('userId', '==', userId)
      );

      const glucoseSnapshot = await getDocs(glucoseQuery);
      
      // Kan şekeri ortalamasını hesapla
      let totalGlucose = 0;
      let glucoseCount = 0;
      const glucoseChartData: { date: Date; level: number }[] = [];

      glucoseSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.timestamp && typeof data.timestamp.toDate === 'function') {
          const measurementDate = data.timestamp.toDate();
          if (measurementDate >= startDate && measurementDate <= endDate) {
            totalGlucose += data.level;
            glucoseCount++;
            glucoseChartData.push({
              date: measurementDate,
              level: data.level
            });
          }
        }
      });

      // İnsülin verilerini çek
      const insulinRef = collection(db, 'insulin');
      const insulinQuery = query(
        insulinRef,
        where('userId', '==', userId)
      );

      const insulinSnapshot = await getDocs(insulinQuery);
      
      // İnsülin ortalamasını hesapla
      let totalInsulin = 0;
      let insulinCount = 0;

      insulinSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.timestamp && typeof data.timestamp.toDate === 'function') {
          const measurementDate = data.timestamp.toDate();
          if (measurementDate >= startDate && measurementDate <= endDate) {
            totalInsulin += data.amount;
            insulinCount++;
          }
        }
      });

      // Öğün verilerini çek
      const mealsRef = collection(db, 'meals');
      const mealsQuery = query(
        mealsRef,
        where('userId', '==', userId)
      );

      const mealsSnapshot = await getDocs(mealsQuery);
      
      // Son 7 günlük öğün sayısını hesapla
      let totalMeals = 0;

      mealsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.timestamp && typeof data.timestamp.toDate === 'function') {
          const mealDate = data.timestamp.toDate();
          if (mealDate >= startDate && mealDate <= endDate) {
            totalMeals++;
          }
        }
      });

      const averageGlucose = glucoseCount > 0 
        ? Math.round(totalGlucose / glucoseCount) 
        : 0;

      const averageInsulin = insulinCount > 0
        ? Math.round((totalInsulin / insulinCount) * 10) / 10
        : 0;

      setStats({
        averageGlucose: averageGlucose.toString(),
        averageInsulin: averageInsulin.toString(),
        mealCount: totalMeals.toString()
      });

      // Grafik verisini hazırla
      if (glucoseChartData.length > 0) {
        // Tarihe göre sırala
        glucoseChartData.sort((a, b) => a.date.getTime() - b.date.getTime());
        
        const labels = glucoseChartData.map(item => 
          item.date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })
        );
        
        const data = glucoseChartData.map(item => item.level);
        
        setGlucoseData({
          labels,
          datasets: [
            {
              label: 'Kan Şekeri (mg/dL)',
              data,
              borderColor: '#2196F3',
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              tension: 0.3,
            },
          ],
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600">İstatistikler yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">İstatistikler</h1>
      <p className="text-gray-600 mb-6">Son 7 günlük verileriniz</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl font-bold text-primary mb-2">{stats.averageGlucose}</div>
          <div className="text-gray-700">Ortalama Kan Şekeri</div>
          <div className="text-gray-500 text-sm">mg/dL</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl font-bold text-primary mb-2">{stats.averageInsulin}</div>
          <div className="text-gray-700">Ortalama İnsülin</div>
          <div className="text-gray-500 text-sm">ünite/gün</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl font-bold text-primary mb-2">{stats.mealCount}</div>
          <div className="text-gray-700">Toplam Öğün</div>
          <div className="text-gray-500 text-sm">öğün/hafta</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Kan Şekeri Değişimi</h2>
        {glucoseData.labels.length > 0 ? (
          <div className="h-64">
            <Line
              data={glucoseData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: false,
                    title: {
                      display: true,
                      text: 'mg/dL'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Tarih'
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                  },
                },
              }}
            />
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            Görüntülenecek kan şekeri verisi bulunmuyor
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsPage; 