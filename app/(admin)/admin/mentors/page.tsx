"use client";

import { useEffect, useState } from "react";
import { Users, CheckCircle2, XCircle, Clock, Plus } from "lucide-react";

export default function AdminMentorsPage() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    skills: "",
    roles: "",
    hourlyRate: "",
    yearsOfExperience: "",
  });

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await fetch("/api/admin/mentors");
      if (response.ok) {
        const data = await response.json();
        setMentors(data.mentors || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    
    try {
      const mentorData = {
        ...formData,
        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
        roles: formData.roles.split(",").map(r => r.trim()).filter(Boolean),
        hourlyRate: parseFloat(formData.hourlyRate),
        yearsOfExperience: parseInt(formData.yearsOfExperience),
      };

      const response = await fetch("/api/admin/mentors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mentorData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Mentor created successfully! Default password: mentor123");
        setShowAddForm(false);
        setFormData({ name: "", email: "", bio: "", skills: "", roles: "", hourlyRate: "", yearsOfExperience: "" });
        await fetchMentors(); // Refresh the list
        setTimeout(() => setMessage(""), 5000);
      } else {
        setMessage(`❌ Error: ${data.error || "Failed to create mentor"}`);
      }
    } catch (error) {
      console.error("Error creating mentor:", error);
      setMessage("❌ Error: Failed to create mentor");
    } finally {
      setSubmitting(false);
    }
  };

  const updateMentorStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/mentors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchMentors();
      }
    } catch (error) {
      console.error("Error updating mentor:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Mentors</h1>
          <p className="text-gray-600 mt-2">Review, approve, and manage mentor accounts</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
        >
          <Plus size={20} />
          Add Mentor
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl ${
          message.includes("✅") ? "bg-green-50 text-green-700 border-2 border-green-200" : "bg-red-50 text-red-700 border-2 border-red-200"
        }`}>
          {message}
        </div>
      )}

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{mentors.length}</div>
          <div className="text-sm text-gray-600">Total Mentors</div>
          <div className="mt-2 text-xs text-blue-600 font-semibold">All Time</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{mentors.filter(m => m.status === "active").length}</div>
          <div className="text-sm text-gray-600">Active Mentors</div>
          <div className="mt-2 text-xs text-green-600 font-semibold">Available</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{mentors.filter(m => m.verified).length}</div>
          <div className="text-sm text-gray-600">Verified</div>
          <div className="mt-2 text-xs text-purple-600 font-semibold">Trusted</div>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Add New Mentor</h3>
          <p className="text-sm text-gray-600 mb-6">
            A user account will be created with default password: <code className="bg-gray-100 px-2 py-1 rounded text-primary-600 font-semibold">mentor123</code>
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Dr. John Smith" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="mentor@example.com" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bio *</label>
              <textarea required value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Experienced software engineer specializing in..." className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none" rows={3} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skills (comma-separated) *</label>
                <input type="text" required value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder="React, TypeScript, Node.js" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Roles (comma-separated) *</label>
                <input type="text" required value={formData.roles} onChange={(e) => setFormData({ ...formData, roles: e.target.value })} placeholder="Frontend Developer, React Expert" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate (৳) *</label>
                <input type="number" required value={formData.hourlyRate} onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })} placeholder="2000" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience *</label>
                <input type="number" required value={formData.yearsOfExperience} onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })} placeholder="5" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                type="submit" 
                disabled={submitting}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  "Add Mentor"
                )}
              </button>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)} 
                disabled={submitting}
                className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mentors List */}
      <div className="grid gap-6">
        {mentors.map((mentor) => (
          <div key={mentor._id} className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-purple-600">
                  {mentor.name.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{mentor.name}</h3>
                  <p className="text-gray-600 mb-3">{mentor.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {mentor.skills.slice(0, 5).map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>৳{mentor.hourlyRate}/hour</span>
                    <span>•</span>
                    <span>{mentor.sessionsCompleted} sessions</span>
                    <span>•</span>
                    <span>Rating: {mentor.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  mentor.status === "active" ? "bg-green-100 text-green-700" :
                  mentor.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {mentor.status.toUpperCase()}
                </span>
                {mentor.verified && (
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold text-center">
                    Verified
                  </span>
                )}
                {mentor.status === "pending" && (
                  <div className="flex flex-col gap-2 mt-2">
                    <button
                      onClick={() => updateMentorStatus(mentor._id, "active")}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateMentorStatus(mentor._id, "inactive")}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {mentors.length === 0 && !loading && (
        <div className="bg-white rounded-3xl p-12 shadow-lg text-center">
          <Users size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No mentors yet</h3>
          <p className="text-gray-600">Add your first mentor to get started</p>
        </div>
      )}
    </div>
  );
}

