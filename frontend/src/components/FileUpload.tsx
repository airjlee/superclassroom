import React, { useState } from 'react';

interface FileUploadProps {
  course: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ course }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('course', course);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
        // headers: {
        //   'Accept': 'application/json',
        // },
      });

      const result = await response.json();
      
      if (response.ok) {
        setUploadStatus('File uploaded successfully!');
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setUploadStatus(`Upload failed: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload failed: Network error or server unavailable');
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      
      <button
        onClick={handleUpload}
        disabled={!selectedFile}
        className={`px-4 py-2 rounded-full font-semibold text-sm
          ${selectedFile 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          } transition-colors`}
      >
        Upload File
      </button>

      {uploadStatus && (
        <div className={`mt-4 p-3 rounded ${
          uploadStatus.includes('success') 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {uploadStatus}
        </div>
      )}
    </div>
  );
};

export default FileUpload; 