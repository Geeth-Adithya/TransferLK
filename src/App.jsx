function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="p-8 bg-white shadow-xl rounded-2xl">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">React + Tailwind CSS</h1>
        <p className="text-gray-600">This project has been set up with React and Tailwind CSS v4.</p>
        <button 
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => alert("Tailwind is working!")}
        >
          Click me
        </button>
      </div>
    </div>
  )
}

export default App
