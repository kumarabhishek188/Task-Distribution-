"use client";
import { useCallback, useState } from 'react';
import { API_URL } from '../../utils/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!file) {
      setError('Please select a CSV or XLSX file');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/tasks/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setMessage(data.message);
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-yellow-100 p-4">
      <Card className="w-full max-w-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-yellow-700 text-center">Upload Tasks</h2>
        <form onSubmit={handleUpload} className="flex flex-col gap-5">
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="border-2 border-dashed border-yellow-400 rounded-xl p-8 text-center bg-yellow-50/60"
          >
            <p className="mb-2 text-gray-700">Drag & drop CSV/XLSX here</p>
            <p className="text-sm text-gray-500 mb-3">or</p>
            <label className="inline-block px-4 py-2 rounded bg-yellow-500 text-white cursor-pointer hover:bg-yellow-600">
              Choose File
              <input type="file" accept=".csv,.xls,.xlsx" onChange={handleFileChange} className="hidden" />
            </label>
            {file && <div className="mt-3 text-sm text-gray-700">Selected: <strong>{file.name}</strong></div>}
          </div>

          {error && <Alert tone="error">{error}</Alert>}
          {message && <Alert tone="success">{message}</Alert>}

          <Button type="submit" variant="warning" loading={loading} disabled={!file}>
            Upload & Distribute
          </Button>
        </form>
      </Card>
    </div>
  );
}
