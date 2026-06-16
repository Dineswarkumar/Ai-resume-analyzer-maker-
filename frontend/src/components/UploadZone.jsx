import { useRef, useState } from 'react';
import { parseResume } from '../api/client';

const ACCEPTED = '.pdf,.doc,.docx,.xlsx,.xls,.txt';

export default function UploadZone({ onParsed, onLoading }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState(null); // null | 'loading' | 'done' | 'error'
  const [fileName, setFileName] = useState('');
  const [confidence, setConfidence] = useState(null);

  const handleFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setStatus('loading');
    onLoading?.(true);
    try {
      const data = await parseResume(file);
      setStatus('done');
      setConfidence(data.confidence);
      onParsed?.(data.resume_data);
    } catch (err) {
      setStatus('error');
    } finally {
      onLoading?.(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`upload-zone ${dragging ? 'drag-over' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      id="upload-zone"
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        style={{ display: 'none' }}
        onChange={onInputChange}
      />

      {status === 'loading' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} />
          <div style={{ color: 'var(--text-secondary)' }}>
            Parsing <strong style={{ color: 'var(--accent-violet-light)' }}>{fileName}</strong>...
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            AI is extracting your information
          </div>
        </div>
      ) : status === 'done' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: '2.5rem' }}>✅</div>
          <div style={{ fontWeight: 600, color: 'var(--success)' }}>Resume Parsed!</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {fileName} — {Math.round((confidence || 0) * 100)}% confidence
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Click to upload a different file
          </div>
        </div>
      ) : status === 'error' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: '2.5rem' }}>❌</div>
          <div style={{ fontWeight: 600, color: 'var(--danger)' }}>Parse Failed</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Please try a different file or fill manually
          </div>
        </div>
      ) : (
        <>
          <span className="upload-icon">📄</span>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>
            Drop your resume here
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16 }}>
            or <span style={{ color: 'var(--accent-violet-light)', fontWeight: 600 }}>click to browse</span>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['PDF', 'DOCX', 'Excel', 'TXT'].map(fmt => (
              <span key={fmt} className="badge badge-violet">{fmt}</span>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Max 10 MB • AI auto-extracts all information
          </div>
        </>
      )}
    </div>
  );
}
