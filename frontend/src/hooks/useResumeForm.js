import { useState, useCallback } from 'react';

const EMPTY_RESUME = {
  contact: {
    name: '', email: '', phone: '', linkedin: '',
    github: '', portfolio: '', location: '',
  },
  summary: '',
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  template: 'ats_pro',
};

export function useResumeForm() {
  const [resumeData, setResumeData] = useState(EMPTY_RESUME);

  const updateContact = useCallback((field, value) => {
    setResumeData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  }, []);

  const updateField = useCallback((field, value) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Skills
  const addSkill = useCallback((skill) => {
    if (!skill.trim()) return;
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills : [...prev.skills, skill]
    }));
  }, []);

  const removeSkill = useCallback((skill) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  }, []);

  // Education
  const addEducation = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: '', gpa: '', field: '' }]
    }));
  }, []);

  const updateEducation = useCallback((idx, field, value) => {
    setResumeData(prev => {
      const education = [...prev.education];
      education[idx] = { ...education[idx], [field]: value };
      return { ...prev, education };
    });
  }, []);

  const removeEducation = useCallback((idx) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx)
    }));
  }, []);

  // Experience
  const addExperience = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '', company: '', duration: '', description: '', achievements: []
      }]
    }));
  }, []);

  const updateExperience = useCallback((idx, field, value) => {
    setResumeData(prev => {
      const experience = [...prev.experience];
      experience[idx] = { ...experience[idx], [field]: value };
      return { ...prev, experience };
    });
  }, []);

  const removeExperience = useCallback((idx) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx)
    }));
  }, []);

  // Projects
  const addProject = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '', description: '', technologies: [], url: '', github: ''
      }]
    }));
  }, []);

  const updateProject = useCallback((idx, field, value) => {
    setResumeData(prev => {
      const projects = [...prev.projects];
      projects[idx] = { ...projects[idx], [field]: value };
      return { ...prev, projects };
    });
  }, []);

  const removeProject = useCallback((idx) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== idx)
    }));
  }, []);

  // Certifications
  const addCertification = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { name: '', issuer: '', year: '', url: '' }]
    }));
  }, []);

  const updateCertification = useCallback((idx, field, value) => {
    setResumeData(prev => {
      const certifications = [...prev.certifications];
      certifications[idx] = { ...certifications[idx], [field]: value };
      return { ...prev, certifications };
    });
  }, []);

  const removeCertification = useCallback((idx) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== idx)
    }));
  }, []);

  const loadFromParsed = useCallback((parsed) => {
    setResumeData(prev => ({
      ...EMPTY_RESUME,
      ...parsed,
      template: prev.template,
    }));
  }, []);

  const setTemplate = useCallback((template) => {
    setResumeData(prev => ({ ...prev, template }));
  }, []);

  return {
    resumeData,
    updateContact,
    updateField,
    addSkill,
    removeSkill,
    addEducation, updateEducation, removeEducation,
    addExperience, updateExperience, removeExperience,
    addProject, updateProject, removeProject,
    addCertification, updateCertification, removeCertification,
    loadFromParsed,
    setTemplate,
  };
}
