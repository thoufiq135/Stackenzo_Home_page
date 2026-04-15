import { useState, useEffect } from "react";
import { FileText, Download, Eye, Filter } from "lucide-react";

function ResumeAdmin() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchResumes();
  }, [statusFilter]);

  const fetchResumes = async () => {
    try {
      const url = statusFilter 
        ? `http://localhost:5000/api/resumes?status=${statusFilter}`
        : "http://localhost:5000/api/resumes";
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setResumes(data.data);
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const viewResume = (id) => {
    window.open(`http://localhost:5000/api/resumes/${id}/view`, '_blank');
  };

  const downloadResume = async (id, filename) => {
    try {
      const response = await fetch(`http://localhost:5000/api/resumes/${id}/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading resume:", error);
      alert("Failed to download resume");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/resumes/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        fetchResumes();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-olive green-600",
      reviewed: "bg-blue-600",
      shortlisted: "bg-olive green-600",
      rejected: "bg-red-600"
    };
    return colors[status] || "bg-gray-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-xl">Loading resumes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-olive green-400">Resume Submissions</h1>
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-olive green-400"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Position</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Experience</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Resume Link</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {resumes.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-8 text-center text-gray-400">
                      No resume submissions found
                    </td>
                  </tr>
                ) : (
                  resumes.map((resume) => (
                    <tr key={resume.id} className="hover:bg-gray-800 transition">
                      <td className="px-6 py-4 text-sm text-white">{resume.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{resume.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{resume.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {resume.position || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {resume.experience || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={resume.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline text-sm break-all"
                        >
                          {resume.resume_url}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={resume.status}
                          onChange={(e) => updateStatus(resume.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(resume.status)} cursor-pointer`}
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {new Date(resume.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewResume(resume.id)}
                            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition text-sm font-semibold"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => downloadResume(resume.id, resume.resume_filename)}
                            className="flex items-center gap-2 px-3 py-1 bg-olive green-400 text-black rounded-lg hover:bg-olive green-300 transition text-sm font-semibold"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          Total Submissions: {resumes.length}
        </div>
      </div>
    </div>
  );
}

export default ResumeAdmin;
