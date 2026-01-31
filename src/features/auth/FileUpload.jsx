import React, { useState } from 'react';

const FileUpload = ({ label, onUploadComplete, accept = ".pdf,.jpg,.png" }) => {
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB');
      return;
    }

    setFileName(file.name);
    setError('');
    setProgress(0);

    // Cloudinary Upload
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'bloodconnect/verifications');

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          onUploadComplete(response.secure_url);
        } else {
          setError('Upload failed. Please try again.');
          setProgress(0);
        }
      });

      xhr.addEventListener('error', () => {
        setError('Upload failed. Please check your connection.');
        setProgress(0);
      });

      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);
      xhr.send(formData);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed. Please try again.');
      setProgress(0);
    }
  };

  return (
    <div className="file-upload-container">
      <label className="form-label">{label}</label>
      <div className="file-upload-card" onClick={() => document.getElementById('file-input').click()}>
        <input
          type="file"
          id="file-input"
          accept={accept}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div className="upload-content">
          <span className="upload-icon">{progress === 100 ? '✅' : '📄'}</span>
          <span className="file-name">{fileName || 'Choose a file...'}</span>
          {progress > 0 && progress < 100 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          )}
        </div>
      </div>
      {error && <span className="error-text">{error}</span>}

      <style>{`
        .file-upload-card {
          border: 2px dashed var(--border-color);
          padding: 1.5rem;
          border-radius: var(--radius-sm);
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .file-upload-card:hover { border-color: var(--primary-red); background: var(--secondary-red); }
        .upload-content { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
        .upload-icon { font-size: 1.5rem; }
        .file-name { font-size: 0.9rem; color: var(--text-medium); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
        .progress-bar { width: 100%; height: 4px; background: var(--bg-light); border-radius: 2px; margin-top: 5px; }
        .progress-fill { height: 100%; background: var(--primary-red); border-radius: 2px; transition: width 0.3s; }
        .error-text { color: var(--error); font-size: 0.8rem; margin-top: 0.25rem; display: block; margin-top: 0.5rem; }
      `}</style>
    </div>
  );
};

export default FileUpload;
