import { useState, useEffect } from 'react';
import LessonTracker from '../components/LessonTracker';
import Statistics from '../components/Statistics';
import { FaArrowLeft, FaChartLine, FaClipboardList } from 'react-icons/fa';

const RECORDS_KEY = 'records_Turkce';
const TODAY_SOLVED_KEY = 'todaySolved_Turkce';
const TODAY_KEY = 'today_Turkce';

function TurkcePart({ onBack, records: _records, onDataUpdate: _onDataUpdate }) {
  const [activeTab, setActiveTab] = useState('tracker');
  const [records, setRecords] = useState([]);
  const [showRecords, setShowRecords] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [todaySolved, setTodaySolved] = useState(0);
  const [today, setToday] = useState(new Date().toLocaleDateString('tr-TR'));

  // İlk açılışta localStorage'dan oku
  useEffect(() => {
    const savedRecords = JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]');
    setRecords(savedRecords);
    
    const currentDate = new Date().toLocaleDateString('tr-TR');
    const savedToday = localStorage.getItem(TODAY_KEY) || currentDate;
    setToday(savedToday);
    
    // Bugün çözülen soru sayısını kontrol et
    if (savedToday === currentDate) {
      const savedTodaySolved = localStorage.getItem(TODAY_SOLVED_KEY);
      const parsedTodaySolved = parseInt(savedTodaySolved) || 0;
      setTodaySolved(parsedTodaySolved);
      console.log('Bugün çözülen soru sayısı yüklendi:', parsedTodaySolved);
    } else {
      setTodaySolved(0);
      console.log('Yeni gün, sayaç sıfırlandı');
    }
  }, []);



  // Gün değişirse sayaç sıfırlansın
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleDateString('tr-TR');
      if (now !== today) {
        console.log('Gün değişti, sayaç sıfırlanıyor');
        setToday(now);
        setTodaySolved(0);
        localStorage.setItem(TODAY_SOLVED_KEY, '0');
        localStorage.setItem(TODAY_KEY, now);
      }
    }, 60000); // Her dakika kontrol et
    return () => clearInterval(interval);
  }, [today]);

  // LessonTracker'dan çözdüm tıklanınca çağrılacak fonksiyon
  const handleSolved = () => {
    setTodaySolved(prev => {
      const newCount = prev + 1;
      // localStorage'a hemen yaz
      localStorage.setItem(TODAY_SOLVED_KEY, newCount.toString());
      localStorage.setItem(TODAY_KEY, new Date().toLocaleDateString('tr-TR'));
      console.log('Soru çözüldü, yeni sayı:', newCount);
      return newCount;
    });
  };

  // Kayıt ekleme
  const handleDataUpdate = (lessonName, newData) => {
    if (Array.isArray(newData)) {
      setRecords(newData);
      localStorage.setItem(RECORDS_KEY, JSON.stringify(newData));
    } else {
      setRecords(prev => {
        const updated = [...prev, newData];
        localStorage.setItem(RECORDS_KEY, JSON.stringify(updated));
        return updated;
      });
    }
    if (_onDataUpdate) _onDataUpdate(lessonName, newData);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 sm:mb-8 flex items-center text-pink-600 hover:text-pink-800 font-semibold text-base sm:text-lg hover:scale-105 transition-transform"
      >
        <FaArrowLeft className="mr-2" /> Ders Seç
      </button>
      <div className="flex flex-col sm:flex-row justify-center mb-6 sm:mb-8 gap-3 sm:gap-4">
        <button
          className={`flex items-center gap-2 justify-center text-base px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === 'tracker' 
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:scale-105' 
              : 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 hover:from-pink-200 hover:to-rose-200 hover:scale-105'
          }`}
          onClick={() => { setActiveTab('tracker'); setShowRecords(false); setShowStats(false); }}
        >
          <span className="text-sm sm:text-base">Türkçe</span>
        </button>
        <button
          className={`flex items-center gap-2 justify-center text-base px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === 'stats' 
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:scale-105' 
              : 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 hover:from-pink-200 hover:to-rose-200 hover:scale-105'
          }`}
          onClick={() => { setActiveTab('stats'); setShowStats(true); setShowRecords(false); }}
        >
          <FaChartLine className="text-base" /> 
          <span className="text-sm sm:text-base">Gelişimim</span>
        </button>
        <button
          className={`flex items-center gap-2 justify-center text-base px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === 'records' 
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:scale-105' 
              : 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 hover:from-pink-200 hover:to-rose-200 hover:scale-105'
          }`}
          onClick={() => { setActiveTab('records'); setShowRecords(true); setShowStats(false); }}
        >
          <FaClipboardList className="text-base" /> 
          <span className="text-sm sm:text-base">Kayıtlarım</span>
        </button>
      </div>
      {activeTab === 'tracker' && (
        <LessonTracker
          lessonName="Türkçe"
          icon={null}
          onDataUpdate={handleDataUpdate}
          records={records}
          onSolved={handleSolved}
        />
      )}
      {activeTab === 'stats' && (
        <Statistics lessonData={{ Türkçe: records }} singleLesson="Türkçe" />
      )}
      {activeTab === 'records' && (
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl shadow-xl p-6 sm:p-8 mt-6 sm:mt-8 border border-pink-200">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Türkçe Kayıtlarım</h2>
          {records && records.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="responsive-table">
                <thead>
                  <tr className="bg-gradient-to-r from-pink-100 to-rose-100">
                    <th className="text-pink-700 font-bold">Tarih</th>
                    <th className="text-pink-700 font-bold">Soru</th>
                    <th className="text-pink-700 font-bold">D</th>
                    <th className="text-pink-700 font-bold">Y</th>
                    <th className="text-pink-700 font-bold">B</th>
                    <th className="text-pink-700 font-bold">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={index} className="border-b border-pink-100 hover:bg-gradient-to-r from-pink-50 to-rose-50 transition-all duration-300">
                      <td className="text-gray-800">{record.date}</td>
                      <td className="text-gray-800">{record.questionCount}</td>
                      <td className="text-green-500">{record.correct}</td>
                      <td className="text-red-500">{record.incorrect}</td>
                      <td className="text-orange-500">{record.blank}</td>
                      <td className="font-semibold text-gray-800">{record.net}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-pink-600 py-6 text-responsive font-medium">Henüz kayıt yok!</p>
          )}
        </div>
      )}
      {/* Günlük çözülen soru sayısı */}
      <div className="mt-8 sm:mt-12 text-center">
        <div className="inline-block bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-lg sm:text-xl font-bold shadow-lg border border-pink-200 hover:shadow-pink-300 transition-all duration-300">
          Bugün Çözülen Türkçe Soru: {todaySolved}
        </div>
      </div>
    </div>
  );
}

export default TurkcePart; 