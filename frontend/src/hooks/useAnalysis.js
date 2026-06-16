import { useState, useEffect, useRef, useCallback } from 'react';
import { analyzeResume } from '../api/client';

export function useAnalysis(resumeData, debounceMs = 1200) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const prevDataRef = useRef(null);

  const runAnalysis = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyzeResume(data);
      setAnalysis(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const dataStr = JSON.stringify(resumeData);
    if (dataStr === prevDataRef.current) return;
    prevDataRef.current = dataStr;

    // Only run if there's some meaningful data
    const hasData = resumeData.contact?.name ||
      resumeData.skills?.length > 0 ||
      resumeData.experience?.length > 0;

    if (!hasData) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      runAnalysis(resumeData);
    }, debounceMs);

    return () => clearTimeout(timerRef.current);
  }, [resumeData, debounceMs, runAnalysis]);

  return { analysis, loading, error };
}
