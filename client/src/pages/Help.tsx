import React, { useState } from "react";

interface HelpSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

function Help() {
  const [activeSection, setActiveSection] = useState<string>("getting-started");

  const helpSections: HelpSection[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-blue-400 mb-3">
              Welcome to Food Helper!
            </h3>
            <p className="text-gray-300 mb-4">
              Food Helper is your personal meal planning and recipe management
              assistant. This app helps you discover new recipes, plan your
              meals, manage your ingredient inventory.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-green-400 mb-2">
              Quick Start Guide:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
              <li>Create your account and verify your email</li>
              <li>
                Browse the Catalog to discover recipes based on your preferences
              </li>
              <li>Add ingredients to your Inventory</li>
              <li>Use the Planner to schedule your meals</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: "catalog",
      title: "Recipe Catalog",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-blue-400 mb-3">
              Discovering Recipes
            </h3>
            <p className="text-gray-300 mb-4">
              The Catalog is your gateway to exploring hundreds of delicious
              recipes. Use powerful filtering options to find exactly what
              you're looking for.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-green-400 mb-3">
              Available Filters:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">
                  🍽️ Categories
                </h5>
                <p className="text-gray-300 text-sm">
                  Filter by meal type like breakfast, lunch, dinner, desserts,
                  etc.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">
                  👅 Tastes
                </h5>
                <p className="text-gray-300 text-sm">
                  Find dishes by flavor profile - sweet, spicy, savory, etc.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">
                  ⏱️ Cooking Time
                </h5>
                <p className="text-gray-300 text-sm">
                  Set maximum cooking time to fit your schedule.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">
                  ⭐ Difficulty
                </h5>
                <p className="text-gray-300 text-sm">
                  Choose recipes based on your cooking skill level (1-3 stars).
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-green-400 mb-2">
              How to Use:
            </h4>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Use the search bar to find specific dishes by name</li>
              <li>Apply multiple filters to narrow down results</li>
              <li>Click on any dish to view detailed recipe information</li>
              <li>Navigate through pages using the pagination controls</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "planner",
      title: "Meal Planner",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-blue-400 mb-3">
              Planning Your Meals
            </h3>
            <p className="text-gray-300 mb-4">
              The Meal Planner helps you organize your daily meals and track
              your nutrition. Plan ahead and get recommendations that fit your
              calorie goals.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-green-400 mb-3">
              Key Features:
            </h4>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">
                  📅 Date Selection
                </h5>
                <p className="text-gray-300 text-sm">
                  Choose any date to plan your meals. Your plans are saved
                  automatically and you can view or modify them anytime.
                </p>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">
                  🍽️ Meal Types
                </h5>
                <p className="text-gray-300 text-sm">
                  Organize dishes by meal types (breakfast, lunch, dinner,
                  snacks). Each meal type shows the dish and total calories.
                </p>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">
                  🎯 Smart Recommendations
                </h5>
                <p className="text-gray-300 text-sm">
                  Set your target calories and get personalized dish
                  recommendations. The system considers your remaining calorie
                  budget for the day.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-green-400 mb-2">
              How to Plan Meals:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
              <li>Select the date you want to plan for</li>
              <li>Set your target calories in the recommendations panel</li>
              <li>Click "Get Recommendations" to see suggested dishes</li>
              <li>Click the "+" button on any recommended dish</li>
              <li>Choose the meal type (breakfast, lunch, etc.)</li>
              <li>Click "Add to Plan" to schedule the dish</li>
            </ol>
          </div>

          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
            <h4 className="text-lg font-medium text-green-300 mb-2">
              💚 Nutrition Tracking
            </h4>
            <p className="text-gray-300">
              The planner automatically calculates total calories for each day
              and shows calories per serving for each dish. This helps you
              maintain a balanced diet.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "inventory",
      title: "Ingredient Inventory",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-blue-400 mb-3">
              Managing Your Ingredients
            </h3>
            <p className="text-gray-300 mb-4">
              Keep track of what ingredients you have at home. This helps you
              plan meals based on what's available and reduces food waste.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-green-400 mb-3">
              Inventory Features:
            </h4>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">
                  ➕ Add Ingredients
                </h5>
                <p className="text-gray-300 text-sm mb-2">
                  Click "Add Ingredient" to add items to your inventory. Search
                  from our database of ingredients and specify quantities.
                </p>
                <ul className="list-disc list-inside text-gray-400 text-xs ml-4">
                  <li>Search by ingredient name</li>
                  <li>Set quantities in grams, cups, pieces, etc.</li>
                  <li>View calorie information per ingredient</li>
                </ul>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">
                  ✏️ Update Quantities
                </h5>
                <p className="text-gray-300 text-sm">
                  Click the edit button (pencil icon) next to any ingredient to
                  update its quantity. This is useful when you use ingredients
                  or buy more.
                </p>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">
                  🗑️ Remove Items
                </h5>
                <p className="text-gray-300 text-sm">
                  Click the trash icon to remove ingredients from your inventory
                  when they're used up or expired.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-green-400 mb-2">
              Inventory Benefits:
            </h4>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>See total calories available in your inventory</li>
              <li>Plan shopping lists by knowing what you already have</li>
            </ul>
          </div>

          <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
            <h4 className="text-lg font-medium text-orange-300 mb-2">
              🛒 Shopping Tip
            </h4>
            <p className="text-gray-300">
              Before going grocery shopping, check your inventory to see what
              you already have. This prevents buying duplicates and helps you
              plan meals around existing ingredients.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "account",
      title: "Account & Profile",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-blue-400 mb-3">
              Managing Your Account
            </h3>
            <p className="text-gray-300 mb-4">
              Your profile contains important account information and security
              settings. Keep your information up to date for the best
              experience.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-green-400 mb-3">
              Account Features:
            </h4>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">
                  👤 Profile Information
                </h5>
                <ul className="list-disc list-inside text-gray-300 text-sm ml-4">
                  <li>Update your name and email address</li>
                  <li>View your account verification status</li>
                  <li>Check your user role and permissions</li>
                </ul>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">
                  🔒 Security Settings
                </h5>
                <ul className="list-disc list-inside text-gray-300 text-sm ml-4">
                  <li>Change your password regularly</li>
                  <li>Logout from all devices</li>
                </ul>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">
                  ✉️ Email Verification
                </h5>
                <p className="text-gray-300 text-sm">
                  Verify your email address to ensure account security and
                  receive important notifications about your account.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-green-400 mb-2">
              Security Best Practices:
            </h4>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Use a strong password with at least 8 characters</li>
              <li>
                Include uppercase, lowercase, numbers, and special characters
              </li>
              <li>Don't share your login credentials with others</li>
              <li>Log out when using shared computers</li>
              <li>Verify your email to secure your account</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-blue-400 mb-3">
              Common Issues & Solutions
            </h3>
            <p className="text-gray-300 mb-4">
              Having trouble with the app? Here are solutions to the most common
              issues users encounter.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-red-400 mb-3">
              🔐 Login & Authentication:
            </h4>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">
                  Can't log in
                </h5>
                <ul className="list-disc list-inside text-gray-300 text-sm ml-4">
                  <li>Check your email and password are correct</li>
                  <li>Ensure your email is verified (check your inbox)</li>
                  <li>Try refreshing the page</li>
                  <li>Clear your browser cache and cookies</li>
                </ul>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">
                  Email verification issues
                </h5>
                <ul className="list-disc list-inside text-gray-300 text-sm ml-4">
                  <li>Check your spam/junk folder</li>
                  <li>Request a new verification email</li>
                  <li>Make sure you're clicking the correct link</li>
                  <li>Try a different email provider if problems persist</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-red-400 mb-3">
              📱 App Performance:
            </h4>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">
                  Slow loading
                </h5>
                <ul className="list-disc list-inside text-gray-300 text-sm ml-4">
                  <li>Check your internet connection</li>
                  <li>Refresh the page</li>
                  <li>Try a different browser</li>
                  <li>Clear browser cache</li>
                </ul>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">
                  Data not saving
                </h5>
                <ul className="list-disc list-inside text-gray-300 text-sm ml-4">
                  <li>Ensure you're logged in</li>
                  <li>Check your internet connection</li>
                  <li>Try the action again</li>
                  <li>Refresh the page and check if data was saved</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-red-400 mb-3">
              🔍 Search & Filters:
            </h4>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">
                  No search results
                </h5>
                <ul className="list-disc list-inside text-gray-300 text-sm ml-4">
                  <li>Check your spelling</li>
                  <li>Try broader search terms</li>
                  <li>Remove some filters</li>
                  <li>Reset all filters and try again</li>
                </ul>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">
                  Filters not working
                </h5>
                <ul className="list-disc list-inside text-gray-300 text-sm ml-4">
                  <li>Make sure to click "Apply" or "Search"</li>
                  <li>Try refreshing the page</li>
                  <li>Clear all filters and reapply them</li>
                  <li>Check if you have conflicting filter combinations</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <h4 className="text-lg font-medium text-red-300 mb-2">
              🚨 Still Need Help?
            </h4>
            <p className="text-gray-300">
              If you're still experiencing issues, try logging out and back in,
              or contact our support team. Include details about what you were
              trying to do and any error messages you saw.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Food Helper Guide</h1>
          <p className="text-gray-400 text-lg">
            Everything you need to know to master meal planning and recipe
            management
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
              <nav className="space-y-2">
                {helpSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                      activeSection === section.id
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-8">
              {
                helpSections.find((section) => section.id === activeSection)
                  ?.content
              }
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Need More Help?</h3>
            <p className="text-gray-300 mb-4">
              Can't find what you're looking for? Our support team is here to
              help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/a-kuchmambetov/Food_helper"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                📋 View on GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/artem-kuchmambetov-b60ab220a/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                💼 Contact Developer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
