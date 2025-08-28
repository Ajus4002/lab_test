const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');
const BloodReport = require('../models/BloodReport');
const BloodReportTest = require('../models/BloodReportTest');
const Patient = require('../models/Patient');

class BloodReportService {
  async createBloodReport(reportData) {
    try {
      // Create blood report
      const bloodReport = await BloodReport.create({
        patientId: reportData.patientId,
        reportDate: reportData.reportDate || new Date(),
        doctorNotes: reportData.doctorNotes,
        status: 'completed'
      });

      // Create blood report tests
      if (reportData.tests && Array.isArray(reportData.tests)) {
        const testPromises = reportData.tests.map(test => 
          BloodReportTest.create({
            reportId: bloodReport.id,
            testName: test.testName,
            resultValue: test.resultValue,
            unit: test.unit,
            normalRange: test.normalRange,
            referenceValue: test.referenceValue,
            isAbnormal: test.isAbnormal,
            notes: test.notes
          })
        );

        await Promise.all(testPromises);
      }

      // Fetch the complete report with patient and tests
      const completeReport = await this.getBloodReportById(bloodReport.id);
      
      return {
        success: true,
        message: 'Blood report created successfully',
        data: completeReport.data
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllBloodReports(filters = {}, page = 1, limit = 10) {
    try {
      const whereClause = { isActive: true };
      
      // Apply filters
      if (filters.patientName) {
        whereClause['$patient.name$'] = { [Op.iLike]: `%${filters.patientName}%` };
      }
      
      if (filters.patientPhone) {
        whereClause['$patient.phone$'] = { [Op.iLike]: `%${filters.patientPhone}%` };
      }
      
      if (filters.dateRange) {
        const { startDate, endDate } = filters.dateRange;
        if (startDate && endDate) {
          whereClause.reportDate = {
            [Op.between]: [startDate, endDate]
          };
        }
      }
      
      if (filters.status) {
        whereClause.status = filters.status;
      }

      const offset = (page - 1) * limit;
      
      const { count, rows } = await BloodReport.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Patient,
            as: 'patient',
            attributes: ['id', 'name', 'age', 'gender', 'phone']
          }
        ],
        order: [['reportDate', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        success: true,
        data: {
          reports: rows,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async getBloodReportById(reportId) {
    try {
      const report = await BloodReport.findByPk(reportId, {
        include: [
          {
            model: Patient,
            as: 'patient',
            attributes: ['id', 'name', 'age', 'gender', 'phone', 'email', 'address']
          },
          {
            model: BloodReportTest,
            as: 'tests',
            order: [['testName', 'ASC']]
          }
        ]
      });
      
      if (!report) {
        throw new Error('Blood report not found');
      }

      return {
        success: true,
        data: report
      };
    } catch (error) {
      throw error;
    }
  }

  async updateBloodReport(reportId, updateData) {
    try {
      const report = await BloodReport.findByPk(reportId);
      
      if (!report) {
        throw new Error('Blood report not found');
      }

      // Update report details
      await report.update({
        reportDate: updateData.reportDate,
        doctorNotes: updateData.doctorNotes,
        status: updateData.status
      });

      // Update tests if provided
      if (updateData.tests && Array.isArray(updateData.tests)) {
        // Delete existing tests
        await BloodReportTest.destroy({
          where: { reportId: reportId }
        });

        // Create new tests
        const testPromises = updateData.tests.map(test => 
          BloodReportTest.create({
            reportId: reportId,
            testName: test.testName,
            resultValue: test.resultValue,
            unit: test.unit,
            normalRange: test.normalRange,
            referenceValue: test.referenceValue,
            isAbnormal: test.isAbnormal,
            notes: test.notes
          })
        );

        await Promise.all(testPromises);
      }

      // Fetch the updated report
      const updatedReport = await this.getBloodReportById(reportId);
      
      return {
        success: true,
        message: 'Blood report updated successfully',
        data: updatedReport.data
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteBloodReport(reportId) {
    try {
      const report = await BloodReport.findByPk(reportId);
      
      if (!report) {
        throw new Error('Blood report not found');
      }

      // Soft delete - set isActive to false
      await report.update({ isActive: false });
      
      return {
        success: true,
        message: 'Blood report deleted successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  // async generatePDF(reportId) {
  //   try {
  //     const report = await this.getBloodReportById(reportId);
  //     if (!report.success) {
  //       throw new Error('Report not found');
  //     }

  //     const doc = new PDFDocument({
  //       size: 'A4',
  //       margin: 50
  //     });

  //     // Add header
  //     doc.fontSize(24)
  //        .text('Blood Test Report', { align: 'center' })
  //        .moveDown();

  //     // Add report details
  //     doc.fontSize(14)
  //        .text(`Report Number: ${report.data.reportNumber}`)
  //        .text(`Report Date: ${new Date(report.data.reportDate).toLocaleDateString()}`)
  //        .moveDown();

  //     // Add patient details
  //     doc.fontSize(16)
  //        .text('Patient Information', { underline: true })
  //        .moveDown();
      
  //     doc.fontSize(12)
  //        .text(`Name: ${report.data.patient.name}`)
  //        .text(`Age: ${report.data.patient.age}`)
  //        .text(`Gender: ${report.data.patient.gender}`)
  //        .text(`Phone: ${report.data.patient.phone}`)
  //        .moveDown();

  //     // Add test results
  //     doc.fontSize(16)
  //        .text('Test Results', { underline: true })
  //        .moveDown();

  //     // Create table headers
  //     const tableTop = doc.y;
  //     const tableLeft = 50;
  //     const colWidth = 120;
      
  //     doc.fontSize(10)
  //        .text('Test Name', tableLeft, tableTop)
  //        .text('Result', tableLeft + colWidth, tableTop)
  //        .text('Unit', tableLeft + colWidth * 2, tableTop)
  //        .text('Normal Range', tableLeft + colWidth * 3, tableTop);

  //     // Add test data
  //     let currentY = tableTop + 20;
  //     report.data.tests.forEach(test => {
  //       if (currentY > 700) {
  //         doc.addPage();
  //         currentY = 50;
  //       }
        
  //       doc.fontSize(10)
  //          .text(test.testName, tableLeft, currentY)
  //          .text(test.resultValue, tableLeft + colWidth, currentY)
  //          .text(test.unit || '-', tableLeft + colWidth * 2, currentY)
  //          .text(test.normalRange || '-', tableLeft + colWidth * 3, currentY);
        
  //       currentY += 15;
  //     });

  //     // Add doctor notes if available
  //     if (report.data.doctorNotes) {
  //       doc.addPage();
  //       doc.fontSize(16)
  //          .text('Doctor Notes', { underline: true })
  //          .moveDown();
        
  //       doc.fontSize(12)
  //          .text(report.data.doctorNotes);
  //     }

  //     doc.end();
      
  //     return doc;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async generatePDF(reportId) {
  try {
    const report = await this.getBloodReportById(reportId);
    if (!report.success) {
      throw new Error("Report not found");
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    // Header Title
    doc.fontSize(20).font("Helvetica-Bold")
      .text("Lab Report", { align: "center" })
      .moveDown(2);

    // Patient Info Section
    doc.fontSize(12).font("Helvetica");
    doc.text(`Name : ${report.data.patient.name}`, { continued: true })
       .text(`   Visit ID : ${report.data.reportNumber}`);
    doc.text(`Age & Sex : ${report.data.patient.age} yrs, ${report.data.patient.gender}`, { continued: true })
       .text(`   Collected on : ${new Date(report.data.reportDate).toLocaleString()}`);
    doc.text(`Ref by : ${report.data.refBy || "-"}`, { continued: true })
       .text(`   Reported on : ${new Date().toLocaleString()}`);
    doc.text(`Outlet : ${report.data.outlet || "-"}`, { continued: true })
       .text(`   Corporate : ${report.data.corporate || "-"}`)
       .moveDown(2);

    // Section Header
    doc.fontSize(14).font("Helvetica-Bold")
      .text("BIOCHEMISTRY", { align: "left", underline: true })
      .moveDown(1);

    // Table Header
    const tableLeft = 50;
    const colWidths = [200, 120, 150]; // Description, Value, Reference
    const startY = doc.y;

    doc.fontSize(11).font("Helvetica-Bold");
    doc.text("Test Description", tableLeft, startY);
    doc.text("Observed Value", tableLeft + colWidths[0], startY);
    doc.text("Reference Range & Units", tableLeft + colWidths[0] + colWidths[1], startY);

    // Divider
    doc.moveTo(tableLeft, startY + 15)
       .lineTo(550, startY + 15)
       .stroke();

    // Table Rows
    let y = startY + 25;
    doc.fontSize(10).font("Helvetica");
    report.data.tests.forEach(test => {
      if (y > 700) { // new page if overflow
        doc.addPage();
        y = 50;
      }
      doc.text(test.testName, tableLeft, y);
      doc.text(test.resultValue, tableLeft + colWidths[0], y);
      doc.text(`${test.normalRange || "-"} ${test.unit || ""}`, tableLeft + colWidths[0] + colWidths[1], y);
      y += 18;
    });

    // Doctor Notes Section (if any)
    if (report.data.doctorNotes) {
      doc.addPage();
      doc.fontSize(14).font("Helvetica-Bold")
        .text("Doctor Notes", { underline: true })
        .moveDown();
      doc.fontSize(11).font("Helvetica")
        .text(report.data.doctorNotes, { align: "left" });
    }

    // Footer - Technician & Doctor
    doc.moveDown(3);
    doc.fontSize(11).font("Helvetica");
    doc.text("Issued By", { align: "left" });
    doc.text(report.data.technician || "Lab Technician", { align: "left" });
    doc.moveDown(2);

    doc.font("Helvetica-Bold").text("Clinical Pathologist", { align: "left" });
    doc.font("Helvetica").text(`${report.data.doctorName || "Dr. [Name]"}`, { align: "left" });
    doc.text(`${report.data.doctorQualification || "MBBS, DCP"}`, { align: "left" });
    doc.text(`Reg.No: ${report.data.doctorRegNo || "-"}`, { align: "left" });

    doc.moveDown(3);
    doc.fontSize(10).text("** End of report **", { align: "center", oblique: true });

    doc.end();
    return doc;
  } catch (error) {
    throw error;
  }
}

  async getReportsByDateRange(startDate, endDate) {
    try {
      const reports = await BloodReport.findAll({
        where: {
          reportDate: {
            [Op.between]: [startDate, endDate]
          },
          isActive: true
        },
        include: [
          {
            model: Patient,
            as: 'patient',
            attributes: ['name']
          }
        ],
        order: [['reportDate', 'DESC']]
      });

      return {
        success: true,
        data: reports
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BloodReportService();

