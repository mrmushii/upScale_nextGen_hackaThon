"use client";

import { useState, useEffect } from "react";
import { Plus, Briefcase, CheckCircle2, Clock, XCircle, Calendar, Trash2 } from "lucide-react";

const statusConfig = {
  applied: { icon: Clock, label: "Applied", color: "bg-blue-100 text-blue-700" },
  interview: { icon: Calendar, label: "Interview", color: "bg-yellow-100 text-yellow-700" },
  offer: { icon: CheckCircle2, label: "Offer", color: "bg-green-100 text-green-700" },
  rejected: { icon: XCircle, label: "Rejected", color: "bg-red-100 text-red-700" },
  accepted: { icon: CheckCircle2, label: "Accepted", color: "bg-purple-100 text-purple-700" },
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    externalLink: "",
    notes: "",
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/applications");
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowAddForm(false);
        setFormData({ companyName: "", position: "", externalLink: "", notes: "" });
        fetchApplications();
      }
    } catch (error) {
      console.error("Error creating application:", error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchApplications();
      }
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  const deleteApplication = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchApplications();
      }
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Application Tracker
          </h1>
          <p className="text-gray-600 mt-2">Track all your job applications in one place</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
        >
          <Plus size={20} />
          Add Application
        </button>
      </div>

      {/* Add Application Form */}
      {showAddForm && (
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Application</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                  placeholder="Tech Solutions Ltd"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Position *
                </label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                  placeholder="Frontend Developer"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Application URL (Optional)
              </label>
              <input
                type="url"
                value={formData.externalLink}
                onChange={(e) =>
                  setFormData({ ...formData, externalLink: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                placeholder="https://company.com/jobs/123"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                rows={3}
                placeholder="Add any notes or reminders..."
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
              >
                Add Application
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-gray-600 mb-1">Total Applications</div>
          <div className="text-3xl font-bold text-gray-900">{applications.length}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-gray-600 mb-1">Interviews</div>
          <div className="text-3xl font-bold text-yellow-600">
            {applications.filter((a) => a.status === "interview").length}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-gray-600 mb-1">Offers</div>
          <div className="text-3xl font-bold text-green-600">
            {applications.filter((a) => a.status === "offer").length}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-gray-600 mb-1">Response Rate</div>
          <div className="text-3xl font-bold text-primary-600">
            {applications.length > 0
              ? Math.round(
                  ((applications.filter((a) => a.status !== "applied").length) /
                    applications.length) *
                    100
                )
              : 0}
            %
          </div>
        </div>
      </div>

      {/* Applications List */}
      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => {
            const StatusIcon = statusConfig[app.status as keyof typeof statusConfig].icon;
            const statusClass = statusConfig[app.status as keyof typeof statusConfig].color;
            const statusLabel = statusConfig[app.status as keyof typeof statusConfig].label;

            return (
              <div
                key={app._id}
                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-coral-100 rounded-xl flex items-center justify-center text-xl font-bold text-primary-600">
                      {app.companyName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {app.position}
                      </h3>
                      <p className="text-gray-600 mb-2">{app.companyName}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                        <span
                          className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold ${statusClass}`}
                        >
                          <StatusIcon size={14} />
                          {statusLabel}
                        </span>
                      </div>
                      {app.notes && (
                        <p className="text-sm text-gray-600 mt-2">📝 {app.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app._id, e.target.value)}
                      className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm font-semibold"
                    >
                      <option value="applied">Applied</option>
                      <option value="interview">Interview</option>
                      <option value="offer">Offer</option>
                      <option value="rejected">Rejected</option>
                      <option value="accepted">Accepted</option>
                    </select>
                    <button
                      onClick={() => deleteApplication(app._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 shadow-lg text-center">
          <Briefcase size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-600 mb-6">
            Start tracking your job applications to stay organized
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
          >
            <Plus size={20} />
            Add Your First Application
          </button>
        </div>
      )}
    </div>
  );
}
