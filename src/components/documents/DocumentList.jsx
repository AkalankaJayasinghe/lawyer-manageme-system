import React, { useState, useEffect } from 'react';
import { documentAPI } from '../../services/api';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import ErrorMessage from '../ui/ErrorMessage';
import Badge from '../ui/Badge';

const fileIcon = (
  <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DocumentList = ({ bookingId, onDocumentDeleted }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await documentAPI.getAllDocuments(bookingId || null);
      setDocuments(data.data || data || []);
    } catch (err) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [bookingId]);

  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    setDeleting(docId);
    try {
      await documentAPI.deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      if (onDocumentDeleted) onDocumentDeleted(docId);
    } catch (err) {
      setError(err.message || 'Failed to delete document');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'N/A';

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) return <Spinner className="mx-auto py-8" />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDocuments} />;

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="mx-auto h-10 w-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            {fileIcon}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{doc.name || doc.filename}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {doc.size && <span className="text-xs text-gray-400">{formatSize(doc.size)}</span>}
                <span className="text-xs text-gray-400">{formatDate(doc.createdAt || doc.uploadedAt)}</span>
                {doc.type && (
                  <Badge variant="default" size="sm">{doc.type.toUpperCase()}</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-2 flex-shrink-0">
            {doc.url && (
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-xs font-medium"
              >
                View
              </a>
            )}
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDelete(doc.id)}
              loading={deleting === doc.id}
              disabled={!!deleting}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
