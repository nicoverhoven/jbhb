import { jsPDF } from 'jspdf';
import { formatFileSize } from '../shared/scoring';
import type { CVAnalysisResult } from '../shared/types';

export function downloadAnalysisPdfReport(analysis: CVAnalysisResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > pageHeight - 16) {
      doc.addPage();
      y = 18;
    }
  };

  const addWrappedText = (
    text: string,
    x: number,
    fontSize: number,
    color: [number, number, number],
    maxWidth: number,
    lineHeight = 5.2,
    bold = false
  ) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxWidth) as string[];
    for (const line of lines) {
      ensureSpace(lineHeight + 2);
      doc.text(line, x, y);
      y += lineHeight;
    }
  };

  const addSectionHeader = (title: string) => {
    ensureSpace(14);
    y += 3;
    doc.setDrawColor(22, 119, 255);
    doc.setLineWidth(0.6);
    doc.line(margin, y, margin + 14, y);
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(title, margin, y);
    y += 6;
  };

  // Top Header Banner
  doc.setFillColor(10, 14, 22);
  doc.rect(0, 0, pageWidth, 34, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('FreeCVRater', margin, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text('AI-Powered CV Evaluation Report', margin, 21);

  const dateLabel = new Date(analysis.analyzedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.text(
    `${analysis.fileName} (${formatFileSize(analysis.fileSizeBytes)}) · ${dateLabel}`,
    margin,
    28
  );

  y = 44;

  // Overall Score Card
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 28, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(22, 119, 255);
  doc.text(`${analysis.overallScore}`, margin + 8, y + 15);
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text('/ 100', margin + 23, y + 15);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(analysis.scoreCategory, margin + 45, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  const modeLabel = analysis.extractionMode === 'text' ? 'Text Extraction' : 'AI Vision OCR';
  const summaryMeta = `Career Stage: ${analysis.extractedProfile.careerStageDetected} · ${analysis.fileType.toUpperCase()} (${modeLabel}) · ${analysis.wordCount} words · ${analysis.pageCount} page(s)`;
  doc.text(summaryMeta, margin + 45, y + 18);
  y += 34;

  addWrappedText(analysis.overallSummary, margin, 10, [51, 65, 85], contentWidth, 5);

  // 7 Category Breakdown
  addSectionHeader('Score Breakdown by Category');
  for (const cat of analysis.categories) {
    ensureSpace(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`${cat.label}`, margin, y);
    doc.setTextColor(22, 119, 255);
    doc.text(`${cat.score} / ${cat.maxScore}`, pageWidth - margin, y, { align: 'right' });
    y += 3;

    // Progress Bar
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 2.5, 1, 1, 'F');
    const ratio = cat.maxScore > 0 ? Math.max(0.02, cat.score / cat.maxScore) : 0;
    doc.setFillColor(22, 119, 255);
    doc.roundedRect(margin, y, contentWidth * ratio, 2.5, 1, 1, 'F');
    y += 6;

    addWrappedText(cat.explanation, margin, 9, [71, 85, 105], contentWidth, 4.4);
    y += 2;
  }

  // ATS Compatibility
  addSectionHeader(`ATS Compatibility (${analysis.atsAssessment.compatibilityLevel})`);
  addWrappedText(analysis.atsAssessment.summary, margin, 9.5, [51, 65, 85], contentWidth, 4.8);
  y += 2;
  if (analysis.atsAssessment.formattingRisks.length > 0) {
    addWrappedText('Detected Risks:', margin, 9.5, [15, 23, 42], contentWidth, 4.8, true);
    for (const risk of analysis.atsAssessment.formattingRisks) {
      addWrappedText(`• ${risk}`, margin + 2, 9, [71, 85, 105], contentWidth - 2, 4.5);
    }
  }
  if (analysis.atsAssessment.missingSections.length > 0) {
    y += 1;
    addWrappedText(
      `Missing Sections: ${analysis.atsAssessment.missingSections.join(', ')}`,
      margin,
      9,
      [180, 83, 9],
      contentWidth,
      4.5
    );
  }
  y += 1;
  addWrappedText(analysis.atsAssessment.disclaimer, margin, 8, [100, 116, 139], contentWidth, 4);

  // Strengths & Weaknesses
  addSectionHeader('Key Strengths & Weaknesses');
  addWrappedText('Strengths:', margin, 9.5, [22, 163, 74], contentWidth, 4.8, true);
  for (const s of analysis.strengths) {
    addWrappedText(`+ ${s}`, margin + 2, 9, [51, 65, 85], contentWidth - 2, 4.5);
  }
  y += 2;
  addWrappedText('Priority Weaknesses:', margin, 9.5, [220, 38, 38], contentWidth, 4.8, true);
  for (const w of analysis.weaknesses) {
    addWrappedText(`- ${w}`, margin + 2, 9, [51, 65, 85], contentWidth - 2, 4.5);
  }

  // Grammar Issues
  if (analysis.grammarIssues.length > 0) {
    addSectionHeader('Grammar & Writing Fixes');
    for (const issue of analysis.grammarIssues.slice(0, 8)) {
      ensureSpace(16);
      addWrappedText(
        `[${issue.severity}] ${issue.problem}`,
        margin,
        9.5,
        [15, 23, 42],
        contentWidth,
        4.6,
        true
      );
      addWrappedText(
        `Original: "${issue.originalSentence}"`,
        margin + 2,
        8.8,
        [185, 28, 28],
        contentWidth - 2,
        4.3
      );
      addWrappedText(
        `Suggested: "${issue.suggestedCorrection}"`,
        margin + 2,
        8.8,
        [21, 128, 61],
        contentWidth - 2,
        4.3
      );
      y += 2;
    }
  }

  // Recommendations
  if (analysis.recommendations.length > 0) {
    addSectionHeader('Prioritized Action Plan');
    for (const rec of analysis.recommendations) {
      ensureSpace(22);
      addWrappedText(
        `[${rec.priority} Priority] ${rec.title}`,
        margin,
        10,
        [15, 23, 42],
        contentWidth,
        4.8,
        true
      );
      addWrappedText(`Problem: ${rec.problemIdentified}`, margin + 2, 9, [71, 85, 105], contentWidth - 2, 4.4);
      addWrappedText(`Why it matters: ${rec.whyItMatters}`, margin + 2, 9, [71, 85, 105], contentWidth - 2, 4.4);
      addWrappedText(`How to fix: ${rec.howToFix}`, margin + 2, 9, [15, 23, 42], contentWidth - 2, 4.4);
      if (rec.improvedExample) {
        addWrappedText(`Example: ${rec.improvedExample}`, margin + 2, 8.8, [22, 119, 255], contentWidth - 2, 4.4);
      }
      y += 3;
    }
  }

  const safeBase = analysis.fileName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${safeBase || 'cv'}_FreeCVRater_Report.pdf`);
}
