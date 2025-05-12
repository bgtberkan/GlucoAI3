import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '../App';
import { getGlucoseRecords, getInsulinRecords, analyzeGlucose, getTotalCarbs, getMealRecords } from '../services/firebase';

interface StatsScreenProps {
  onNavigate: (screen: string) => void;
  user: User | null;
}

export default function StatsScreen({ onNavigate, user }: StatsScreenProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'twoWeeks'>('twoWeeks');
  
  // İstatistik verileri
  const [twoWeekStats, setTwoWeekStats] = useState({
    avgGlucose: 0,
    avgInsulin: 0,
    avgCarbs: 0,
    measurementCount: 0
  });
  
  const [todayStats, setTodayStats] = useState({
    avgGlucose: 0,
    totalInsulin: 0,
    totalCarbs: 0,
    measurementCount: 0
  });
  
  // Grafik verilerini tutacak state'ler
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    glucose: [] as number[],
    insulin: [] as number[],
    meals: [] as {time: string, type: string}[]
  });

  // Seçilen veri noktası için state ekleyelim
  const [selectedPoint, setSelectedPoint] = useState<{
    value: number;
    date: string;
    index: number;
    type: 'glucose' | 'insulin';
  } | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Son 2 haftalık verileri alma
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        
        // Son 1 haftalık veriler için
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        // Bugünkü verileri alma
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Seçilen periyoda göre başlangıç tarihi belirleme
        let startDate;
        if (selectedPeriod === 'day') {
          startDate = today;
        } else if (selectedPeriod === 'week') {
          startDate = oneWeekAgo;
        } else {
          startDate = twoWeeksAgo;
        }
        
        // Kan şekeri analizini al
        const glucoseAnalysis = await analyzeGlucose(user.id);
        
        // Son 2 haftalık kan şekeri kayıtları
        const twoWeekGlucoseRecords = await getGlucoseRecords(user.id, {
          startDate: twoWeeksAgo
        });
        
        // Son 2 haftalık insülin kayıtları
        const twoWeekInsulinRecords = await getInsulinRecords(user.id, {
          startDate: twoWeeksAgo
        });
        
        // Bugünkü kan şekeri kayıtları
        const todayGlucoseRecords = await getGlucoseRecords(user.id, {
          startDate: today
        });
        
        // Bugünkü insülin kayıtları
        const todayInsulinRecords = await getInsulinRecords(user.id, {
          startDate: today
        });
        
        // Son 2 haftalık karbonhidrat toplamı
        const twoWeekTotalCarbs = await getTotalCarbs(user.id, {
          startDate: twoWeeksAgo
        });
        
        // Bugünkü karbonhidrat toplamı
        const todayTotalCarbs = await getTotalCarbs(user.id, {
          startDate: today
        });
        
        // İstatistikleri hesapla
        // Son 2 haftalık istatistikler
        const twoWeekGlucoseValues = twoWeekGlucoseRecords.map(record => (record as any).value as number);
        const twoWeekInsulinValues = twoWeekInsulinRecords.map(record => (record as any).value as number);
        
        const twoWeekAvgGlucose = twoWeekGlucoseValues.length > 0 
          ? twoWeekGlucoseValues.reduce((sum, val) => sum + val, 0) / twoWeekGlucoseValues.length 
          : 0;
          
        const twoWeekTotalInsulin = twoWeekInsulinValues.length > 0 
          ? twoWeekInsulinValues.reduce((sum, val) => sum + val, 0) 
          : 0;
          
        // İnsülin günlük ortalaması
        const twoWeekAvgInsulin = twoWeekInsulinValues.length > 0 
          ? twoWeekTotalInsulin / twoWeekInsulinValues.length 
          : 0;
          
        // Karbonhidrat günlük ortalaması - varsayılan olarak veri sayısı olarak kan şekeri ölçüm sayısını kullanıyoruz
        // Daha doğru hesap için meal_records sayısını kullanabiliriz
        const twoWeekAvgCarbs = twoWeekGlucoseValues.length > 0 
          ? twoWeekTotalCarbs / twoWeekGlucoseValues.length 
          : 0;
        
        // Bugünkü istatistikler
        const todayGlucoseValues = todayGlucoseRecords.map(record => (record as any).value as number);
        const todayInsulinValues = todayInsulinRecords.map(record => (record as any).value as number);
        
        const todayAvgGlucose = todayGlucoseValues.length > 0 
          ? todayGlucoseValues.reduce((sum, val) => sum + val, 0) / todayGlucoseValues.length 
          : 0;
          
        const todayTotalInsulin = todayInsulinValues.length > 0 
          ? todayInsulinValues.reduce((sum, val) => sum + val, 0) 
          : 0;
          
        // İnsülin günlük ortalaması
        const todayAvgInsulin = todayInsulinValues.length > 0 
          ? todayTotalInsulin / todayInsulinValues.length 
          : 0;
          
        // Karbonhidrat günlük ortalaması
        const todayAvgCarbs = todayGlucoseValues.length > 0 
          ? todayTotalCarbs / todayGlucoseValues.length 
          : 0;
        
        // State'i güncelle
        setTwoWeekStats({
          avgGlucose: Math.round(twoWeekAvgGlucose),
          avgInsulin: Math.round(twoWeekAvgInsulin),
          avgCarbs: Math.round(twoWeekAvgCarbs),
          measurementCount: twoWeekGlucoseValues.length
        });
        
        // Bugünkü toplam kan şekeri değeri
        const todayTotalGlucose = todayGlucoseValues.length > 0 
          ? todayGlucoseValues.reduce((sum, val) => sum + val, 0) 
          : 0;
        
        setTodayStats({
          avgGlucose: Math.round(todayAvgGlucose),
          totalInsulin: Math.round(todayTotalInsulin),
          totalCarbs: Math.round(todayTotalCarbs),
          measurementCount: todayGlucoseValues.length
        });
        
        // Grafik verileri için kayıtları al
        const glucoseRecords = await getGlucoseRecords(user.id, {
          startDate: startDate
        });
        
        const insulinRecords = await getInsulinRecords(user.id, {
          startDate: startDate
        });
        
        const mealRecords = await getMealRecords(user.id, {
          startDate: startDate
        });
        
        // Grafik verilerini hazırla
        const prepareChartData = () => {
          // Tarihlere göre sıralama fonksiyonu
          const sortByDate = (a: any, b: any) => {
            return new Date(a.measurementTime).getTime() - new Date(b.measurementTime).getTime();
          };
          
          // Verileri tarihe göre sırala
          const sortedGlucose = [...glucoseRecords].sort(sortByDate);
          const sortedInsulin = [...insulinRecords].sort(sortByDate);
          const sortedMeals = [...mealRecords].sort(sortByDate);
          
          // Tarih etiketlerini oluştur
          const dateLabels = sortedGlucose.map(record => {
            const date = new Date((record as any).measurementTime);
            // Periyoda göre farklı formatlarda göster
            if (selectedPeriod === 'day') {
              return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
            } else {
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }
          });
          
          // Kan şekeri değerlerini al
          const glucoseValues = sortedGlucose.map(record => (record as any).value as number);
          
          // İnsülin değerlerini al
          const insulinValues = sortedInsulin.map(record => (record as any).value as number);
          
          // Öğün bilgilerini al
          const meals = sortedMeals.map(meal => ({
            time: new Date((meal as any).measurementTime).toLocaleTimeString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            type: (meal as any).mealType as string
          }));
          
          setChartData({
            labels: dateLabels,
            glucose: glucoseValues,
            insulin: insulinValues,
            meals: meals
          });
        };
        
        prepareChartData();
        
      } catch (err: any) {
        console.error('İstatistik verileri yüklenirken hata:', err);
        setError('Veriler yüklenirken bir hata oluştu: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user?.id, selectedPeriod]); // selectedPeriod değiştiğinde verileri yeniden yükle

  // Basit grafik verilerini göstermek için bir fonksiyon
  const renderDataPoints = (data: number[], color: string, type: 'glucose' | 'insulin') => {
    if (!data || data.length === 0) return null;
    
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    const containerWidth = Dimensions.get('window').width - 80;
    const containerHeight = 180;
    
    return (
      <View style={styles.simpleChartContainer}>
        {data.map((value, index) => {
          // X pozisyonu, veri noktasının konumu
          const xPos = (index / (data.length - 1)) * containerWidth;
          // Y pozisyonu, veri değerine göre (tersine, yukarı doğru)
          const yPos = containerHeight - ((value - minValue) / (range || 1)) * containerHeight;
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dataPointTouchable,
                { 
                  left: xPos, 
                  top: yPos
                }
              ]}
              onPress={() => setSelectedPoint({
                value,
                date: chartData.labels[index] || '',
                index,
                type
              })}
            >
              <View 
                style={[
                  styles.dataPoint, 
                  { 
                    backgroundColor: color,
                  }
                ]} 
              />
            </TouchableOpacity>
          );
        })}
        
        {/* X ve Y eksenleri çizgileri */}
        <View style={styles.xAxis} />
        <View style={styles.yAxis} />
        
        {/* Veri değerlerini bağlayan çizgiler */}
        {data.map((value, index) => {
          if (index === 0) return null;
          
          const prevXPos = ((index - 1) / (data.length - 1)) * containerWidth;
          const prevYPos = containerHeight - ((data[index - 1] - minValue) / (range || 1)) * containerHeight;
          const xPos = (index / (data.length - 1)) * containerWidth;
          const yPos = containerHeight - ((value - minValue) / (range || 1)) * containerHeight;
          
          // İki nokta arasındaki açıyı hesapla
          const angle = Math.atan2(yPos - prevYPos, xPos - prevXPos) * 180 / Math.PI;
          // İki nokta arasındaki uzaklığı hesapla
          const length = Math.sqrt(Math.pow(xPos - prevXPos, 2) + Math.pow(yPos - prevYPos, 2));
          
          return (
            <View 
              key={`line-${index}`} 
              style={[
                styles.dataLine, 
                { 
                  backgroundColor: color,
                  width: length,
                  left: prevXPos,
                  top: prevYPos,
                  transform: [{ rotate: `${angle}deg` }],
                  // Çizgi dönüşü için origin ayarı
                  transformOrigin: '0 0'
                }
              ]} 
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>İstatistikler</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E88E5" />
            <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <>
            {/* Son 2 Haftalık İstatistikler Paneli */}
            <View style={styles.panel}>
              <Text style={styles.panelTitle}>Son 2 Haftalık İstatistikler</Text>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{twoWeekStats.avgGlucose}</Text>
                  <Text style={styles.statLabel}>Ort. Kan Şekeri</Text>
                  <Text style={styles.statUnit}>mg/dL</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{twoWeekStats.avgInsulin}</Text>
                  <Text style={styles.statLabel}>Ort. İnsülin</Text>
                  <Text style={styles.statUnit}>ünite</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{twoWeekStats.avgCarbs}</Text>
                  <Text style={styles.statLabel}>Ort. Karbonhidrat</Text>
                  <Text style={styles.statUnit}>g</Text>
                </View>
              </View>
              
              <Text style={styles.measurementCount}>
                {twoWeekStats.measurementCount} ölçüm kaydı
              </Text>
            </View>
            
            {/* Bugünkü İstatistikler Paneli */}
            <View style={styles.panel}>
              <Text style={styles.panelTitle}>Bugünkü İstatistikler</Text>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{todayStats.avgGlucose}</Text>
                  <Text style={styles.statLabel}>Ort. Kan Şekeri</Text>
                  <Text style={styles.statUnit}>mg/dL</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{todayStats.totalInsulin}</Text>
                  <Text style={styles.statLabel}>Toplam İnsülin</Text>
                  <Text style={styles.statUnit}>ünite</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{todayStats.totalCarbs}</Text>
                  <Text style={styles.statLabel}>Toplam Karbonhidrat</Text>
                  <Text style={styles.statUnit}>g</Text>
                </View>
              </View>
              
              <Text style={styles.measurementCount}>
                {todayStats.measurementCount} ölçüm kaydı
              </Text>
            </View>
            
            {/* Periyot Seçici */}
            <View style={styles.periodSelector}>
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  selectedPeriod === 'day' && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod('day')}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === 'day' && styles.periodButtonTextActive
                ]}>Günlük</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  selectedPeriod === 'week' && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod('week')}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === 'week' && styles.periodButtonTextActive
                ]}>1 Hafta</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  selectedPeriod === 'twoWeeks' && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod('twoWeeks')}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === 'twoWeeks' && styles.periodButtonTextActive
                ]}>2 Hafta</Text>
              </TouchableOpacity>
            </View>
            
            {/* Grafik */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Kan Şekeri Grafiği</Text>
              {chartData.glucose.length > 0 ? (
                <View>
                  {renderDataPoints(chartData.glucose, '#1E88E5', 'glucose')}
                  <View style={styles.chartLabelsContainer}>
                    {chartData.labels.map((label, index) => (
                      <Text key={index} style={styles.chartLabel}>
                        {label}
                      </Text>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>Bu dönem için veri bulunamadı</Text>
                </View>
              )}
            </View>
            
            {/* İnsülin Grafiği */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>İnsülin Grafiği</Text>
              {chartData.insulin.length > 0 ? (
                <View>
                  {renderDataPoints(chartData.insulin, '#4CAF50', 'insulin')}
                  <View style={styles.chartLabelsContainer}>
                    {chartData.labels.map((label, index) => (
                      <Text key={index} style={styles.chartLabel}>
                        {label}
                      </Text>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>Bu dönem için veri bulunamadı</Text>
                </View>
              )}
            </View>
            
            {/* Öğün Listesi */}
            <View style={styles.mealsContainer}>
              <Text style={styles.chartTitle}>Öğünler</Text>
              {chartData.meals.length > 0 ? (
                chartData.meals.map((meal, index) => (
                  <View key={index} style={styles.mealItem}>
                    <Text style={styles.mealTime}>{meal.time}</Text>
                    <Text style={styles.mealType}>
                      {meal.type === 'breakfast' ? 'Kahvaltı' :
                       meal.type === 'lunch' ? 'Öğle Yemeği' :
                       meal.type === 'dinner' ? 'Akşam Yemeği' : 'Ara Öğün'}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>Bu dönem için öğün kaydı bulunamadı</Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Alt tab bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tabButton, styles.tabButtonActive]} 
          onPress={() => onNavigate('stats')}
        >
          <Text style={[styles.tabButtonText, styles.tabButtonTextActive]}>İstatistikler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => onNavigate('home')}
        >
          <Text style={styles.tabButtonText}>Ana Sayfa</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => onNavigate('settings')}
        >
          <Text style={styles.tabButtonText}>Ayarlar</Text>
        </TouchableOpacity>
      </View>

      {/* Veri Noktası Popup */}
      {selectedPoint && (
        <TouchableOpacity 
          style={styles.popupOverlay}
          activeOpacity={1}
          onPress={() => setSelectedPoint(null)}
        >
          <View style={styles.popupContainer}>
            <View style={styles.popup}>
              <Text style={styles.popupTitle}>
                {selectedPoint.type === 'glucose' ? 'Kan Şekeri' : 'İnsülin'} Ölçümü
              </Text>
              <Text style={styles.popupValue}>
                {selectedPoint.value} {selectedPoint.type === 'glucose' ? 'mg/dL' : 'ünite'}
              </Text>
              <Text style={styles.popupDate}>
                {selectedPoint.date}
              </Text>
              <TouchableOpacity 
                style={styles.popupCloseButton}
                onPress={() => setSelectedPoint(null)}
              >
                <Text style={styles.popupCloseButtonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1E88E5',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginVertical: 20,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
  },
  panel: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  statUnit: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  measurementCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  chartPlaceholder: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    marginVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
  },
  chartPlaceholderText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  tabButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  tabButtonText: {
    color: '#1E88E5',
    fontSize: 14,
  },
  tabButtonActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#1E88E5',
  },
  tabButtonTextActive: {
    fontWeight: 'bold',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  periodButtonText: {
    fontSize: 14,
    color: '#333',
  },
  periodButtonTextActive: {
    color: '#1E88E5',
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  mealsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mealTime: {
    fontSize: 14,
    color: '#333',
  },
  mealType: {
    fontSize: 14,
    color: '#1E88E5',
    fontWeight: '500',
  },
  simpleChartContainer: {
    height: 200,
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    position: 'relative',
    padding: 10,
  },
  dataPointTouchable: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 3,
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  dataPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 2,
  },
  dataLine: {
    height: 2,
    position: 'absolute',
    zIndex: 1,
  },
  xAxis: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#ddd',
  },
  yAxis: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 1,
    backgroundColor: '#ddd',
  },
  chartLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 5,
  },
  chartLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popupContainer: {
    width: '80%',
    maxWidth: 300,
    backgroundColor: 'transparent',
  },
  popup: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  popupValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 5,
  },
  popupDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  popupCloseButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  popupCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 