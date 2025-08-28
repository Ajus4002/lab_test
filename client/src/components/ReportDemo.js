import React, { useRef } from 'react';
import BloodReportPrint from './BloodReportPrint';
import html2pdf from 'html2pdf.js';

const ReportDemo = () => {
  const reportRef = useRef(null);
  
  // Sample report data for demonstration
  const sampleReport = {
    reportNumber: 'BR20250116001',
    reportDate: '2025-01-16T13:14:00',
    patient: {
      name: 'Mrs. KARTHIKA',
      age: 30,
      gender: 'Female',
      phone: '+91 9876543210',
      email: 'karthika@example.com'
    },
    tests: [
      {
        category: 'BIOCHEMISTRY',
        testName: 'Total Cholesterol',
        resultValue: '213',
        unit: 'mg/dL',
        normalRange: '130 - 200',
        isAbnormal: true
      },
      {
        category: 'BIOCHEMISTRY',
        testName: 'HDL Cholesterol',
        resultValue: '45',
        unit: 'mg/dL',
        normalRange: '40 - 60',
        isAbnormal: false
      },
      {
        category: 'BIOCHEMISTRY',
        testName: 'LDL Cholesterol',
        resultValue: '140',
        unit: 'mg/dL',
        normalRange: '70 - 130',
        isAbnormal: true
      },
      {
        category: 'HEMATOLOGY',
        testName: 'Hemoglobin',
        resultValue: '12.5',
        unit: 'g/dL',
        normalRange: '12.0 - 15.5',
        isAbnormal: false
      },
      {
        category: 'HEMATOLOGY',
        testName: 'White Blood Cells',
        resultValue: '7.2',
        unit: 'K/μL',
        normalRange: '4.5 - 11.0',
        isAbnormal: false
      },
      {
        category: 'DIABETES',
        testName: 'Fasting Blood Sugar',
        resultValue: '95',
        unit: 'mg/dL',
        normalRange: '70 - 100',
        isAbnormal: false
      },
      {
        category: 'DIABETES',
        testName: 'HbA1c',
        resultValue: '5.8',
        unit: '%',
        normalRange: '4.0 - 5.6',
        isAbnormal: true
      }
    ],
    status: 'completed'
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (reportRef.current) {
      const element = reportRef.current;
      
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `demo-blood-report-${sampleReport.reportNumber}.pdf`,
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

      html2pdf().set(opt).from(element).save().then(() => {
        alert('PDF downloaded successfully!');
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Blood Report Style Demo
          </h1>
          <p className="text-lg text-gray-600">
            This demonstrates the new Aswas Diagnostics-style blood report format
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={handlePrint}
              className="btn-primary flex items-center gap-2"
            >
              Print Demo Report
            </button>
            <button
              onClick={handleDownload}
              className="btn-secondary flex items-center gap-2"
            >
              Download PDF (Print Style)
            </button>
          </div>
        </div>
        
        <div ref={reportRef}>
          <BloodReportPrint 
            report={sampleReport}
            onPrint={handlePrint}
            onDownload={handleDownload}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportDemo;
