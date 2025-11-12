"use client";

import { Plus, Briefcase, CheckCircle2, Clock, XCircle, Calendar } from "lucide-react";

const applications = [
  { company: "Tech Solutions", position: "Frontend Developer", status: "interview", applied: "2024-01-15", nextStep: "Technical interview on Jan 25", color: "yellow" },
  { company: "Digital Hub", position: "React Developer", status: "applied", applied: "2024-01-20", nextStep: "Awaiting response", color: "blue" },
  { company: "StartupCo", position: "Full Stack Developer", status: "offer", applied: "2024-01-10", nextStep: "Review offer letter", color: "green" },
  { company: "WebTech", position: "Junior Developer", status: "rejected", applied: "2024-01-05", nextStep: "Move on", color: "red" },
];

const statusConfig = {
  applied: { icon: Clock, label: "Applied", color: "bg-blue-100 text-blue-700" },
  interview: { icon: Calendar, label: "Interview", color: "bg-yellow-100 text-yellow-700" },
  offer: { icon: CheckCircle2, label: "Offer", color: "bg-green-100 text-green-700" },
  rejected: { icon: XCircle, label: "Rejected", color: "bg-red-100 text-red-700" },
};

export default function ApplicationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Application Tracker</h1>
          <p className="text-gray-600 mt-2">Track all your job applications in one place</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold">
          <Plus size={20} />
          Add Application
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-gray-600 mb-1">Total Applications</div>
          <div className="text-3xl font-bold text-gray-900">{applications.length}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-gray-600 mb-1">Interviews</div>
          <div className="text-3xl font-bold text-yellow-600">
            {applications.filter(a => a.status === "interview").length}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-gray-600 mb-1">Offers</div>
          <div className="text-3xl font-bold text-green-600">
            {applications.filter(a => a.status === "offer").length}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-gray-600 mb-1">Response Rate</div>
          <div className="text-3xl font-bold text-primary-600">75%</div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app, index) => {
          const StatusIcon = statusConfig[app.status as keyof typeof statusConfig].icon;
          const statusClass = statusConfig[app.status as keyof typeof statusConfig].color;
          const statusLabel = statusConfig[app.status as keyof typeof statusConfig].label;

          return (
            <div key={index} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-coral-100 rounded-xl flex items-center justify-center text-xl font-bold text-primary-600">
                    {app.company.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{app.position}</h3>
                    <p className="text-gray-600 mb-2">{app.company}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        Applied {new Date(app.applied).toLocaleDateString()}
                      </span>
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold ${statusClass}`}>
                        <StatusIcon size={14} />
                        {statusLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 mb-2">Next Step</div>
                  <div className="text-sm text-gray-600">{app.nextStep}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

