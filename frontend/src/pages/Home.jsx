import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadForm from '../components/UploadForm';
import ResultsDisplay from '../components/ResultsDisplay';
import { HiOutlineHeart, HiOutlineClock, HiOutlineCheckCircle } from 'react-icons/hi';

const Home = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const features = [
    {
      name: 'Accurate Classification',
      description: 'Using deep learning CNN model to accurately classify ECG arrhythmia patterns.',
      icon: HiOutlineCheckCircle,
    },
    {
      name: 'Heart Health Monitoring',
      description: 'Assist healthcare professionals in monitoring heart conditions.',
      icon: HiOutlineHeart,
    },
    {
      name: 'Real-time Results',
      description: 'Get immediate classification results for uploaded ECG images.',
      icon: HiOutlineClock,
    },
  ];
  
  const handleResultReceived = (data) => {
    setResult(data);
    setIsLoading(false);
    // Optionally navigate to results page
    // navigate('/results', { state: { result: data } });
  };
  
  const handleError = (err) => {
    setError(err);
    setIsLoading(false);
  };
  
  const handleLoading = (loading) => {
    setIsLoading(loading);
    if (loading) {
      setResult(null);
      setError(null);
    }
  };
  
  return (
    <div className="pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">
              ECG Arrhythmia Classification
            </h1>
            <p className="text-lg mb-8">
              Upload your ECG images and get instant classification of cardiac arrhythmias using our advanced CNN model.
            </p>
            <a
              href="#upload-section"
              className="btn bg-white text-primary-700 hover:bg-gray-100"
            >
              Try Now
            </a>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="section-title text-center">How It Works</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="card p-6">
                <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.name}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Upload Section */}
      <div id="upload-section" className="py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <h2 className="section-title text-center">Upload ECG Image</h2>
            <p className="text-center text-gray-600 mb-8">
              Upload an ECG image to classify the arrhythmia type. Supported formats: JPEG, PNG.
            </p>
            
            <UploadForm 
              onResultReceived={handleResultReceived} 
              onError={handleError}
              onLoading={handleLoading}
            />
            
            {isLoading && (
              <div className="mt-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            )}
            
            {error && (
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700">Error: {error}</p>
              </div>
            )}
            
            {result && (
              <div className="mt-8">
                <ResultsDisplay result={result} />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to explore more?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Learn about the different types of arrhythmias and how our model classifies them.
            </p>
            <button
              onClick={() => navigate('/about')}
              className="btn btn-primary"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;