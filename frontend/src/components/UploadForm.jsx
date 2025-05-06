import { useState, useRef } from 'react';
import { HiUpload, HiX, HiPhotograph } from 'react-icons/hi';
import axios from 'axios';

const UploadForm = ({ onResultReceived, onError, onLoading }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // Check if file is an image
      if (!selectedFile.type.startsWith('image/')) {
        onError('Please upload an image file.');
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Check if file is an image
      if (!droppedFile.type.startsWith('image/')) {
        onError('Please upload an image file.');
        return;
      }
      
      setFile(droppedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(droppedFile);
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      onError('Please select a file to upload.');
      return;
    }
    
    onLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(`${API_URL}/predict/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      onResultReceived(response.data);
    } catch (error) {
      let errorMessage = 'An error occurred during classification.';
      
      if (error.response) {
        // Server responded with an error
        errorMessage = error.response.data.detail || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Could not connect to the server. Please try again later.';
      }
      
      onError(errorMessage);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div 
        className="upload-box"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        {!preview ? (
          <div className="text-center">
            <HiUpload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4 flex text-sm text-gray-600">
              <label className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500">
                <span>Upload a file</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        ) : (
          <div className="relative w-full">
            <button
              type="button"
              className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 rounded-full p-1 text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
            >
              <HiX className="h-5 w-5" />
            </button>
            <div className="flex justify-center">
              <div className="relative w-64 h-64 overflow-hidden rounded-md">
                <img 
                  src={preview} 
                  alt="ECG Preview" 
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
            <p className="mt-2 text-center text-sm text-gray-500">
              {file?.name} ({(file?.size / 1024).toFixed(2)} KB)
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-center">
        <button
          type="submit"
          className="btn btn-primary flex items-center"
          disabled={!file}
        >
          <HiPhotograph className="mr-2 h-5 w-5" />
          Classify ECG Image
        </button>
      </div>
    </form>
  );
};

export default UploadForm;