import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-purple-50 to-cyan-50 dark:from-surface-900 dark:via-purple-900/20 dark:to-cyan-900/20">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetail />} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
        toastClassName="rounded-xl shadow-card"
      />
    </div>
  )
}

export default App