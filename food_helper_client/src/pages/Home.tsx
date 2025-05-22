function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white p-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">
          Welcome Home
        </h1>
        <p className="text-slate-300 text-lg mb-8">
          This is your personalized home page. Explore and enjoy!
        </p>
        <button className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;
