import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  Download, 
  ArrowLeft, 
  User, 
  Calendar, 
  FileText,
  AlertTriangle,
  Eye,
  FileText as FileTextIcon
} from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import BloodReportPrint from '../components/BloodReportPrint';
import html2pdf from 'html2pdf.js';

const ReportPreview = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('detailed'); // 'detailed' or 'print'
  const reportRef = useRef(null);

  useEffect(() => {
    fetchReport();
  }, [id]);

  useEffect(() => {
    // Check if print view is requested via URL parameter
    const viewParam = searchParams.get('view');
    if (viewParam === 'print') {
      setViewMode('print');
    }
  }, [searchParams]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/blood-reports/${id}`);
      setReport(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch report details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // If we're in print view, generate PDF from the current view
      if (viewMode === 'print' && reportRef.current) {
        const element = reportRef.current;
        
        const opt = {
          margin: [0.5, 0.5, 0.5, 0.5],
          filename: `blood-report-${report.reportNumber}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true
          },
          jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'portrait' 
          }
        };

        // Temporarily show the print view for PDF generation
        const originalViewMode = viewMode;
        setViewMode('print');
        
        // Wait for the view to update, then generate PDF
        setTimeout(() => {
          html2pdf().set(opt).from(element).save().then(() => {
            toast.success('PDF downloaded successfully');
            // Restore original view mode
            setViewMode(originalViewMode);
          });
        }, 100);
      } else {
        // Fallback to backend PDF generation
        const response = await api.get(`/api/blood-reports/${id}/pdf`, {
          responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `blood-report-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        toast.success('PDF downloaded successfully');
      }
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Report not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="print:hidden flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/blood-reports"
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blood Report</h1>
            <p className="text-gray-600">Report #{report.reportNumber}</p>
          </div>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'detailed'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Detailed View
            </button>
            <button
              onClick={() => setViewMode('print')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'print'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileTextIcon className="w-4 h-4 inline mr-2" />
              Print Style
            </button>
          </div>
          
          <button
            onClick={handleDownloadPDF}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Conditional Rendering based on view mode */}
      {viewMode === 'print' ? (
        <div ref={reportRef}>
          <BloodReportPrint 
            report={report} 
            onDownload={handleDownloadPDF}
            onPrint={handlePrint}
          />
        </div>
      ) : (
        <>
          {/* Report Header */}
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Patient Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Name:</span>
                    <span className="ml-2 text-gray-900">{report.patient.name}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Age:</span>
                    <span className="ml-2 text-gray-900">{report.patient.age} years</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Gender:</span>
                    <span className="ml-2 text-gray-900 capitalize">{report.patient.gender}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Phone:</span>
                    <span className="ml-2 text-gray-900">{report.patient.phone}</span>
                  </div>
                  {report.patient.email && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Email:</span>
                      <span className="ml-2 text-gray-900">{report.patient.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Report Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Report Number:</span>
                    <span className="ml-2 text-gray-900 font-mono">{report.reportNumber}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Report Date:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(report.reportDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      report.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : report.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

              {/* Test Results */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Test Results
          </h3>
          
          <div className="space-y-6">
            {/* Group tests by category */}
            {(() => {
              const groupedTests = {};
              report.tests.forEach(test => {
                if (!groupedTests[test.category]) {
                  groupedTests[test.category] = [];
                }
                groupedTests[test.category].push(test);
              });

              return Object.entries(groupedTests).map(([category, tests]) => (
                <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900">{category}</h4>
                  </div>
                  
                  <div className="overflow-hidden">
                    <table className="table">
                      <thead className="table-header">
                        <tr>
                          <th className="table-header-cell">Test Name</th>
                          <th className="table-header-cell">Result</th>
                          <th className="table-header-cell">Unit</th>
                          <th className="table-header-cell">Normal Range</th>
                          <th className="table-header-cell">Reference</th>
                          <th className="table-header-cell">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="table-body">
                        {tests.map((test, index) => (
                          <tr key={index} className="table-row">
                            <td className="table-cell font-medium">{test.testName}</td>
                            <td className="table-cell">
                              <div className="flex items-center gap-2">
                                <span className={test.isAbnormal ? 'text-red-600 font-semibold' : ''}>
                                  {test.resultValue}
                                </span>
                                {test.isAbnormal && (
                                  <AlertTriangle className="w-4 h-4 text-red-500" />
                                )}
                              </div>
                            </td>
                            <td className="table-cell">{test.unit || '-'}</td>
                            <td className="table-cell">{test.normalRange || '-'}</td>
                            <td className="table-cell">{test.referenceValue || '-'}</td>
                            <td className="table-cell">{test.notes || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Doctor Notes */}
        {report.doctorNotes && (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Doctor Notes</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{report.doctorNotes}</p>
            </div>
          </div>
        )}

        {/* Report Summary */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Report Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{report.tests.length}</div>
              <div className="text-sm text-blue-600">Total Tests</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {report.tests.filter(test => !test.isAbnormal).length}
              </div>
              <div className="text-sm text-green-600">Normal Results</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {report.tests.filter(test => test.isAbnormal).length}
              </div>
              <div className="text-sm text-red-600">Abnormal Results</div>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default ReportPreview;

