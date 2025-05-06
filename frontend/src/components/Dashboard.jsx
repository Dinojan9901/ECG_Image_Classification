import { useState, useEffect } from 'react';
import { HiRefresh, HiChartBar, HiDocumentText, HiShieldCheck } from 'react-icons/hi';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPredictions: 0,
    classDistribution: {},
    modelAccuracy: 0,
    apiStatus: 'Checking...'
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  // Simulated class distribution for demo purposes
  const mockClassDistribution = {
    N: 42,
    V: 28,
    F: 15,
    S: 10,
    M: 22,
    Q: 8
  };
  
  // Check API status
  const checkApiStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/health`);
      return response.data.status === 'healthy' ? 'Online' : 'Degraded';
    } catch (error) {
      return 'Offline';
    }
  };
  
  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, we would fetch this data from the backend
      // For now, use hardcoded demo data
      const apiStatus = await checkApiStatus();
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalPredictions: 125,
        classDistribution: mockClassDistribution,
        modelAccuracy: 0.945,
        apiStatus
      });
    } catch (error) {
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Online':
        return 'text-green-500';
      case 'Degraded':
        return 'text-yellow-500';
      case 'Offline':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  // Format large numbers
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };
  
  return (
    <div className="bg-gray-50 py-8">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-6">
          <h2 className="section-title mb-0">Dashboard</h2>
          <button
            onClick={fetchDashboardData}
            className="btn btn-outline inline-flex items-center text-sm"
            disabled={isLoading}
          >
            <HiRefresh className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        
        {error ? (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                    <HiChartBar className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Predictions</h3>
                    <p className="text-2xl font-semibold">{formatNumber(stats.totalPredictions)}</p>
                  </div>
                </div>
              </div>
              
              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <HiDocumentText className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Model Accuracy</h3>
                    <p className="text-2xl font-semibold">{(stats.modelAccuracy * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              
              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <HiShieldCheck className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">API Status</h3>
                    <p className={`text-xl font-semibold ${getStatusColor(stats.apiStatus)}`}>
                      {stats.apiStatus}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Class Distribution */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Class Distribution</h3>
              <div className="space-y-4">
                {Object.entries(stats.classDistribution).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {key}: {getClassFullName(key)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {value} ({calculatePercentage(value, stats.totalPredictions)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={getClassBarColor(key)}
                        style={{ width: `${calculatePercentage(value, stats.totalPredictions)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Helper functions
const getClassFullName = (classCode) => {
  const classNames = {
    F: 'Fusion of ventricular and normal beat',
    M: 'Myocardial infarction',
    N: 'Normal beat',
    Q: 'Unclassifiable beat',
    S: 'Supraventricular premature beat',
    V: 'Premature ventricular contraction'
  };
  
  return classNames[classCode] || classCode;
};

const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return ((value / total) * 100).toFixed(1);
};

const getClassBarColor = (classCode) => {
  const colors = {
    N: 'bg-green-600',
    F: 'bg-blue-600',
    M: 'bg-red-600',
    Q: 'bg-purple-600',
    S: 'bg-yellow-500',
    V: 'bg-orange-500'
  };
  
  return colors[classCode] || 'bg-gray-600';
};

export default Dashboard;