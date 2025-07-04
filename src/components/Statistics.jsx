import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { FaTrophy, FaChartLine, FaStar } from 'react-icons/fa'

function Statistics({ lessonData, singleLesson }) {
  // lessonData: { Türkçe: [...], ... } veya { Matematik: [...] }
  // singleLesson: 'Türkçe' gibi bir string veya undefined

  if (!lessonData || Object.keys(lessonData).length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-500">
        Veri bulunamadı.
      </div>
    )
  }

  const prepareChartData = (data, lessonName) => {
    return data.map(record => ({
      date: format(new Date(record.date), 'd MMM', { locale: tr }),
      net: parseFloat(record.net),
      lesson: lessonName,
      performanceScore: (parseFloat(record.net) / parseFloat(record.questionCount)) * 100
    }))
  }

  // Tek ders için lessonData geldiyse, allData ve averages ona göre hazırlanmalı
  let allData = []
  let averages = {}
  if (singleLesson && lessonData[singleLesson]) {
    allData = prepareChartData(lessonData[singleLesson], singleLesson)
    if (lessonData[singleLesson].length > 0) {
      const netSum = lessonData[singleLesson].reduce((sum, record) => sum + parseFloat(record.net), 0)
      const performanceSum = lessonData[singleLesson].reduce(
        (sum, record) =>
          sum + (parseFloat(record.net) / parseFloat(record.questionCount)) * 100,
        0
      )
      averages[singleLesson] = {
        netAvg: (netSum / lessonData[singleLesson].length).toFixed(2),
        performanceAvg: (performanceSum / lessonData[singleLesson].length).toFixed(2)
      }
    }
  } else {
    // Genel veya çoklu ders için
    allData = Object.entries(lessonData).flatMap(([lesson, data]) => prepareChartData(data, lesson))
    Object.entries(lessonData).forEach(([lesson, data]) => {
      if (data.length > 0) {
        const netSum = data.reduce((sum, record) => sum + parseFloat(record.net), 0)
        const performanceSum = data.reduce(
          (sum, record) =>
            sum + (parseFloat(record.net) / parseFloat(record.questionCount)) * 100,
          0
        )
        averages[lesson] = {
          netAvg: (netSum / data.length).toFixed(2),
          performanceAvg: (performanceSum / data.length).toFixed(2)
        }
      }
    })
  }

  const getMotivationalMessage = (percentage) => {
    if (percentage >= 90) return '🌟 Muhteşem bir performans!'
    if (percentage >= 70) return '🎉 Harika gidiyorsun!'
    if (percentage >= 50) return '💪 İyi yoldasın!'
    if (percentage >= 30) return '📚 Gelişme gösteriyorsun!'
    return '🎯 Her gün biraz daha ileriye!'
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text mb-2">
          Gelişim Grafiğin 📈
        </h2>
        <p className="text-gray-600">İşte çalışmalarının sonuçları!</p>
      </div>

      <div className={`grid grid-cols-1 ${Object.keys(averages).length > 1 ? 'md:grid-cols-3' : ''} gap-6 mb-12`}>
        {Object.entries(averages).map(([lesson, stats], index) => (
          <motion.div
            key={lesson}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.2 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-purple-700">{lesson}</h3>
              <FaTrophy className={`text-2xl ${
                parseFloat(stats.performanceAvg) >= 70 ? 'text-yellow-400' : 'text-gray-400'
              }`} />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600">Ortalama Net</p>
                <p className="text-2xl font-bold text-purple-600">{stats.netAvg}</p>
              </div>
              <div>
                <p className="text-gray-600">Başarı Oranı</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-pink-500">{stats.performanceAvg}%</p>
                  <FaStar className="ml-2 text-yellow-400" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {getMotivationalMessage(parseFloat(stats.performanceAvg))}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-8">
        <div className="flex items-center mb-4">
          <FaChartLine className="text-purple-500 text-2xl mr-2" />
          <h3 className="text-xl font-bold text-purple-700">Net Gelişim Grafiği</h3>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={allData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                stroke="#718096"
                tick={{ fill: '#718096' }}
              />
              <YAxis
                stroke="#718096"
                tick={{ fill: '#718096' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px'
                }}
              />
              <Legend />
              {Object.keys(lessonData).map((lesson, idx) => (
                <Line
                  key={lesson}
                  type="monotone"
                  dataKey="net"
                  data={prepareChartData(lessonData[lesson], lesson)}
                  name={lesson}
                  stroke={['#EC4899', '#8B5CF6', '#3B82F6', '#10B981'][idx % 4]}
                  strokeWidth={3}
                  dot={{ fill: ['#EC4899', '#8B5CF6', '#3B82F6', '#10B981'][idx % 4], r: 6 }}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {Object.values(averages).length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            Henüz hiç veri yok! Hadi çalışmaya başla ve gelişimini takip et! 💪
          </p>
        </div>
      )}
    </motion.div>
  )
}

export default Statistics 