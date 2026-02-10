import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  ShoppingCart,
  TrendingUp,
  Download,
  Search,
  DollarSign,
  Home,
  Loader2,
  LogOut,
} from "lucide-react";

interface UserData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  niche?: string;
  primary_platform?: string;
  follower_count?: string;
  totalDownloads?: number;
  created_at: string;
}

interface PurchaseData {
  id: number;
  product_id: string;
  product_name?: string;
  amount: number;
  payment_status: string;
  payment_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_city?: string;
  created_at: string;
}

interface StatsData {
  totalUsers: number;
  totalPurchases: number;
  totalRevenue: number;
  successfulPayments: number;
  totalDownloads: number;
}

function getAdminToken(): string | null {
  return localStorage.getItem("famechase_admin_token");
}

function adminFetch(url: string) {
  const token = getAdminToken();
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [purchases, setPurchases] = useState<PurchaseData[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalPurchases: 0,
    totalRevenue: 0,
    successfulPayments: 0,
    totalDownloads: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "purchases">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const token = getAdminToken();
    const isLoggedIn = localStorage.getItem("famechase_admin_logged_in");

    if (!isLoggedIn || !token) {
      navigate("/admin-login");
      return;
    }

    const loginTime = localStorage.getItem("famechase_admin_login_time");
    if (loginTime) {
      const sessionDuration = 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(loginTime) > sessionDuration) {
        handleLogout();
        return;
      }
    }

    loadDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("famechase_admin_logged_in");
    localStorage.removeItem("famechase_admin_login_time");
    localStorage.removeItem("famechase_admin_token");
    localStorage.removeItem("famechase_admin_user");
    navigate("/admin-login");
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [usersRes, purchasesRes] = await Promise.all([
        adminFetch("/api/admin/users"),
        adminFetch("/api/admin/purchases"),
      ]);

      const usersData = await usersRes.json();
      const purchasesData = await purchasesRes.json();

      if (!usersRes.ok && usersRes.status === 401) {
        handleLogout();
        return;
      }

      if (usersData.success) {
        setUsers(usersData.users || []);
        setStats({
          totalUsers: usersData.totalUsers || 0,
          totalPurchases: usersData.totalPurchases || 0,
          totalRevenue: usersData.totalRevenue || 0,
          successfulPayments: usersData.successfulPayments || 0,
          totalDownloads: usersData.totalDownloads || 0,
        });
      }

      if (purchasesData.success) {
        setPurchases(purchasesData.purchases || []);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.niche && user.niche.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      purchase.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.product_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "all" || purchase.payment_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => `\u20B9${amount.toLocaleString("en-IN")}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link to="/" className="text-2xl font-bold text-gray-900">
                FameChase<span className="text-blue-600">.com</span>
              </Link>
              <p className="text-sm text-gray-600 mt-1">Admin Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Home className="w-4 h-4" />
                Back to Site
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Purchases</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPurchases}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Successful Payments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.successfulPayments}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {(["overview", "users", "purchases"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "overview" ? "Overview" : tab === "users" ? `Users (${stats.totalUsers})` : `Purchases (${stats.totalPurchases})`}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {(activeTab === "users" || activeTab === "purchases") && (
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                {activeTab === "purchases" && (
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="success">Success</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                )}
              </div>
            )}

            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Purchases</h3>
                  {purchases.length === 0 ? (
                    <p className="text-gray-500">No purchases yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {purchases.slice(0, 5).map((purchase) => (
                        <div key={purchase.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              purchase.payment_status === "success" ? "bg-green-500" :
                              purchase.payment_status === "pending" ? "bg-yellow-500" : "bg-red-500"
                            }`}></div>
                            <div>
                              <p className="font-medium text-gray-900">{purchase.customer_name || purchase.customer_email}</p>
                              <p className="text-sm text-gray-600">{purchase.product_name || purchase.product_id}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(purchase.amount)}</p>
                            <p className="text-sm text-gray-600">{formatDate(purchase.created_at)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="overflow-x-auto">
                {filteredUsers.length === 0 ? (
                  <p className="text-gray-500">No users found.</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Contact</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Niche</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Platform</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Followers</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.city}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-sm text-gray-900">{user.email}</p>
                              <p className="text-sm text-gray-600">{user.phone}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              {user.niche || "N/A"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">{user.primary_platform || "N/A"}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{user.follower_count || "N/A"}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{formatDate(user.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === "purchases" && (
              <div className="overflow-x-auto">
                {filteredPurchases.length === 0 ? (
                  <p className="text-gray-500">No purchases found.</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Product</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Payment ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPurchases.map((purchase) => (
                        <tr key={purchase.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{purchase.customer_name}</p>
                              <p className="text-sm text-gray-600">{purchase.customer_email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-medium text-gray-900">{purchase.product_name || purchase.product_id}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-gray-900">{formatCurrency(purchase.amount)}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(purchase.payment_status)}`}>
                              {purchase.payment_status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-mono text-sm text-gray-900">{purchase.payment_id || "N/A"}</p>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{formatDate(purchase.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
