"use client";

import { useEffect, useState } from "react";
import { Users, Calendar, DollarSign, MessageSquare, Mail, User } from "lucide-react";

interface Student {
  student: {
    _id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  totalEarnings: number;
  lastSessionDate: string | null;
  nextSessionDate: string | null;
}

export default function MentorStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/mentor/students");
      const data = await response.json();
      setStudents(data.students || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
        <p className="text-gray-600 mt-2">View and manage your students</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{students.length}</div>
          <div className="text-sm text-gray-600">Total Students</div>
          <div className="mt-2 text-xs text-blue-600 font-semibold">All Time</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-gray-900">
            {students.reduce((sum, s) => sum + s.completedSessions, 0)}
          </div>
          <div className="text-sm text-gray-600">Completed Sessions</div>
          <div className="mt-2 text-xs text-green-600 font-semibold">Finished</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-gray-900">
            ৳{students.reduce((sum, s) => sum + s.totalEarnings, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Earnings</div>
          <div className="mt-2 text-xs text-primary-600 font-semibold">From Students</div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Students</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No students yet</h3>
            <p className="text-gray-600">Students will appear here once they book sessions with you.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {students.map((studentData) => (
              <div
                key={studentData.student._id}
                className="border-2 border-gray-100 rounded-xl p-6 hover:border-primary-300 transition cursor-pointer"
                onClick={() => setSelectedStudent(selectedStudent?.student._id === studentData.student._id ? null : studentData)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-coral-500 flex items-center justify-center text-white text-2xl font-bold">
                    {studentData.student.avatar ? (
                      <img
                        src={studentData.student.avatar}
                        alt={studentData.student.fullName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      studentData.student.fullName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {studentData.student.fullName}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                      <Mail size={14} />
                      <span>{studentData.student.email}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-lg font-bold text-blue-600">{studentData.totalSessions}</div>
                        <div className="text-xs text-gray-600">Total Sessions</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-lg font-bold text-green-600">{studentData.completedSessions}</div>
                        <div className="text-xs text-gray-600">Completed</div>
                      </div>
                    </div>

                    {studentData.totalEarnings > 0 && (
                      <div className="bg-primary-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-primary-600" />
                          <div>
                            <div className="text-sm font-bold text-primary-600">
                              ৳{studentData.totalEarnings.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-600">Total Earnings</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {studentData.nextSessionDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        <span>
                          Next: {new Date(studentData.nextSessionDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric"
                          })}
                        </span>
                      </div>
                    )}

                    {studentData.lastSessionDate && !studentData.nextSessionDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        <span>
                          Last: {new Date(studentData.lastSessionDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric"
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedStudent?.student._id === studentData.student._id && (
                  <div className="mt-4 pt-4 border-t-2 border-gray-100">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Upcoming Sessions:</span>
                        <span className="font-semibold text-gray-900">{studentData.upcomingSessions}</span>
                      </div>
                      {studentData.nextSessionDate && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Next Session:</span>
                          <span className="font-semibold text-gray-900">
                            {new Date(studentData.nextSessionDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                      )}
                      {studentData.lastSessionDate && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Last Session:</span>
                          <span className="font-semibold text-gray-900">
                            {new Date(studentData.lastSessionDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

