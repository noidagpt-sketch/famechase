import { useState, useEffect } from "react";
import {
  ArrowLeft,
  BarChart3,
  Users,
  Download,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

interface UserAnalytics {
  userId: string;
  name: string;
  email: string;
  niche: string;
  followers: number;
  totalDownloads: number;
  totalDownloadSize: number;
  createdAt: string;
  engagementScore: number;
}

interface AdminDashboardData {
  success: boolean;
  totalUsers: number;
  users: UserAnalytics[];
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<
    "followers" | "downloads" | "engagement"
  >("followers");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user-analytics/admin/all");

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSortedUsers = () => {
    if (!data?.users) return [];

    return [...data.users].sort((a, b) => {
      switch (sortBy) {
        case "followers":
          return b.followers - a.followers;
        case "downloads":
          return b.totalDownloads - a.totalDownloads;
        case "engagement":
          return b.engagementScore - a.engagementScore;
        default:
          return 0;
      }
    });
  };

  const calculateTotalStats = () => {
    if (!data?.users)
      return { totalFollowers: 0, totalDownloads: 0, avgEngagement: 0 };

    const stats = data.users.reduce(
      (acc, user) => ({
        totalFollowers: acc.totalFollowers + user.followers,
        totalDownloads: acc.totalDownloads + user.totalDownloads,
        avgEngagement: acc.avgEngagement + user.engagementScore,
      }),
      { totalFollowers: 0, totalDownloads: 0, avgEngagement: 0 },
    );

    return {
      ...stats,
      avgEngagement: Math.round(stats.avgEngagement / data.users.length),
    };
  };

  const stats = calculateTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  View all user quiz data, downloads, and engagement metrics
                </p>
              </div>
            </div>
            <BarChart3 className="w-10 h-10 text-blue-600" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        {data && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {data.totalUsers}
                  </p>
                </div>
                <Users className="w-10 h-10 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Total Downloads
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.totalDownloads}
                  </p>
                </div>
                <Download className="w-10 h-10 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Avg Engagement
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.avgEngagement}%
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-purple-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Total Followers
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {(stats.totalFollowers / 1000).toFixed(1)}K
                  </p>
                </div>
                <BarChart3 className="w-10 h-10 text-orange-600 opacity-20" />
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">User Data</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("followers")}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  sortBy === "followers"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                By Followers
              </button>
              <button
                onClick={() => setSortBy("downloads")}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  sortBy === "downloads"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                By Downloads
              </button>
              <button
                onClick={() => setSortBy("engagement")}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  sortBy === "engagement"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                By Engagement
              </button>
            </div>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-gray-500">
              Loading analytics data...
            </div>
          ) : error ? (
            <div className="px-6 py-12 text-center text-red-600">
              Error: {error}
            </div>
          ) : getSortedUsers().length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No user data found yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Niche
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Followers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Downloads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Engagement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getSortedUsers().map((user) => (
                    <tr
                      key={user.userId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.niche}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.followers.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.totalDownloads}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${user.engagementScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {user.engagementScore}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </main>
    </div>
  );
}
