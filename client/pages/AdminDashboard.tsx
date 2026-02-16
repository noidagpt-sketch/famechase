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
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
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
  user_name?: string;
  user_phone?: string;
  user_city?: string;
  user_niche?: string;
  user_platform?: string;
  user_followers?: string;
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
  is_bot?: boolean;
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
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "purchases" | "downloads" | "traffic" | "products">("overview");
  const [productSettings, setProductSettings] = useState<Record<string, boolean>>({});
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ product_id: "", product_name: "", price: "", original_price: "", description: "", category: "course", features: "" });
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

      const [usersRes, purchasesRes, downloadsRes, trafficRes, productSettingsRes] = await Promise.all([
        adminFetch("/api/admin/users"),
        adminFetch("/api/admin/purchases"),
        adminFetch("/api/admin/downloads"),
        adminFetch("/api/admin/traffic"),
        adminFetch("/api/admin/product-settings"),
      ]);

      const usersData = await usersRes.json();
      const purchasesData = await purchasesRes.json();
      const downloadsData = await downloadsRes.json();
      const trafficData = await trafficRes.json();
      const productSettingsData = await productSettingsRes.json();

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

      if (productSettingsData.success) {
        setProductSettings(productSettingsData.settings || {});
        setDbProducts(productSettingsData.products || []);
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
        Name: d.user_name || "",
        Email: d.guest_email,
        Phone: d.user_phone || "",
        City: d.user_city || "",
        Niche: d.user_niche || "",
        Platform: d.user_platform || "",
        Followers: d.user_followers || "",
        File: d.file_name,
        Product: d.product_id,
        Type: d.download_type,
        Date: formatDate(d.created_at)
      }));
      fileName = "famechase_downloads.xlsx";
    } else if (activeTab === "traffic") {
      dataToExport = filteredTraffic.map(t => ({
        Type: t.is_bot ? "Bot" : "Human",
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
      const userName = userData?.name || userData?.customer_name || "N/A";
      const userEmail = userData?.email || userData?.customer_email || userData?.guest_email || "N/A";
      const userPhone = userData?.phone || userData?.customer_phone || "N/A";
      const userCity = userData?.city || userData?.customer_city || "N/A";
      const userNiche = userData?.niche || "N/A";
      const userPlatform = userData?.primary_platform || "N/A";
      const userFollowers = userData?.follower_count || "N/A";
      const userAge = userData?.age || "N/A";
      const userBio = userData?.bio || "N/A";
      const userGoals = Array.isArray(userData?.goals) ? userData.goals.join(", ") : (userData?.goals || "N/A");
      const userChallenges = Array.isArray(userData?.biggest_challenge) ? userData.biggest_challenge.join(", ") : (userData?.biggest_challenge || "N/A");
      const userIncome = userData?.monthly_income || "N/A";
      const userEngagement = userData?.engagement_rate || "N/A";
      const createdAt = userData?.created_at ? formatDate(userData.created_at) : "N/A";

      const productName = userData?.product_name || userData?.product_id || "";
      const amount = userData?.amount ? `Rs ${userData.amount}` : "";
      const paymentStatus = userData?.payment_status || "";

      let content = `FAMECHASE.COM - USER REPORT\n${"=".repeat(50)}\n\n`;
      content += `Report Generated: ${new Date().toLocaleString()}\n\n`;

      content += `USER INFORMATION\n${"-".repeat(30)}\n`;
      content += `Name: ${userName}\n`;
      content += `Email: ${userEmail}\n`;
      content += `Phone: ${userPhone}\n`;
      content += `City: ${userCity}\n`;
      content += `Age: ${userAge}\n`;
      content += `Registered: ${createdAt}\n\n`;

      content += `CREATOR PROFILE\n${"-".repeat(30)}\n`;
      content += `Niche: ${userNiche}\n`;
      content += `Primary Platform: ${userPlatform}\n`;
      content += `Followers: ${userFollowers}\n`;
      content += `Engagement Rate: ${userEngagement}\n`;
      content += `Monthly Income: ${userIncome}\n`;
      content += `Bio: ${userBio}\n\n`;

      content += `GOALS & CHALLENGES\n${"-".repeat(30)}\n`;
      content += `Goals: ${userGoals}\n`;
      content += `Biggest Challenges: ${userChallenges}\n\n`;

      if (productName) {
        content += `PURCHASE DETAILS\n${"-".repeat(30)}\n`;
        content += `Product: ${productName}\n`;
        content += `Amount: ${amount}\n`;
        content += `Payment Status: ${paymentStatus}\n\n`;
      }

      if (userData?.totalDownloads !== undefined) {
        content += `ACTIVITY\n${"-".repeat(30)}\n`;
        content += `Total Downloads: ${userData.totalDownloads}\n\n`;
      }

      content += `\n${"=".repeat(50)}\nGenerated by FameChase.com Admin Dashboard\n`;

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
    <div className="min-h-screen bg-gray-50 text-gray-900">
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
              {(["overview", "users", "purchases", "downloads", "traffic", "products"] as const).map((tab) => (
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
                   tab === "traffic" ? "Traffic Log" :
                   "Products"}
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
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">IP Address</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Path</th>
                      <th className="py-3 px-4">Referrer</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTraffic.map((t) => (
                      <tr key={t.id} className={`border-b border-gray-100 hover:bg-gray-50 ${t.is_bot ? 'bg-red-50/40' : ''}`}>
                        <td className="py-3 px-4">
                          {t.is_bot ? (
                            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">Bot</span>
                          ) : (
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">Human</span>
                          )}
                        </td>
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
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">File</th>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Profile</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDownloads.map((d) => (
                      <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-sm">{d.user_name || "—"}</div>
                          <div className="text-xs text-gray-500">{d.guest_email}</div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {d.user_phone && <div>{d.user_phone}</div>}
                          {d.user_city && <div className="text-xs text-gray-500">{d.user_city}</div>}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-sm">{d.file_name}</div>
                          <button
                            onClick={() => handleDownloadPDF(d.file_name || "download.pdf", d)}
                            className="text-blue-600 hover:underline text-xs flex items-center gap-1 mt-1"
                          >
                            <Download className="w-3 h-3" /> Download Link
                          </button>
                        </td>
                        <td className="py-3 px-4 text-sm">{d.product_id}</td>
                        <td className="py-3 px-4 text-xs text-gray-600">
                          {d.user_niche && <div>{d.user_niche}</div>}
                          {d.user_platform && <div>{d.user_platform}</div>}
                          {d.user_followers && <div>{d.user_followers}</div>}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{formatDate(d.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "products" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Product Management</h3>
                    <p className="text-sm text-gray-500">Add, edit, delete products and control visibility on the shop page.</p>
                  </div>
                  <button
                    onClick={() => { setShowAddProduct(true); setNewProduct({ product_id: "", product_name: "", price: "", original_price: "", description: "", category: "course", features: "" }); }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Product
                  </button>
                </div>

                {showAddProduct && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Add New Product</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product ID (unique)</label>
                        <input type="text" value={newProduct.product_id} onChange={e => setNewProduct(p => ({ ...p, product_id: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. my-new-course" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input type="text" value={newProduct.product_name} onChange={e => setNewProduct(p => ({ ...p, product_name: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" placeholder="My New Course" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs)</label>
                        <input type="number" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" placeholder="199" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (Rs)</label>
                        <input type="number" value={newProduct.original_price} onChange={e => setNewProduct(p => ({ ...p, original_price: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" placeholder="399" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900">
                          <option value="growth-kit">Growth Kit</option>
                          <option value="course">Course</option>
                          <option value="masterclass">Masterclass</option>
                          <option value="bundle">Bundle</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input type="text" value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900" placeholder="Short description" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
                        <textarea value={newProduct.features} onChange={e => setNewProduct(p => ({ ...p, features: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 h-24" placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={async () => {
                          if (!newProduct.product_id || !newProduct.product_name) { alert("Product ID and Name are required"); return; }
                          try {
                            const token = getAdminToken();
                            await fetch("/api/admin/product-settings", {
                              method: "POST",
                              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                              body: JSON.stringify({ productId: newProduct.product_id, productName: newProduct.product_name, price: parseFloat(newProduct.price) || 0, originalPrice: parseFloat(newProduct.original_price) || 0, description: newProduct.description, category: newProduct.category, features: newProduct.features, isVisible: true }),
                            });
                            setShowAddProduct(false);
                            loadDashboardData();
                          } catch (err) { console.error("Failed to add product", err); }
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" /> Save Product
                      </button>
                      <button onClick={() => setShowAddProduct(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center gap-2">
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {[
                    { id: "complete-growth-kit", name: "Complete Creator Growth Kit", price: 99, originalPrice: 199, category: "growth-kit", description: "Everything you need to grow from 0 to 10K followers" },
                    { id: "reels-mastery", name: "Instagram Reels Mastery Course", price: 197, originalPrice: 397, category: "course", description: "Learn the viral formula that gets millions of views" },
                    { id: "brand-masterclass", name: "Brand Collaboration Masterclass", price: 149, originalPrice: 299, category: "masterclass", description: "Get paid partnerships with top brands" },
                    { id: "youtube-mastery", name: "YouTube Mastery Course", price: 297, originalPrice: 597, category: "course", description: "Complete YouTube growth and monetization blueprint" },
                    { id: "facebook-posting-mastery", name: "Facebook Posting Mastery Course", price: 197, originalPrice: 397, category: "course", description: "Master Facebook organic reach and engagement" },
                    { id: "complete-bundle", name: "Complete Creator Bundle", price: 497, originalPrice: 997, category: "bundle", description: "Get ALL premium products for 70% OFF" },
                  ].concat(
                    dbProducts.filter(dp => !["complete-growth-kit", "reels-mastery", "brand-masterclass", "youtube-mastery", "facebook-posting-mastery", "complete-bundle"].includes(dp.product_id)).map(dp => ({
                      id: dp.product_id,
                      name: dp.product_name || dp.product_id,
                      price: dp.price || 0,
                      originalPrice: dp.original_price || 0,
                      category: dp.category || "course",
                      description: dp.description || "",
                    }))
                  ).map((product) => {
                    const isVisible = productSettings[product.id] !== false;
                    const dbProduct = dbProducts.find(dp => dp.product_id === product.id);
                    const displayName = dbProduct?.product_name || product.name;
                    const displayPrice = dbProduct?.price ?? product.price;
                    const displayOrigPrice = dbProduct?.original_price ?? product.originalPrice;
                    const displayDesc = dbProduct?.description || product.description;
                    const isEditing = editingProduct?.id === product.id;

                    return (
                      <div key={product.id} className={`rounded-lg border ${isVisible ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-300 opacity-70'} p-4`}>
                        {isEditing ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                                <input type="text" value={editingProduct.name} onChange={e => setEditingProduct((p: any) => ({ ...p, name: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900" />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                                <input type="text" value={editingProduct.description} onChange={e => setEditingProduct((p: any) => ({ ...p, description: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900" />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Price (Rs)</label>
                                <input type="number" value={editingProduct.price} onChange={e => setEditingProduct((p: any) => ({ ...p, price: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900" />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Original Price (Rs)</label>
                                <input type="number" value={editingProduct.originalPrice} onChange={e => setEditingProduct((p: any) => ({ ...p, originalPrice: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900" />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Features (one per line)</label>
                                <textarea value={editingProduct.features} onChange={e => setEditingProduct((p: any) => ({ ...p, features: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 h-20" />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={async () => {
                                  try {
                                    const token = getAdminToken();
                                    await fetch("/api/admin/product-settings", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                                      body: JSON.stringify({ productId: product.id, productName: editingProduct.name, price: parseFloat(editingProduct.price) || 0, originalPrice: parseFloat(editingProduct.originalPrice) || 0, description: editingProduct.description, category: editingProduct.category, features: editingProduct.features, isVisible }),
                                    });
                                    setEditingProduct(null);
                                    loadDashboardData();
                                  } catch (err) { console.error("Failed to save product", err); }
                                }}
                                className="bg-green-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1"
                              >
                                <Save className="w-3 h-3" /> Save
                              </button>
                              <button onClick={() => setEditingProduct(null)} className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm flex items-center gap-1">
                                <X className="w-3 h-3" /> Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <p className="font-medium text-gray-900">{displayName}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${product.category === 'growth-kit' ? 'bg-green-100 text-green-700' : product.category === 'course' ? 'bg-purple-100 text-purple-700' : product.category === 'masterclass' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>{product.category}</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{displayDesc}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-sm font-semibold text-gray-900">Rs {displayPrice}</span>
                                {displayOrigPrice > displayPrice && <span className="text-sm text-gray-400 line-through">Rs {displayOrigPrice}</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setEditingProduct({ id: product.id, name: displayName, price: displayPrice, originalPrice: displayOrigPrice, description: displayDesc, category: product.category, features: dbProduct?.features || "" })}
                                className="text-blue-600 hover:text-blue-800 p-1.5" title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (!confirm(`Are you sure you want to delete "${displayName}"?`)) return;
                                  try {
                                    const token = getAdminToken();
                                    await fetch("/api/admin/product-settings", {
                                      method: "DELETE",
                                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                                      body: JSON.stringify({ productId: product.id }),
                                    });
                                    loadDashboardData();
                                  } catch (err) { console.error("Failed to delete product", err); }
                                }}
                                className="text-red-500 hover:text-red-700 p-1.5" title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={async () => {
                                  const newValue = !isVisible;
                                  setProductSettings(prev => ({ ...prev, [product.id]: newValue }));
                                  try {
                                    const token = getAdminToken();
                                    await fetch("/api/admin/product-settings", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                                      body: JSON.stringify({ productId: product.id, isVisible: newValue }),
                                    });
                                  } catch (err) {
                                    setProductSettings(prev => ({ ...prev, [product.id]: isVisible }));
                                  }
                                }}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isVisible ? 'bg-green-500' : 'bg-gray-300'}`}
                                title={isVisible ? "Visible - Click to hide" : "Hidden - Click to show"}
                              >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isVisible ? 'translate-x-6' : 'translate-x-1'}`} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
