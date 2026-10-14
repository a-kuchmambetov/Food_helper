"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export interface HelpSection {
  id: string;
  title: string;
  content: ReactNode;
}

function HelpTabs({ sections }: { sections: HelpSection[] }) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1">
        <div className="sticky top-6 rounded-lg border border-zinc-700 bg-zinc-900 p-4">
          <h2 className="mb-4 text-xl font-semibold">Table of Contents</h2>
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                aria-current={activeSection === section.id ? "true" : undefined}
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
          {sections.find((section) => section.id === activeSection)?.content}
        </div>
      </div>
    </div>
  );
}

export default HelpTabs;
