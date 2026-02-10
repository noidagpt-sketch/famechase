import React from "react";
import { isSupabaseConfigured } from "../lib/supabase";

export default function SupabaseConfigBanner() {
  if (isSupabaseConfigured()) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-blue-600 text-sm">💡</span>
        </div>
        <div className="flex-1">
          <h3 className="text-blue-800 font-semibold mb-2">Demo Mode Active</h3>
          <p className="text-blue-700 text-sm mb-3">
            The application is running in demo mode with mock data. To enable
            full functionality with real payments and user data, configure your
            Supabase project:
          </p>
          <div className="bg-blue-100 rounded-lg p-3 text-sm">
            <h4 className="font-semibold text-blue-800 mb-2">Quick Setup:</h4>
            <ol className="text-blue-700 space-y-1">
              <li>
                1. Create a Supabase project at{" "}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  supabase.com
                </a>
              </li>
              <li>
                2. Run the SQL script from{" "}
                <code className="bg-blue-200 px-1 rounded">
                  scripts/setup-database.sql
                </code>
              </li>
              <li>3. Set environment variables:</li>
            </ol>
            <pre className="bg-blue-200 p-2 rounded mt-2 text-xs overflow-x-auto">
              {`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
