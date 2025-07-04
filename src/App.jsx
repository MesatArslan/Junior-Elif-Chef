import { useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'
import LessonTracker from './components/LessonTracker'
import Statistics from './components/Statistics'
import { FaBook, FaChartLine, FaBrain, FaCalculator, FaAtom, FaGlobe, FaArrowLeft, FaClipboardList, FaChevronDown } from 'react-icons/fa'
import TurkcePart from './parts/TurkcePart'
import MatematikPart from './parts/MatematikPart'
import FenPart from './parts/FenPart'
import SosyalPart from './parts/SosyalPart'

const LESSONS = [
  { name: 'Türkçe', icon: <FaBrain className="text-pink-500 text-3xl sm:text-4xl md:text-5xl mb-3 drop-shadow-lg" /> },
  { name: 'Matematik', icon: <FaCalculator className="text-purple-500 text-3xl sm:text-4xl md:text-5xl mb-3 drop-shadow-lg" /> },
  { name: 'Fen', icon: <FaAtom className="text-blue-500 text-3xl sm:text-4xl md:text-5xl mb-3 drop-shadow-lg" /> },
  { name: 'Sosyal', icon: <FaGlobe className="text-green-500 text-3xl sm:text-4xl md:text-5xl mb-3 drop-shadow-lg" /> },
]

function App() {
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [lessonData, setLessonData] = useState({
    Türkçe: [],
    Matematik: [],
    Fen: [],
    Sosyal: []
  })

  const handleDataUpdate = (lessonName, newData) => {
    setLessonData(prev => ({
      ...prev,
      [lessonName]: Array.isArray(newData) ? newData : [...prev[lessonName], newData]
    }))
  }

  // Ders partlarını seçici olarak render et
  const renderLessonPart = () => {
    switch (selectedLesson) {
      case 'Türkçe':
        return <TurkcePart onBack={() => setSelectedLesson(null)} records={lessonData['Türkçe']} onDataUpdate={data => handleDataUpdate('Türkçe', data)} />
      case 'Matematik':
        return <MatematikPart onBack={() => setSelectedLesson(null)} records={lessonData['Matematik']} onDataUpdate={data => handleDataUpdate('Matematik', data)} />
      case 'Fen':
        return <FenPart onBack={() => setSelectedLesson(null)} records={lessonData['Fen']} onDataUpdate={data => handleDataUpdate('Fen', data)} />
      case 'Sosyal':
        return <SosyalPart onBack={() => setSelectedLesson(null)} records={lessonData['Sosyal']} onDataUpdate={data => handleDataUpdate('Sosyal', data)} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full -translate-x-48 -translate-y-48 opacity-20"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-300 to-blue-300 rounded-full translate-x-40 -translate-y-40 opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-300 to-pink-300 rounded-full -translate-x-36 translate-y-36 opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full translate-x-32 translate-y-32 opacity-20"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent drop-shadow-lg">
            Junior Elif
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-medium bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 bg-clip-text text-transparent">
            Ders Takip Sistemi
          </p>
        </div>

        {/* Ders seçme ekranı */}
        {!selectedLesson && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto px-4 sm:px-0"
          >
            {LESSONS.map(lesson => (
              <motion.button
                key={lesson.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedLesson(lesson.name)}
                className={`flex flex-col items-center justify-center rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-transparent hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer min-h-[160px] relative overflow-hidden group ${
                  lesson.name === 'Türkçe' ? 'bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200 hover:border-pink-400 hover:shadow-pink-200' :
                  lesson.name === 'Matematik' ? 'bg-gradient-to-br from-purple-100 via-violet-100 to-purple-200 hover:border-purple-400 hover:shadow-purple-200' :
                  lesson.name === 'Fen' ? 'bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-200 hover:border-blue-400 hover:shadow-blue-200' :
                  'bg-gradient-to-br from-green-100 via-emerald-100 to-green-200 hover:border-green-400 hover:shadow-green-200'
                }`}
              >
                {/* Background pattern */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  lesson.name === 'Türkçe' ? 'bg-gradient-to-br from-pink-200 via-rose-200 to-pink-300' :
                  lesson.name === 'Matematik' ? 'bg-gradient-to-br from-purple-200 via-violet-200 to-purple-300' :
                  lesson.name === 'Fen' ? 'bg-gradient-to-br from-blue-200 via-cyan-200 to-blue-300' :
                  'bg-gradient-to-br from-green-200 via-emerald-200 to-green-300'
                }`}></div>
                <div className={`absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-10 translate-x-10 opacity-30 group-hover:opacity-60 transition-opacity duration-300 ${
                  lesson.name === 'Türkçe' ? 'bg-gradient-to-br from-pink-300 via-rose-300 to-pink-400' :
                  lesson.name === 'Matematik' ? 'bg-gradient-to-br from-purple-300 via-violet-300 to-purple-400' :
                  lesson.name === 'Fen' ? 'bg-gradient-to-br from-blue-300 via-cyan-300 to-blue-400' :
                  'bg-gradient-to-br from-green-300 via-emerald-300 to-green-400'
                }`}></div>
                <div className={`absolute bottom-0 left-0 w-16 h-16 rounded-full translate-y-8 -translate-x-8 opacity-30 group-hover:opacity-60 transition-opacity duration-300 ${
                  lesson.name === 'Türkçe' ? 'bg-gradient-to-br from-rose-300 via-pink-300 to-rose-400' :
                  lesson.name === 'Matematik' ? 'bg-gradient-to-br from-violet-300 via-purple-300 to-violet-400' :
                  lesson.name === 'Fen' ? 'bg-gradient-to-br from-cyan-300 via-blue-300 to-cyan-400' :
                  'bg-gradient-to-br from-emerald-300 via-green-300 to-emerald-400'
                }`}></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center">
                  {lesson.icon}
                  <span className={`text-lg sm:text-xl font-bold mt-3 text-center transition-colors duration-300 ${
                    lesson.name === 'Türkçe' ? 'text-pink-800 group-hover:text-pink-900 drop-shadow-sm' :
                    lesson.name === 'Matematik' ? 'text-purple-800 group-hover:text-purple-900 drop-shadow-sm' :
                    lesson.name === 'Fen' ? 'text-blue-800 group-hover:text-blue-900 drop-shadow-sm' :
                    'text-green-800 group-hover:text-green-900 drop-shadow-sm'
                  }`}>{lesson.name}</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Seçili dersin partı */}
        {selectedLesson && renderLessonPart()}
      </div>
    </div>
  )
}

export default App
