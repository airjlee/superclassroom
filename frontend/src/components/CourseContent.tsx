import React, { useState } from 'react';

interface CourseContentProps {
  course: string;
  activeTab: string;
  onItemSelect: (item: { type: string; id: number; title: string }, course: string) => void;
}

const CourseContent: React.FC<CourseContentProps> = ({ course, activeTab, onItemSelect }) => {
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
      });

      const result = await response.json();
      if (response.ok) {
        setUploadStatus('File uploaded successfully!');
        setSelectedFile(null);
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setUploadStatus(`Upload failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload failed: Network error or server unavailable');
    }
  };

  if (activeTab === 'upload') {
    return (
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Upload Materials for {course}</h2>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Upload Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center hover:border-blue-500 transition-all">
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="p-4 bg-blue-50 rounded-full mb-4">
                  <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-gray-700">Drop your files here or click to browse</p>
                <p className="text-sm text-gray-500 mt-2">PDF, DOC, PPT, or any other course materials</p>
              </label>
              
              <button
                onClick={handleUpload}
                disabled={!selectedFile}
                className={`mt-6 px-6 py-2 rounded-full font-semibold text-sm
                  ${selectedFile 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  } transition-colors`}
              >
                Upload to Course
              </button>
            </div>
          </div>

          {/* Right Column - Files List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Uploaded Files</h3>
            <div className="space-y-3">
              {/* Example uploaded files - replace with actual data */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded">
                    <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Chapter 1 Notes.pdf</span>
                </div>
                <span className="text-xs text-gray-500">2.4 MB</span>
              </div>
            </div>
          </div>
        </div>

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
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{course} Content</h2>
      <p className="text-gray-600">Content for {activeTab} tab coming soon...</p>
    </div>
  );
};

export default CourseContent; 