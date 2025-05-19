import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'

// Pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import StatisticsPage from './pages/StatisticsPage'
import SettingsPage from './pages/SettingsPage'
import AddMealPage from './pages/AddMealPage'
import AddGlucosePage from './pages/AddGlucosePage'
import AddInsulinPage from './pages/AddInsulinPage'
import PatientListPage from './pages/PatientListPage'
import PatientDetailPage from './pages/PatientDetailPage'
import AddPatientPage from './pages/AddPatientPage'
import NotFoundPage from './pages/NotFoundPage'

// Components
import Layout from './components/common/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
      
      <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<HomePage />} />
        <Route path="statistics" element={<StatisticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="add-meal" element={<AddMealPage />} />
        <Route path="add-glucose" element={<AddGlucosePage />} />
        <Route path="add-insulin" element={<AddInsulinPage />} />
      </Route>
      
      <Route path="/healthcare" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<PatientListPage />} />
        <Route path="patient/:patientId" element={<PatientDetailPage />} />
        <Route path="add-patient" element={<AddPatientPage />} />
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App 