import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const DocumentViewer = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const url = searchParams.get('url');
    const title = searchParams.get('title') || 'Document';

    if (!url) {
        return (
            <div className="error-container">
                <p>No document URL provided</p>
                <button className="btn btn-primary" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>
        );
    }

    const isPDF = url.toLowerCase().includes('.pdf');
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

    return (
        <div className="document-viewer">
            <header className="viewer-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Back
                </button>
                <h3>{title}</h3>
                <a
                    href={url}
                    download
                    className="download-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ⬇️
                </a>
            </header>

            <div className="viewer-content">
                {isImage ? (
                    <img src={url} alt={title} className="document-image" />
                ) : isPDF ? (
                    <iframe
                        src={url}
                        title={title}
                        className="document-frame"
                    />
                ) : (
                    <div className="unsupported-format">
                        <p>Preview not available for this file type</p>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            Open in New Tab
                        </a>
                    </div>
                )}
            </div>

            <style>{`
        .document-viewer {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: var(--bg-light);
        }

        .viewer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: var(--bg-white);
          border-bottom: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
        }

        .viewer-header h3 {
          margin: 0;
          font-size: 1rem;
          color: var(--text-dark);
          flex: 1;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .back-btn {
          background: none;
          border: none;
          font-size: 1rem;
          color: var(--primary-red);
          cursor: pointer;
          padding: 0.5rem;
          font-weight: 600;
        }

        .download-btn {
          font-size: 1.5rem;
          text-decoration: none;
          padding: 0.5rem;
        }

        .viewer-content {
          flex: 1;
          overflow: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .document-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-md);
        }

        .document-frame {
          width: 100%;
          height: 100%;
          border: none;
          border-radius: var(--radius-sm);
          background: white;
        }

        .error-container,
        .unsupported-format {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem;
          text-align: center;
        }

        @media (max-width: 768px) {
          .viewer-header h3 {
            font-size: 0.9rem;
          }
        }
      `}</style>
        </div>
    );
};

export default DocumentViewer;
