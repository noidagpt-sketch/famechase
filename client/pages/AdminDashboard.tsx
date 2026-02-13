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
  ChevronDown,
  ChevronUp,
  Globe,
} from "lucide-react";
import * as XLSX from "xlsx";
import { downloadFile } from "@/lib/products";

interface UserData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  age?: string;
  city?: string;
  niche?: string;
  primary_platform?: string;
  secondary_platforms?: string[];
  follower_count?: string;
  engagement_rate?: string;
  content_type?: string;
  posting_frequency?: string;
  experience?: string[];
  monthly_income?: string;
  biggest_challenge?: string[];
  goals?: string[];
  bio?: string;
  language?: string;
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

interface DownloadData {
  id: number;
  guest_email?: string;
  download_type?: string;
  file_name?: string;
  product_id?: string;
  created_at: string;
}

interface TrafficData {
  id: number;
  ip_address?: string;
  city?: string;
  region?: string;
  country?: string;
  user_agent?: string;
  path?: string;
  referrer?: string;
  created_at: string;
}

interface StatsData {
  totalUsers: number;
  totalPurchases: number;
  totalRevenue: number;
  successfulPayments: number;
  totalDownloads: number;
  totalVisits: number;
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
  const [downloads, setDownloads] = useState<DownloadData[]>([]);
  const [traffic, setTraffic] = useState<TrafficData[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalPurchases: 0,
    totalRevenue: 0,
    successfulPayments: 0,
    totalDownloads: 0,
    totalVisits: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "purchases" | "downloads" | "traffic">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

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

      const [usersRes, purchasesRes, downloadsRes, trafficRes] = await Promise.all([
        adminFetch("/api/admin/users"),
        adminFetch("/api/admin/purchases"),
        adminFetch("/api/admin/downloads"),
        adminFetch("/api/admin/traffic"),
      ]);

      const usersData = await usersRes.json();
      const purchasesData = await purchasesRes.json();
      const downloadsData = await downloadsRes.json();
      const trafficData = await trafficRes.json();

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
          totalVisits: trafficData.traffic?.length || 0,
        });
      }

      if (purchasesData.success) {
        setPurchases(purchasesData.purchases || []);
      }

      if (downloadsData.success) {
        setDownloads(downloadsData.downloads || []);
      }

      if (trafficData.success) {
        setTraffic(trafficData.traffic || []);
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
      (user.phone && user.phone.includes(searchTerm)) ||
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

  const filteredDownloads = downloads.filter(
    (dl) =>
      dl.guest_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dl.file_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dl.product_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTraffic = traffic.filter(
    (t) =>
      t.ip_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const formatArray = (arr: string[] | undefined) => {
    if (!arr || arr.length === 0) return "N/A";
    return arr.join(", ");
  };

  const exportToExcel = () => {
    let dataToExport: any[] = [];
    let fileName = "famechase_data.xlsx";

    if (activeTab === "users") {
      dataToExport = filteredUsers.map(u => ({
        Name: u.name,
        Email: u.email,
        Phone: u.phone,
        Age: u.age,
        City: u.city,
        Niche: u.niche,
        Platform: u.primary_platform,
        Followers: u.follower_count,
        Date: formatDate(u.created_at)
      }));
      fileName = "famechase_users.xlsx";
    } else if (activeTab === "purchases") {
      dataToExport = filteredPurchases.map(p => ({
        Customer: p.customer_name,
        Email: p.customer_email,
        Product: p.product_name || p.product_id,
        Amount: p.amount,
        Status: p.payment_status,
        Date: formatDate(p.created_at)
      }));
      fileName = "famechase_purchases.xlsx";
    } else if (activeTab === "downloads") {
      dataToExport = filteredDownloads.map(d => ({
        User: d.guest_email,
        File: d.file_name,
        Type: d.download_type,
        Date: formatDate(d.created_at)
      }));
      fileName = "famechase_downloads.xlsx";
    } else if (activeTab === "traffic") {
      dataToExport = filteredTraffic.map(t => ({
        IP: t.ip_address,
        City: t.city,
        Region: t.region,
        Country: t.country,
        Path: t.path,
        Referrer: t.referrer,
        Date: formatDate(t.created_at)
      }));
      fileName = "famechase_traffic.xlsx";
    }

    if (dataToExport.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, fileName);
  };

  const handleDownloadPDF = async (fileName: string, userData?: any) => {
    try {
      const content = `PDF Content for ${fileName}\n\nGenerated for: ${userData?.name || userData?.customer_name || userData?.guest_email || 'User'}`;
      await downloadFile(content, fileName);
    } catch (error) {
      console.error("Error downloading PDF:", error);
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
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Total Purchases</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalPurchases}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Downloads</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalDownloads}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Site Visits</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalVisits}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {(["overview", "users", "purchases", "downloads", "traffic"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSearchTerm(""); }}
                  className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "overview" ? "Overview" :
                   tab === "users" ? "Users" :
                   tab === "purchases" ? "Purchases" :
                   tab === "downloads" ? "Downloads" :
                   "Traffic Log"}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab !== "overview" && (
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
                <button
                  onClick={exportToExcel}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Excel Export
                </button>
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
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Downloads</h3>
                  {downloads.length === 0 ? (
                    <p className="text-gray-500">No downloads yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {downloads.slice(0, 5).map((dl) => (
                        <div key={dl.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{dl.file_name}</p>
                            <p className="text-sm text-gray-600">{dl.guest_email || "Unknown user"}</p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              {dl.download_type || "file"}
                            </span>
                            <p className="text-sm text-gray-600 mt-1">{formatDate(dl.created_at)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "traffic" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-left">
                      <th className="py-3 px-4">IP Address</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Path</th>
                      <th className="py-3 px-4">Referrer</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTraffic.map((t) => (
                      <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-sm">{t.ip_address}</td>
                        <td className="py-3 px-4 text-sm">
                          {t.city ? `${t.city}, ${t.region || ""}, ${t.country}` : "Unknown"}
                        </td>
                        <td className="py-3 px-4 text-sm">{t.path}</td>
                        <td className="py-3 px-4 text-sm text-gray-500 truncate max-w-xs" title={t.referrer}>
                          {t.referrer || "Direct"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{formatDate(t.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "users" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">User</th>
                      <th className="text-left py-3 px-4">Contact</th>
                      <th className="text-left py-3 px-4">Age</th>
                      <th className="text-left py-3 px-4">Niche</th>
                      <th className="text-left py-3 px-4">Downloads</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <React.Fragment key={user.id}>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{user.name}</td>
                          <td className="py-3 px-4 text-sm">{user.email}</td>
                          <td className="py-3 px-4 text-sm">{user.age || "N/A"}</td>
                          <td className="py-3 px-4 text-sm">{user.niche || "N/A"}</td>
                          <td className="py-3 px-4 text-sm">{user.totalDownloads || 0}</td>
                          <td className="py-3 px-4 text-sm">{formatDate(user.created_at)}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}
                              className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
                            >
                              {expandedUserId === user.id ? <><ChevronUp className="w-4 h-4" /> Hide</> : <><ChevronDown className="w-4 h-4" /> View</>}
                            </button>
                          </td>
                        </tr>
                        {expandedUserId === user.id && (
                          <tr className="bg-blue-50/50">
                            <td colSpan={7} className="px-4 py-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div><p className="font-semibold">Phone</p><p>{user.phone || "N/A"}</p></div>
                                <div><p className="font-semibold">City</p><p>{user.city || "N/A"}</p></div>
                                <div><p className="font-semibold">Platform</p><p>{user.primary_platform || "N/A"}</p></div>
                                <div><p className="font-semibold">Followers</p><p>{user.follower_count || "N/A"}</p></div>
                                <div><p className="font-semibold">Monthly Income</p><p>{user.monthly_income || "N/A"}</p></div>
                                <div><p className="font-semibold">Engagement</p><p>{user.engagement_rate || "N/A"}</p></div>
                                <div><p className="font-semibold">Content Type</p><p>{user.content_type || "N/A"}</p></div>
                                <div><p className="font-semibold">Frequency</p><p>{user.posting_frequency || "N/A"}</p></div>
                                <div className="col-span-2"><p className="font-semibold">Experience</p><p>{formatArray(user.experience)}</p></div>
                                <div className="col-span-2"><p className="font-semibold">Goals</p><p>{formatArray(user.goals)}</p></div>
                                <div className="col-span-2"><p className="font-semibold">Biggest Challenge</p><p>{formatArray(user.biggest_challenge)}</p></div>
                                <div className="col-span-2"><p className="font-semibold">Bio</p><p>{user.bio || "N/A"}</p></div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "purchases" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-left">
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPurchases.map((p) => (
                      <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{p.customer_name}</div>
                          <div className="text-xs text-gray-500">{p.customer_email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{p.product_name || p.product_id}</div>
                          {p.payment_status === "success" && (
                            <button
                              onClick={() => handleDownloadPDF(p.product_id + ".pdf", p)}
                              className="text-blue-600 hover:underline text-xs flex items-center gap-1 mt-1"
                            >
                              <Download className="w-3 h-3" /> Download PDF
                            </button>
                          )}
                        </td>
                        <td className="py-3 px-4 font-semibold">{formatCurrency(p.amount)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(p.payment_status)}`}>
                            {p.payment_status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{formatDate(p.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "downloads" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-left">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">File</th>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDownloads.map((d) => (
                      <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">{d.guest_email}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{d.file_name}</div>
                          <button
                            onClick={() => handleDownloadPDF(d.file_name || "download.pdf", d)}
                            className="text-blue-600 hover:underline text-xs flex items-center gap-1 mt-1"
                          >
                            <Download className="w-3 h-3" /> Download Link
                          </button>
                        </td>
                        <td className="py-3 px-4 text-sm">{d.product_id}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{formatDate(d.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
