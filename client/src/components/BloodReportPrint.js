import React from 'react';
import { Download, Printer } from 'lucide-react';

const BloodReportPrint = ({ report, onDownload, onPrint }) => {
  if (!report) return null;

  // Group tests by category
  const groupedTests = {};
  report.tests.forEach(test => {
    if (!groupedTests[test.category]) {
      groupedTests[test.category] = [];
    }
    groupedTests[test.category].push(test);
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // return (
  //   <div className="bg-white min-h-screen print:min-h-0">
  //     {/* Print/Download Controls - Hidden when printing */}
  //     <div className="print:hidden flex justify-end gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
  //       <button
  //         onClick={onPrint}
  //         className="btn-secondary flex items-center gap-2"
  //       >
  //         <Printer className="w-4 h-4" />
  //         Print Report
  //       </button>
  //       <button
  //         onClick={onDownload}
  //         className="btn-primary flex items-center gap-2"
  //       >
  //         <Download className="w-4 h-4" />
  //         Download PDF
  //       </button>
  //     </div>

  //     {/* Report Container */}
  //     <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none">
  //       {/* Header Section */}
  //       <div className="border-b-4 border-blue-800">
  //         <div className="flex justify-between items-start p-6">
  //           {/* Left Side - Logo and Company Info */}
  //           <div className="flex items-start gap-4">
  //             <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
  //               <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
  //                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  //               </svg>
  //             </div>
  //             <div>
  //               <h1 className="text-2xl font-bold text-green-600">SINDHU HOSPITAL</h1>
  //               <p className="text-sm text-gray-600">ലബോറട്ടറി</p>
  //               <p className="text-sm text-gray-600">Your Trusted Health Partner</p>
  //               <p className="text-sm text-gray-600">Mob: +91 1234567890</p>
  //               <p className="text-sm text-gray-600">Email: info@sindhuhospital.com</p>
  //             </div>
  //           </div>
            
  //           {/* Right Side - AC Logo */}
  //           <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
  //             AC
  //           </div>
  //         </div>
          
  //         {/* Blue Bar with Tagline */}
  //         <div className="bg-blue-800 text-white text-center py-2">
  //           <p className="font-medium">your trusted health partner</p>
  //         </div>
  //       </div>

  //       {/* Patient and Report Details */}
  //       <div className="p-6">
  //         <div className="grid grid-cols-2 gap-8">
  //           {/* Left Column */}
  //           <div className="space-y-3">
  //             <div className="flex">
  //               <span className="font-semibold text-gray-700 w-24">Name:</span>
  //               <span className="text-gray-900">{report.patient.name}</span>
  //             </div>
  //             <div className="flex">
  //               <span className="font-semibold text-gray-700 w-24">Age & Sex:</span>
  //               <span className="text-gray-900">{report.patient.age} yrs, {report.patient.gender}</span>
  //             </div>
  //             <div className="flex">
  //               <span className="font-semibold text-gray-700 w-24">Ref by:</span>
  //               <span className="text-gray-900">SINDHU MEDICARE</span>
  //             </div>
  //             <div className="flex">
  //               <span className="font-semibold text-gray-700 w-24">Outlet:</span>
  //               <span className="text-gray-900">-</span>
  //             </div>
  //             <div className="flex">
  //               <span className="font-semibold text-gray-700 w-24">Corporate:</span>
  //               <span className="text-gray-900">SINDHU MEDICARE</span>
  //             </div>
  //           </div>
            
  //           {/* Right Column */}
  //           <div className="space-y-3">
  //             <div className="flex">
  //               <span className="font-semibold text-gray-700 w-24">Visit ID:</span>
  //               <span className="text-gray-900 font-mono">{report.reportNumber}</span>
  //             </div>
  //             <div className="flex">
  //               <span className="font-semibold text-gray-700 w-24">Collected on:</span>
  //               <span className="text-gray-900">{formatDate(report.reportDate)} {formatTime(report.reportDate)}</span>
  //             </div>
  //             <div className="flex">
  //               <span className="font-semibold text-gray-700 w-24">Reported on:</span>
  //               <span className="text-gray-900">{formatDate(report.reportDate)} {formatTime(report.reportDate)}</span>
  //             </div>
  //           </div>
  //         </div>
          
  //         {/* Barcode Placeholder */}
  //         <div className="flex justify-end mt-4">
  //           <div className="w-32 h-16 bg-gray-200 border-2 border-dashed border-gray-400 rounded flex items-center justify-center">
  //             <span className="text-xs text-gray-500 text-center">Barcode<br/>Placeholder</span>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Test Results Section */}
  //       <div className="px-6 pb-6">
  //         {Object.entries(groupedTests).map(([category, tests]) => (
  //           <div key={category} className="mb-6">
  //             {/* Category Header */}
  //             <div className="bg-gray-100 px-4 py-2 border-l-4 border-blue-600">
  //               <h3 className="font-semibold text-gray-800 text-lg">{category}</h3>
  //             </div>
              
  //             {/* Tests Table */}
  //             <div className="border border-gray-200 rounded-b-lg overflow-hidden">
  //               <table className="w-full">
  //                 <thead className="bg-gray-50">
  //                   <tr>
  //                     <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-700">Test Description</th>
  //                     <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-700">Observed Value</th>
  //                     <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-700">Reference Range & Units</th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   {tests.map((test, index) => (
  //                     <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
  //                       <td className="p-3 border-b border-gray-200 text-gray-900 font-medium">
  //                         {test.testName}
  //                       </td>
  //                       <td className="p-3 border-b border-gray-200">
  //                         <span className={`font-semibold ${test.isAbnormal ? 'text-red-600' : 'text-gray-900'}`}>
  //                           {test.resultValue} {test.unit}
  //                         </span>
  //                       </td>
  //                       <td className="p-3 border-b border-gray-200 text-gray-600">
  //                         {test.normalRange} {test.unit}
  //                       </td>
  //                     </tr>
  //                   ))}
  //                 </tbody>
  //               </table>
  //             </div>
  //           </div>
  //         ))}
  //       </div>

  //       {/* Footer Section */}
  //       <div className="border-t-2 border-gray-200 p-6">
  //         <div className="flex justify-between items-end">
  //           {/* Left Side - Issued By */}
  //           <div>
  //             <p className="text-sm text-gray-600">Issued By:</p>
  //             <p className="font-medium text-gray-900">Lab Technician</p>
  //             <p className="text-sm text-gray-600">SINDHU HOSPITAL</p>
  //           </div>
            
  //           {/* Right Side - Doctor Signature */}
  //           <div className="text-right">
  //             <div className="w-32 h-16 border-b-2 border-gray-400 mb-2"></div>
  //             <p className="text-sm font-medium text-gray-900">Clinical Pathologist</p>
  //             <p className="text-sm text-gray-600">Dr. Medical Director</p>
  //             <p className="text-xs text-gray-500">MBBS, MD, Reg.No. XXXXXX</p>
  //           </div>
  //         </div>
          
  //         {/* End of Report */}
  //         <div className="text-center mt-8">
  //           <p className="text-sm font-medium text-gray-500">** End of report **</p>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );


return (
  <div className="bg-white min-h-screen print:min-h-0">
    {/* Print/Download Controls - Hidden when printing */}


    {/* Report Container */}
    <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none">
      {/* Header Section */}
      <div className="border-b-4 border-blue-800">
        <div className="flex justify-between items-start p-6">
          {/* Left Side - Logo and Company Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-600">SINDHU HOSPITAL</h1>
              <p className="text-sm text-gray-600">ലബോറട്ടറി</p>
              <p className="text-sm text-gray-600">Your Trusted Health Partner</p>
              <p className="text-sm text-gray-600">Mob: +91 1234567890</p>
              <p className="text-sm text-gray-600">Email: info@sindhuhospital.com</p>
            </div>
          </div>
          
          {/* Right Side - AC Logo */}
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            AC
          </div>
        </div>
        
        {/* Blue Bar with Tagline */}
        <div className="bg-blue-800 text-white text-center py-2">
          <p className="font-medium">your trusted health partner</p>
        </div>
      </div>

      {/* Patient and Report Details */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-3">
            <div className="flex">
              <span className="font-semibold text-gray-700 w-24">Name:</span>
              <span className="text-gray-900">{report.patient.name}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-700 w-24">Age & Sex:</span>
              <span className="text-gray-900">{report.patient.age} yrs, {report.patient.gender}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-700 w-24">Ref by:</span>
              <span className="text-gray-900">SINDHU MEDICARE</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-700 w-24">Outlet:</span>
              <span className="text-gray-900">-</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-700 w-24">Corporate:</span>
              <span className="text-gray-900">SINDHU MEDICARE</span>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-3">
            <div className="flex">
              <span className="font-semibold text-gray-700 w-24">Visit ID:</span>
              <span className="text-gray-900 font-mono">{report.reportNumber}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-700 w-24">Collected on:</span>
              <span className="text-gray-900">{formatDate(report.reportDate)} {formatTime(report.reportDate)}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-700 w-24">Reported on:</span>
              <span className="text-gray-900">{formatDate(report.reportDate)} {formatTime(report.reportDate)}</span>
            </div>
          </div>
        </div>
        
        {/* Barcode Placeholder */}
        <div className="flex justify-end mt-4">
          <div className="w-32 h-16 bg-gray-200 border-2 border-dashed border-gray-400 rounded flex items-center justify-center">
            <span className="text-xs text-gray-500 text-center">Barcode<br/>Placeholder</span>
          </div>
        </div>
      </div>

      {/* Test Results Section */}
      <div className="px-6 pb-6">
        {Object.entries(groupedTests).map(([category, tests]) => (
          <div key={category} className="mb-6">
            {/* Category Header */}
            <div className="bg-gray-100 px-4 py-2 border-l-4 border-blue-600">
              <h3 className="font-semibold text-gray-800 text-lg">{category}</h3>
            </div>
            
            {/* Tests Table */}
            <div className="border border-gray-200 rounded-b-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-700">Test Description</th>
                    <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-700">Observed Value</th>
                    <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-700">Reference Range & Units</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border-b border-gray-200 text-gray-900 font-medium">
                        {test.testName}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        <span className={`font-semibold ${test.isAbnormal ? 'text-red-600' : 'text-gray-900'}`}>
                          {test.resultValue} {test.unit}
                        </span>
                      </td>
                      <td className="p-3 border-b border-gray-200 text-gray-600">
                        {test.normalRange} {test.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <div className="border-t-2 border-gray-200 p-6">
        <div className="flex justify-between items-end">
          {/* Left Side - Issued By */}
          <div>
            <p className="text-sm text-gray-600">Issued By:</p>
            <p className="font-medium text-gray-900">Lab Technician</p>
            <p className="text-sm text-gray-600">SINDHU HOSPITAL</p>
          </div>
          
          {/* Right Side - Doctor Signature */}
          <div className="text-right">
            <div className="w-32 h-16 border-b-2 border-gray-400 mb-2"></div>
            <p className="text-sm font-medium text-gray-900">Clinical Pathologist</p>
            <p className="text-sm text-gray-600">Dr. Medical Director</p>
            <p className="text-xs text-gray-500">MBBS, MD, Reg.No. XXXXXX</p>
          </div>
        </div>
        
        {/* End of Report */}
        <div className="text-center mt-8">
          <p className="text-sm font-medium text-gray-500">** End of report **</p>
        </div>
      </div>
    </div>
  </div>
);


};

export default BloodReportPrint;
