import { useState } from 'react';
import { exportPDF, exportDOCX, exportJSON, downloadBlob } from '../api/client';

export default function ExportButtons({ resumeData, template }) {
  const [loading, setLoading] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = async (format) => {
    setLoading(format);
    try {
      if (format === 'pdf') {
        const blob = await exportPDF({ ...resumeData, template });
        downloadBlob(blob, 'resume.pdf');
        showToast('✅ PDF downloaded!');
      } else if (format === 'docx') {
        const blob = await exportDOCX({ ...resumeData, template });
        downloadBlob(blob, 'resume.docx');
        showToast('✅ DOCX downloaded!');
      } else if (format === 'json') {
        const data = await exportJSON({ ...resumeData, template });
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        downloadBlob(blob, 'resume.json');
        showToast('✅ JSON downloaded!');
      }
    } catch (err) {
      showToast('❌ Export failed. Make sure the backend is running.', 'error');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <h3 style={{
        fontSize: '0.9rem', fontWeight: 700, marginBottom: 12,
        color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em'
      }}>
        Download Resume
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          id="export-pdf"
          className="btn btn-primary"
          onClick={() => handleExport('pdf')}
          disabled={loading === 'pdf'}
          style={{ justifyContent: 'flex-start', gap: 10 }}
        >
          {loading === 'pdf' ? <span className="spinner" /> : '📄'}
          Download PDF
          <span style={{ marginLeft: 'auto', opacity: 0.7, fontSize: '0.75rem' }}>ATS Ready</span>
        </button>

        <button
          id="export-docx"
          className="btn btn-secondary"
          onClick={() => handleExport('docx')}
          disabled={loading === 'docx'}
          style={{ justifyContent: 'flex-start', gap: 10 }}
        >
          {loading === 'docx' ? <span className="spinner" /> : '📝'}
          Download DOCX
          <span style={{ marginLeft: 'auto', opacity: 0.7, fontSize: '0.75rem' }}>Editable</span>
        </button>

        <button
          id="export-json"
          className="btn btn-ghost"
          onClick={() => handleExport('json')}
          disabled={loading === 'json'}
          style={{ justifyContent: 'flex-start', gap: 10 }}
        >
          {loading === 'json' ? <span className="spinner" /> : '⚙️'}
          Export JSON
          <span style={{ marginLeft: 'auto', opacity: 0.7, fontSize: '0.75rem' }}>Raw data</span>
        </button>
      </div>

      {toast && (
        <div
          className={`toast-item ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}
          style={{ marginTop: 12 }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
