import React from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

export const CanvasModeToggle = () => {
  const { id: sessionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const isCanvasMode = location.pathname.startsWith('/canvas')

  const handleToggleMode = () => {
    if (!sessionId) {
      console.error("Session ID is missing from the URL.")
      return
    }

    const targetPath = isCanvasMode
      ? `/edit/${sessionId}`
      : `/canvas/${sessionId}`

    navigate(targetPath)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleToggleMode}
        className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200"
      >
        {isCanvasMode ? 'Toggle Edit Mode' : 'Toggle Canvas Mode'}
      </button>
    </div>
  )
}
