import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheckCircle, FaChartBar, FaTrash, FaStar, FaRegStar } from 'react-icons/fa'

function LessonTracker({ lessonName, icon, onDataUpdate, records = [], onSolved }) {
  const [questionCount, setQuestionCount] = useState('')
  const [correct, setCorrect] = useState('')
  const [incorrect, setIncorrect] = useState('')
  const [blank, setBlank] = useState('')
  const [remainingQuestions, setRemainingQuestions] = useState('')
  const [showResults, setShowResults] = useState(false)

  // localStorage keys
  const REMAINING_QUESTIONS_KEY = `remainingQuestions_${lessonName}`
  const REMAINING_QUESTIONS_DATE_KEY = `remainingQuestionsDate_${lessonName}`

  // İlk açılışta localStorage'dan oku
  useEffect(() => {
    const savedDate = localStorage.getItem(REMAINING_QUESTIONS_DATE_KEY)
    const today = new Date().toLocaleDateString('tr-TR')
    
    if (savedDate === today) {
      const savedRemaining = localStorage.getItem(REMAINING_QUESTIONS_KEY)
      if (savedRemaining) {
        setRemainingQuestions(parseInt(savedRemaining) || 0)
      }
    } else {
      // Gün değişmişse sıfırla
      setRemainingQuestions('')
      localStorage.removeItem(REMAINING_QUESTIONS_KEY)
      localStorage.setItem(REMAINING_QUESTIONS_DATE_KEY, today)
    }
  }, [lessonName])

  const calculateNet = () => {
    const correctNum = parseFloat(correct) || 0
    const incorrectNum = parseFloat(incorrect) || 0
    const net = correctNum - (incorrectNum / 4)
    return net.toFixed(2)
  }

  const getPerformanceLabel = (net) => {
    const totalQuestions = parseFloat(questionCount) || 0
    if (totalQuestions === 0) return ''
    const percentage = (net / totalQuestions) * 100
    
    if (percentage >= 100) return { 
      emoji: '🏅', 
      text: 'LEGENDARY', 
      subtitle: 'Error 404: Artık Rakip Bulunamıyor!',
      color: 'text-yellow-500', 
      stars: 5 
    }
    if (percentage >= 90) return { 
      emoji: '👾', 
      text: 'CHAMPION DARK SOULS', 
      subtitle: 'Final bossunun etrafında geziyorsun',
      color: 'text-purple-500', 
      stars: 4 
    }
    if (percentage >= 70) return { 
      emoji: '⚔️', 
      text: 'ELITE WARRIOR', 
      subtitle: 'Artık zorlu canavarları avlamaya hazırsın. Yoluna devam et',
      color: 'text-blue-500', 
      stars: 3 
    }
    if (percentage >= 50) return { 
      emoji: '⭐', 
      text: 'RISING STAR', 
      subtitle: 'Yeteneklerini geliştir, Yavaş ama emin adımlarla şehrin en iyisi olma yolunda ilerliyorsun',
      color: 'text-green-500', 
      stars: 2 
    }
    if (percentage >= 30) return { 
      emoji: '🌱', 
      text: 'NEWBIE POTENTIAL', 
      subtitle: 'Potansiyel var ama daha çok çalışman gerekiyor. Başlangıç seviyesindesin',
      color: 'text-orange-500', 
      stars: 1 
    }
    return { 
      emoji: '🪵', 
      text: 'SKYRIM ÇAYLAĞI', 
      subtitle: 'O kadar düştünki senden sonrakiler sınava hiç girmeyecek',
      color: 'text-red-500', 
      stars: 0 
    }
  }

  const renderStars = (count) => {
    return [...Array(5)].map((_, index) => (
      index < count ? (
        <FaStar key={index} className="text-yellow-400 inline" />
      ) : (
        <FaRegStar key={index} className="text-gray-300 inline" />
      )
    ))
  }

  const handleSave = () => {
    if (!questionCount || !correct || !incorrect || !blank) {
      alert('Lütfen tüm alanları doldurun! 📝')
      return
    }

    const net = calculateNet()
    const today = new Date().toLocaleDateString('tr-TR')
    const performance = getPerformanceLabel(net)
    const newRecord = {
      date: today,
      questionCount,
      correct,
      incorrect,
      blank,
      net,
      performance: performance.text
    }

    onDataUpdate(lessonName, newRecord)
    setQuestionCount('')
    setCorrect('')
    setIncorrect('')
    setBlank('')
    setShowResults(false)
  }

  const handleSetRemainingQuestions = (count) => {
    setRemainingQuestions(count)
    if (count > 0) {
      localStorage.setItem(REMAINING_QUESTIONS_KEY, count.toString())
      localStorage.setItem(REMAINING_QUESTIONS_DATE_KEY, new Date().toLocaleDateString('tr-TR'))
    }
  }

  const decrementQuestions = () => {
    if (remainingQuestions > 0) {
      const newCount = remainingQuestions - 1
      setRemainingQuestions(newCount)
      localStorage.setItem(REMAINING_QUESTIONS_KEY, newCount.toString())
      if (onSolved) onSolved()
    }
  }

  const handleDeleteRecord = (index) => {
    const newRecords = [...records]
    newRecords.splice(index, 1)
    onDataUpdate(lessonName, newRecords)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="lesson-card max-w-4xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          {icon}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
            {lessonName}
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowResults(!showResults)}
          className="text-purple-500 hover:text-purple-700 transition-colors self-end sm:self-auto"
        >
          <FaChartBar size={20} className="sm:w-6 sm:h-6" />
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="mobile-spacing"
          >
            {/* Sayaç Bölümü */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col items-center mb-2">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-blue-500 mb-2 text-center">Soru Çözme Sayacı</h3>
                <input
                  type="number"
                  placeholder="Kaç soru çözeceksin? 📝"
                  className="input-field bg-blue-100 placeholder:text-blue-400 text-blue-700 w-full sm:w-2/3 text-center"
                  value={remainingQuestions}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (isNaN(val) || val < 0) {
                      handleSetRemainingQuestions(0);
                    } else {
                      handleSetRemainingQuestions(val);
                    }
                  }}
                />
                {remainingQuestions > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-3 w-full"
                  >
                    <p className="mb-2 text-base sm:text-lg font-semibold text-blue-600">
                      Kalan Soru: {remainingQuestions} 📚
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={decrementQuestions}
                      className="btn-primary w-full"
                    >
                      <FaCheckCircle className="mr-2 inline" />
                      Çözdüm! ✨
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Sonuç Girişi */}
            <div className="space-y-3 sm:space-y-4 mb-6">
              <input
                type="number"
                placeholder="Toplam Soru Sayısı 📚"
                className="input-field bg-blue-50 placeholder:text-blue-400 text-blue-700"
                value={questionCount}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (isNaN(val) || val < 0) {
                    setQuestionCount('0');
                  } else {
                    setQuestionCount(val.toString());
                  }
                }}
              />
              <input
                type="number"
                placeholder="Doğru Sayısı ✅"
                className="input-field bg-green-50 placeholder:text-green-500 text-green-700"
                value={correct}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (isNaN(val) || val < 0) {
                    setCorrect('0');
                  } else {
                    setCorrect(val.toString());
                  }
                }}
              />
              <input
                type="number"
                placeholder="Yanlış Sayısı ❌"
                className="input-field bg-pink-50 placeholder:text-pink-500 text-pink-700"
                value={incorrect}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (isNaN(val) || val < 0) {
                    setIncorrect('0');
                  } else {
                    setIncorrect(val.toString());
                  }
                }}
              />
              <input
                type="number"
                placeholder="Boş Sayısı ⭕"
                className="input-field bg-yellow-50 placeholder:text-yellow-500 text-yellow-700"
                value={blank}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (isNaN(val) || val < 0) {
                    setBlank('0');
                  } else {
                    setBlank(val.toString());
                  }
                }}
              />
            </div>

            {(questionCount || correct || incorrect || blank) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg sm:rounded-xl"
              >
                <p className="text-lg sm:text-xl font-bold text-purple-600 mb-2">
                  Net: {calculateNet()} 🎯
                </p>
                <div className={`text-base sm:text-lg font-bold ${getPerformanceLabel(calculateNet()).color}`}>
                  {getPerformanceLabel(calculateNet()).emoji}{' '}
                  {getPerformanceLabel(calculateNet()).text}
                </div>
                <div className={`text-xs sm:text-sm mt-1 ${getPerformanceLabel(calculateNet()).color} opacity-80`}>
                  {getPerformanceLabel(calculateNet()).subtitle}
                </div>
                <div className="mt-2">
                  {renderStars(getPerformanceLabel(calculateNet()).stars)}
                </div>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="btn-primary w-full"
            >
              <FaCheckCircle className="mr-2 inline" />
              Kaydet ✨
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="overflow-x-auto"
          >
            {records.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="responsive-table">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-50 to-pink-50">
                      <th className="text-purple-600">Tarih</th>
                      <th className="text-purple-600">Soru</th>
                      <th className="text-purple-600">D</th>
                      <th className="text-purple-600">Y</th>
                      <th className="text-purple-600">B</th>
                      <th className="text-purple-600">Net</th>
                      <th className="text-purple-600"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b hover:bg-purple-50 transition-colors"
                      >
                        <td className="text-gray-800">{record.date}</td>
                        <td className="text-gray-800">{record.questionCount}</td>
                        <td className="text-green-500">{record.correct}</td>
                        <td className="text-red-500">{record.incorrect}</td>
                        <td className="text-orange-500">{record.blank}</td>
                        <td className="font-semibold text-gray-800">{record.net}</td>
                        <td>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteRecord(index)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <FaTrash />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-6 text-responsive">
                Henüz kayıt yok! Hadi çalışmaya başla! 💪
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default LessonTracker 