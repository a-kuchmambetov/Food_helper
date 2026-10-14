"use client";

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
            <h3 className="mb-3 text-xl font-semibold text-blue-400">
              Welcome to Food Helper!
            </h3>
            <p className="mb-4 text-gray-300">
              Food Helper is your personal meal planning and recipe management
              assistant. This app helps you discover new recipes, plan your
              meals, manage your ingredient inventory.
            </p>
          </div>

          <div>
            <h4 className="mb-2 text-lg font-medium text-green-400">
              Quick Start Guide:
            </h4>
            <ol className="ml-4 list-inside list-decimal space-y-2 text-gray-300">
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
            <h3 className="mb-3 text-xl font-semibold text-blue-400">
              Discovering Recipes
            </h3>
            <p className="mb-4 text-gray-300">
              The Catalog is your gateway to exploring hundreds of delicious
              recipes. Use powerful filtering options to find exactly what
              you're looking for.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-lg font-medium text-green-400">
              Available Filters:
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-zinc-800 p-4">
                <h5 className="mb-2 font-semibold text-yellow-400">
                  🍽️ Categories
                </h5>
                <p className="text-sm text-gray-300">
                  Filter by meal type like breakfast, lunch, dinner, desserts,
                  etc.
                </p>
              </div>
              <div className="rounded-lg bg-zinc-800 p-4">
                <h5 className="mb-2 font-semibold text-yellow-400">
                  👅 Tastes
                </h5>
                <p className="text-sm text-gray-300">
                  Find dishes by flavor profile - sweet, spicy, savory, etc.
                </p>
              </div>
              <div className="rounded-lg bg-zinc-800 p-4">
                <h5 className="mb-2 font-semibold text-yellow-400">
                  ⏱️ Cooking Time
                </h5>
                <p className="text-sm text-gray-300">
                  Set maximum cooking time to fit your schedule.
                </p>
              </div>
              <div className="rounded-lg bg-zinc-800 p-4">
                <h5 className="mb-2 font-semibold text-yellow-400">
                  ⭐ Difficulty
                </h5>
                <p className="text-sm text-gray-300">
                  Choose recipes based on your cooking skill level (1-3 stars).
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-lg font-medium text-green-400">
              How to Use:
            </h4>
            <ul className="ml-4 list-inside list-disc space-y-2 text-gray-300">
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
            <h3 className="mb-3 text-xl font-semibold text-blue-400">
              Planning Your Meals
            </h3>
            <p className="mb-4 text-gray-300">
              The Meal Planner helps you organize your daily meals and track
              your nutrition. Plan ahead and get recommendations that fit your
              calorie goals.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-lg font-medium text-green-400">
              Key Features:
            </h4>
            <div className="space-y-4">
              <div className="rounded-lg bg-zinc-800 p-4">
                <h5 className="mb-2 font-semibold text-yellow-400">
                  📅 Date Selection
                </h5>
                <p className="text-sm text-gray-300">
                  Choose any date to plan your meals. Your plans are saved
                  automatically and you can view or modify them anytime.
                </p>
              </div>

              <div className="rounded-lg bg-zinc-800 p-4">
                <h5 className="mb-2 font-semibold text-yellow-400">
                  🍽️ Meal Types
                </h5>
                <p className="text-sm text-gray-300">
                  Organize dishes by meal types (breakfast, lunch, dinner,
                  snacks). Each meal type shows the dish and total calories.
                </p>
              </div>

              <div className="rounded-lg bg-zinc-800 p-4">
                <h5 className="mb-2 font-semibold text-yellow-400">
                  🎯 Smart Recommendations
                </h5>
                <p className="text-sm text-gray-300">
                  Set your target calories and get personalized dish
                  recommendations. The system considers your remaining calorie
                  budget for the day.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-lg font-medium text-green-400">
              How to Plan Meals:
            </h4>
            <ol className="ml-4 list-inside list-decimal space-y-2 text-gray-300">
              <li>Select the date you want to plan for</li>
              <li>Set your target calories in the recommendations panel</li>
              <li>Click "Get Recommendations" to see suggested dishes</li>
              <li>Click the "+" button on any recommended dish</li>
              <li>Choose the meal type (breakfast, lunch, etc.)</li>
              <li>Click "Add to Plan" to schedule the dish</li>
            </ol>
          </div>

          <div className="rounded-lg border border-green-700 bg-green-900/20 p-4">
            <h4 className="mb-2 text-lg font-medium text-green-300">
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
            <h3 className="mb-3 text-xl font-semibold text-blue-400">
              Managing Your Ingredients
            </h3>
            <p className="mb-4 text-gray-300">
              Keep track of what ingredients you have at home. This helps you
              plan meals based on what's available and reduces food waste.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-lg font-medium text-green-400">
              Inventory Features:
            </h4>
            <div className="space-y-4">
              <div className="rounded-lg bg-zinc-800 p-4">
                <h5 className="mb-2 font-semibold text-yellow-400">
                  ➕ Add Ingredients
                </h5>
                <p className="mb-2 text-sm text-gray-300">
                  Click "Add Ingredient" to add items to your inventory. Search
                  from our database of ingredients and specify quantities.
                </p>
                <ul className="ml-4 list-inside list-disc text-xs text-gray-400">
                  <li>Search by ingredient name</li>
                  <li>Set quantities in grams, cups, pieces, etc.</li>
                  <li>View calorie information per ingredient</li>
                </ul>
              </div>

              <div className="rounded-lg bg-zinc-800 p-4">
                <h5 className="mb-2 font-semibold text-yellow-400">
                  ✏️ Update Quantities
                </h5>
                <p className="text-sm text-gray-300">
                  Click the edit button (pencil icon) next to any ingredient to
                  update its quantity. This is useful when you use ingredients
                  or buy more.
                </p>
              </div>

              <div className="rounded-lg bg-zinc-800 p-4">
                <h5 className="mb-2 font-semibold text-yellow-400">
                  🗑️ Remove Items
                </h5>
                <p className="text-sm text-gray-300">
                  Click the trash icon to remove ingredients from your inventory
                  when they're used up or expired.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-lg font-medium text-green-400">
              Inventory Benefits:
            </h4>
            <ul className="ml-4 list-inside list-disc space-y-2 text-gray-300">
              <li>See total calories available in your inventory</li>
              <li>Plan shopping lists by knowing what you already have</li>
            </ul>
          </div>

          <div className="rounded-lg border border-orange-700 bg-orange-900/20 p-4">
            <h4 className="mb-2 text-lg font-medium text-orange-300">
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
            <h3 className="mb-3 text-xl font-semibold text-blue-400">
              Managing Your Account
            </h3>
            <p className="mb-4 text-gray-300">
              Your profile contains important account information and security
              settings. Keep your information up to date for the best
              experience.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-lg font-medium text-green-400">
              Account Features:
            </h4>
            <div className="space-y-4">
              <div className="rounded-lg bg-zinc-800 p-4">
                <h5 className="mb-2 font-semibold text-yellow-400">
                  👤 Profile Information
                </h5>
                <ul className="ml-4 list-inside list-disc text-sm text-gray-300">
                  <li>Update your name and email address</li>
                  <li>View your account verification status</li>
                  <li>Check your user role and permissions</li>
                </ul>
              </div>

              <div className="rounded-lg bg-zinc-800 p-4">
                <h5 className="mb-2 font-semibold text-yellow-400">
                  🔒 Security Settings
                </h5>
                <ul className="ml-4 list-inside list-disc text-sm text-gray-300">
                  <li>Change your password regularly</li>
                  <li>Logout from all devices</li>
                </ul>
              </div>

              <div className="rounded-lg bg-zinc-800 p-4">
                <h5 className="mb-2 font-semibold text-yellow-400">
                  ✉️ Email Verification
                </h5>
                <p className="text-sm text-gray-300">
                  Verify your email address to ensure account security and
                  receive important notifications about your account.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-lg font-medium text-green-400">
              Security Best Practices:
            </h4>
            <ul className="ml-4 list-inside list-disc space-y-2 text-gray-300">
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
            <h3 className="mb-3 text-xl font-semibold text-blue-400">
              Common Issues & Solutions
            </h3>
            <p className="mb-4 text-gray-300">
              Having trouble with the app? Here are solutions to the most common
              issues users encounter.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-lg font-medium text-red-400">
              🔐 Login & Authentication:
            </h4>
            <div className="space-y-4">
              <div className="rounded-lg bg-zinc-800 p-4">
                <h5 className="mb-2 font-semibold text-yellow-400">
                  Can't log in
                </h5>
                <ul className="ml-4 list-inside list-disc text-sm text-gray-300">
                  <li>Check your email and password are correct</li>
                  <li>Ensure your email is verified (check your inbox)</li>
                  <li>Try refreshing the page</li>
                  <li>Clear your browser cache and cookies</li>
                </ul>
              </div>

              <div className="rounded-lg bg-zinc-800 p-4">
                <h5 className="mb-2 font-semibold text-yellow-400">
                  Email verification issues
                </h5>
                <ul className="ml-4 list-inside list-disc text-sm text-gray-300">
                  <li>Check your spam/junk folder</li>
                  <li>Request a new verification email</li>
                  <li>Make sure you're clicking the correct link</li>
                  <li>Try a different email provider if problems persist</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-lg font-medium text-red-400">
              📱 App Performance:
            </h4>
            <div className="space-y-4">
              <div className="rounded-lg bg-zinc-800 p-4">
                <h5 className="mb-2 font-semibold text-yellow-400">
                  Slow loading
                </h5>
                <ul className="ml-4 list-inside list-disc text-sm text-gray-300">
                  <li>Check your internet connection</li>
                  <li>Refresh the page</li>
                  <li>Try a different browser</li>
                  <li>Clear browser cache</li>
                </ul>
              </div>

              <div className="rounded-lg bg-zinc-800 p-4">
                <h5 className="mb-2 font-semibold text-yellow-400">
                  Data not saving
                </h5>
                <ul className="ml-4 list-inside list-disc text-sm text-gray-300">
                  <li>Ensure you're logged in</li>
                  <li>Check your internet connection</li>
                  <li>Try the action again</li>
                  <li>Refresh the page and check if data was saved</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-lg font-medium text-red-400">
              🔍 Search & Filters:
            </h4>
            <div className="space-y-4">
              <div className="rounded-lg bg-zinc-800 p-4">
                <h5 className="mb-2 font-semibold text-yellow-400">
                  No search results
                </h5>
                <ul className="ml-4 list-inside list-disc text-sm text-gray-300">
                  <li>Check your spelling</li>
                  <li>Try broader search terms</li>
                  <li>Remove some filters</li>
                  <li>Reset all filters and try again</li>
                </ul>
              </div>

              <div className="rounded-lg bg-zinc-800 p-4">
                <h5 className="mb-2 font-semibold text-yellow-400">
                  Filters not working
                </h5>
                <ul className="ml-4 list-inside list-disc text-sm text-gray-300">
                  <li>Make sure to click "Apply" or "Search"</li>
                  <li>Try refreshing the page</li>
                  <li>Clear all filters and reapply them</li>
                  <li>Check if you have conflicting filter combinations</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-red-700 bg-red-900/20 p-4">
            <h4 className="mb-2 text-lg font-medium text-red-300">
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
    <div className="min-h-screen p-6 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Food Helper Guide</h1>
          <p className="text-lg text-gray-400">
            Everything you need to know to master meal planning and recipe
            management
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-lg border border-zinc-700 bg-zinc-900 p-4">
              <h2 className="mb-4 text-xl font-semibold">Table of Contents</h2>
              <nav className="space-y-2">
                {helpSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full rounded-lg px-3 py-2 text-left transition-colors duration-200 ${
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
            <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-8">
              {
                helpSections.find((section) => section.id === activeSection)
                  ?.content
              }
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-6">
            <h3 className="mb-3 text-xl font-semibold">Need More Help?</h3>
            <p className="mb-4 text-gray-300">
              Can't find what you're looking for? Our support team is here to
              help!
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="https://github.com/a-kuchmambetov/Food_helper"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-gray-700 px-6 py-2 text-white transition-colors duration-200 hover:bg-gray-600"
              >
                📋 View on GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/artem-kuchmambetov-b60ab220a/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
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
