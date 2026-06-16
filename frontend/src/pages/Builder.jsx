import { useState } from 'react';
import UploadZone from '../components/UploadZone';
import ResumeForm from '../components/ResumeForm';
import ImprovementPanel from '../components/ImprovementPanel';
import TemplateSelector from '../components/TemplateSelector';
import ExportButtons from '../components/ExportButtons';
import { useResumeForm } from '../hooks/useResumeForm';
import { useAnalysis } from '../hooks/useAnalysis';

export default function Builder() {
  const formHooks = useResumeForm();
  const { resumeData, loadFromParsed, setTemplate } = formHooks;
  const { analysis, loading: analysisLoading } = useAnalysis(resumeData);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(true);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="builder-layout">
        {/* ── Left: Main Editor ── */}
        <div className="builder-main">
          {/* Upload Zone */}
          {showUpload && (
            <div className="card animate-fade-in" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>
                    📎 Upload Existing Resume
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    Auto-extract info from PDF, DOCX, Excel, or TXT
                  </p>
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowUpload(false)}
                  style={{ fontSize: '0.75rem' }}
                >
                  Skip →
                </button>
              </div>
              <UploadZone
                onParsed={(data) => {
                  loadFromParsed(data);
                  setShowUpload(false);
                }}
                onLoading={setUploadLoading}
              />
              {uploadLoading && (
                <div style={{ textAlign: 'center', marginTop: 12, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <span className="spinner" style={{ display: 'inline-block', marginRight: 8 }} />
                  Extracting information...
                </div>
              )}
            </div>
          )}

          {/* Resume Form */}
          <div className="card animate-fade-in" style={{ padding: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 4 }}>
                ✏️ Resume Details
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                Fill in your information — score updates as you type
              </p>
            </div>
            <ResumeForm {...formHooks} />
          </div>

          {/* Template Selector */}
          <div className="card animate-fade-in" style={{ padding: 24 }}>
            <TemplateSelector
              selected={resumeData.template}
              onSelect={setTemplate}
            />
          </div>

          {/* Export */}
          <div className="card animate-fade-in" style={{ padding: 24 }}>
            <ExportButtons
              resumeData={resumeData}
              template={resumeData.template}
            />
          </div>
        </div>

        {/* ── Right: Score Sidebar ── */}
        <div className="builder-sidebar">
          <ImprovementPanel
            analysis={analysis}
            loading={analysisLoading}
          />
        </div>
      </div>
    </div>
  );
}
