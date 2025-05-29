function Profile() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white p-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="flex flex-col items-center mb-8">
          <img
            className="w-32 h-32 rounded-full shadow-lg mb-4 border-4 border-sky-500"
            src="https://via.placeholder.com/150" // Placeholder image
            alt="Profile"
          />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300 mb-1">
            User Name
          </h1>
          <p className="text-slate-400">user.email@example.com</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-700 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-sky-400 mb-2">
              About Me
            </h2>
            <p className="text-slate-300 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-sky-400 mb-2">Details</h2>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>
                <strong>Location:</strong> City, Country
              </li>
              <li>
                <strong>Joined:</strong> January 2023
              </li>
              <li>
                <strong>Interests:</strong> Coding, Music, Travel
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <button className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
