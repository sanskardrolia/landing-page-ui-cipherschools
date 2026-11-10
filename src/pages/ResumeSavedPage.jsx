import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Download, FilePlus2, FileText, Pencil, Trash2 } from 'lucide-react';
import { TEMPLATE_NAMES } from '../utils/resumeData';
import { deleteEntry, importLegacyDraft, loadLibrary } from '../utils/resumeLibrary';
import './ResumePage.css';
import './ResumeSavedPage.css';

const formatModified = (ts) => {
  if (!ts) return '-';
  return new Date(ts).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

// "My Saved Resume" page: one row per resume kept in this browser
const ResumeSavedPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    importLegacyDraft();
    setItems(loadLibrary().sort((a, b) => b.updatedAt - a.updatedAt));
  }, []);

  const handleDelete = (entry) => {
    if (!window.confirm(`Delete "${entry.title}"? This can't be undone.`)) return;
    deleteEntry(entry.id);
    setItems((cur) => cur.filter((e) => e.id !== entry.id));
  };

  return (
    <div className="rs-page rss-page">
      <section className="rss-wrap">
        <div className="rss-head">
          <div>
            <h1 className="rss-title">My Saved Resumes</h1>
            <p className="rss-sub">Resumes you've built are saved in this browser. Edit, download or delete them here.</p>
          </div>
          <Link to="/resume/templates" className="rs-btn rs-btn--primary">
            <FilePlus2 size={16} />
            <span>Build new resume</span>
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="rss-empty">
            <FileText size={32} />
            <h2>No saved resumes yet</h2>
            <p>Build your first resume and it will appear here automatically.</p>
            <Link to="/resume/templates" className="rs-btn rs-btn--primary">Build My Resume</Link>
          </div>
        ) : (
          <div className="rss-table-wrap">
            <table className="rss-table">
              <thead>
                <tr>
                  <th>Resume Title</th>
                  <th>Template Used</th>
                  <th>Last Modified</th>
                  <th className="rss-th-actions">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((entry) => (
                  <tr key={entry.id}>
                    <td data-label="Resume Title">
                      <span className="rss-name">
                        <FileText size={16} />
                        <span>{entry.title}</span>
                      </span>
                    </td>
                    <td data-label="Template Used">
                      <span className="rss-chip">{TEMPLATE_NAMES[entry.template] || entry.template}</span>
                    </td>
                    <td data-label="Last Modified">{formatModified(entry.updatedAt)}</td>
                    <td data-label="Action">
                      <div className="rss-actions">
                        <button type="button" className="rss-act" onClick={() => navigate(`/resume/builder?id=${entry.id}`)}>
                          <Pencil size={14} /><span>Edit</span>
                        </button>
                        <button type="button" className="rss-act" onClick={() => navigate(`/resume/builder?id=${entry.id}&download=1`)}>
                          <Download size={14} /><span>Download</span>
                        </button>
                        <button type="button" className="rss-act rss-act--danger" onClick={() => handleDelete(entry)}>
                          <Trash2 size={14} /><span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default ResumeSavedPage;
