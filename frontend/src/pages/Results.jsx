import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HiInformationCircle, HiArrowNarrowLeft } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Results = () => {
  const location = useLocation();
  const [result, setResult] = useState(null);
  
  useEffect(() => {
    // Get result from location state (if coming from home page)
    if (location.state && location.state.result) {
      setResult(location.state.result);
    }
  }, [location]);
  
  // Define chart colors
  const chartColors = {
    F: 'rgba(54, 162, 235, 0.7)',    // Blue
    M: 'rgba(255, 99, 132, 0.7)',     // Red
    N: 'rgba(75, 192, 192, 0.7)',     // Green
    Q: 'rgba(153, 102, 255, 0.7)',    // Purple
    S: 'rgba(255, 206, 86, 0.7)',     // Yellow
    V: 'rgba(255, 159, 64, 0.7)',     // Orange
  };
  
  // Define chart border colors (darker versions of the fills)
  const chartBorderColors = {
    F: 'rgba(54, 162, 235, 1)',
    M: 'rgba(255, 99, 132, 1)',
    N: 'rgba(75, 192, 192, 1)',
    Q: 'rgba(153, 102, 255, 1)',
    S: 'rgba(255, 206, 86, 1)',
    V: 'rgba(255, 159, 64, 1)',
  };
  
  // Prepare chart data if result exists
  const chartData = result?.top_predictions ? {
    labels: result.top_predictions.map(pred => `${pred.class}: ${pred.description}`),
    datasets: [
      {
        data: result.top_predictions.map(pred => pred.confidence * 100),
        backgroundColor: result.top_predictions.map(pred => chartColors[pred.class]),
        borderColor: result.top_predictions.map(pred => chartBorderColors[pred.class]),
        borderWidth: 1,
      },
    ],
  } : null;
  
  // Chart options
  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw.toFixed(2)}%`;
          }
        }
      }
    }
  };
  
  // If no result, show placeholder
  if (!result) {
    return (
      <div className="py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-yellow-50 p-4 rounded-md flex items-start mb-8">
              <HiInformationCircle className="h-6 w-6 text-yellow-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">No result to display</h3>
                <p className="mt-2 text-sm text-yellow-700">
                  Please upload an ECG image from the home page to see classification results.
                </p>
              </div>
            </div>
            
            <Link to="/" className="btn btn-primary inline-flex items-center">
              <HiArrowNarrowLeft className="mr-2 h-5 w-5" />
              Go to Home Page
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title">ECG Classification Results</h1>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Result Card */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Classification</h2>
              
              <div className="mb-6">
                <span className="text-sm text-gray-500">Primary Classification:</span>
                <div className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  result.class === 'N' ? 'bg-green-100 text-green-800' :
                  result.class === 'F' ? 'bg-blue-100 text-blue-800' :
                  result.class === 'M' ? 'bg-red-100 text-red-800' :
                  result.class === 'Q' ? 'bg-purple-100 text-purple-800' :
                  result.class === 'S' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {result.class}: {result.description}
                </div>
              </div>
              
              <div className="mb-6">
                <span className="text-sm text-gray-500">Confidence:</span>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      result.confidence > 0.7 ? 'bg-green-600' :
                      result.confidence > 0.4 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-700 mt-1 block">{(result.confidence * 100).toFixed(2)}%</span>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">What does this mean?</h3>
                <p className="text-gray-600">
                  {result.class === 'N' 
                    ? 'The ECG shows a normal heart rhythm pattern with regular beats and no abnormalities.'
                    : result.class === 'F'
                    ? 'The ECG shows fusion beats, which occur when a normal beat and a ventricular beat happen simultaneously.'
                    : result.class === 'M'
                    ? 'The ECG shows patterns consistent with myocardial infarction (heart attack), indicating damage to the heart muscle.'
                    : result.class === 'Q'
                    ? 'The ECG shows an unclassifiable beat pattern that doesn\'t fit standard categories.'
                    : result.class === 'S'
                    ? 'The ECG shows supraventricular premature beats, which originate above the ventricles.'
                    : 'The ECG shows premature ventricular contractions, which are early beats originating from the ventricles.'
                  }
                </p>
              </div>
            </div>
            
            {/* Chart Card */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Probability Distribution</h2>
              {chartData && (
                <div className="h-64 flex items-center justify-center">
                  <Pie data={chartData} options={chartOptions} />
                </div>
              )}
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Top Predictions</h3>
                <ul className="space-y-2">
                  {result.top_predictions.map((pred, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="text-gray-700">{pred.class}: {pred.description}</span>
                      <span className="font-medium">{(pred.confidence * 100).toFixed(2)}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="mt-8 bg-blue-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <HiInformationCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Medical Disclaimer</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    This tool is for educational and research purposes only. It should not be used for 
                    medical diagnosis without consultation with a healthcare professional. Always 
                    consult with a qualified medical practitioner for interpretation of ECG results.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Back Button */}
          <div className="mt-8 flex justify-center">
            <Link to="/" className="btn btn-outline inline-flex items-center">
              <HiArrowNarrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;