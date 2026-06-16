import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

// ── Resume endpoints ────────────────────────────────────────────
export const parseResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await client.post('/resume/parse', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const exportPDF = async (resumeData) => {
  const res = await client.post('/resume/export/pdf', { resume_data: resumeData }, {
    responseType: 'blob',
  });
  return res.data;
};

export const exportDOCX = async (resumeData) => {
  const res = await client.post('/resume/export/docx', { resume_data: resumeData }, {
    responseType: 'blob',
  });
  return res.data;
};

export const exportJSON = async (resumeData) => {
  const res = await client.post('/resume/export/json', { resume_data: resumeData });
  return res.data;
};

// ── Analyze endpoint ────────────────────────────────────────────
export const analyzeResume = async (resumeData) => {
  const res = await client.post('/analyze/', resumeData);
  return res.data;
};

// ── Templates endpoint ──────────────────────────────────────────
export const getTemplates = async () => {
  const res = await client.get('/templates/');
  return res.data.templates;
};

// ── Download helper ─────────────────────────────────────────────
export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
