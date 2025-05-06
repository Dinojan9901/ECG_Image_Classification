import { useNavigate } from 'react-router-dom';
import { HiChartPie, HiInformationCircle } from 'react-icons/hi';

const ResultsDisplay = ({ result }) => {
  const navigate = useNavigate();
  
  if (!result) {
    return null;
  }
  
  const handleViewDetails = () => {
    navigate('/results', { state: { result } });
  };
  
  // Determine the background and text color based on the class
  const getBadgeClasses = (classType) => {
    switch (classType) {
      case 'N':
        return 'bg-green-100 text-green-800';
      case 'F':
        return 'bg-blue-100 text-blue-800';
      case 'M':
        return 'bg-red-100 text-red-800';
      case 'Q':
        return 'bg-purple-100 text-purple-800';
      case 'S':
        return 'bg-yellow-100 text-yellow-800';
      case 'V':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="card">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Classification Result</h2>
        
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-500 block mb-1">ECG Classification:</span>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getBadgeClasses(result.class)}`}>
                {result.class}: {result.description}
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500 block mb-1">Confidence:</span>
              <span className="text-lg font-semibold">
                {(result.confidence * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Progress bars for top predictions */}
        <div className="space-y-3">
          <span className="text-sm text-gray-500 block">Top Predictions:</span>
          {result.top_predictions.map((pred, index) => (
            <div key={index} className="flex items-center">
              <div className="w-24 flex-shrink-0">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getBadgeClasses(pred.class)}`}>
                  {pred.class}
                </span>
              </div>
              <div className="flex-grow mx-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      index === 0 ? 'bg-primary-600' : 'bg-gray-400'
                    }`}
                    style={{ width: `${pred.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-right text-sm font-medium text-gray-900">
                {(pred.confidence * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
        
        {/* Info box */}
        <div className="mt-6 p-3 bg-blue-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <HiInformationCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                This classification is based on the uploaded ECG image. For medical advice, please consult a healthcare professional.
              </p>
            </div>
          </div>
        </div>
        
        {/* View Details Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleViewDetails}
            className="btn btn-primary inline-flex items-center"
          >
            <HiChartPie className="mr-2 h-5 w-5" />
            View Detailed Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;