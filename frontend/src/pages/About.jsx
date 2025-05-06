import { HiOutlineChartPie, HiOutlineChip, HiOutlineDatabase } from 'react-icons/hi';

const About = () => {
  const arrhythmiaTypes = [
    {
      code: 'F',
      name: 'Fusion of ventricular and normal beat',
      description: 'A fusion beat occurs when a normal beat and a ventricular beat happen at approximately the same time.',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      code: 'M',
      name: 'Myocardial infarction',
      description: 'Also known as a heart attack, occurs when blood flow to part of the heart is blocked, causing damage to the heart muscle.',
      color: 'bg-red-100 text-red-800',
    },
    {
      code: 'N',
      name: 'Normal beat',
      description: 'A regular heartbeat pattern with normal conduction and timing.',
      color: 'bg-green-100 text-green-800',
    },
    {
      code: 'Q',
      name: 'Unclassifiable beat',
      description: 'Beats that don\'t fit into standard classification categories.',
      color: 'bg-purple-100 text-purple-800',
    },
    {
      code: 'S',
      name: 'Supraventricular premature beat',
      description: 'Early beats that originate above the ventricles, usually in the atria.',
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      code: 'V',
      name: 'Premature ventricular contraction',
      description: 'Early beats that originate from the ventricles of the heart.',
      color: 'bg-orange-100 text-orange-800',
    },
  ];

  const modelDetails = [
    {
      icon: HiOutlineChip,
      title: 'CNN Architecture',
      description: 'Our model uses a deep convolutional neural network with multiple convolutional and max pooling layers, followed by fully connected layers. This architecture is specifically designed to extract features from ECG images.',
    },
    {
      icon: HiOutlineDatabase,
      title: 'Training Data',
      description: 'The model was trained on a dataset derived from the MIT-BIH Arrhythmia Dataset and The PTB Diagnostic ECG Database, containing thousands of labeled ECG samples across different arrhythmia types.',
    },
    {
      icon: HiOutlineChartPie,
      title: 'Performance Metrics',
      description: 'Our model achieves high accuracy in classifying the different types of cardiac arrhythmias, with particular strength in identifying normal beats, ventricular contractions, and myocardial infarction patterns.',
    },
  ];

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-16">
          <h1 className="text-4xl font-bold mb-4">About This Project</h1>
          <p className="text-lg max-w-3xl">
            Learn more about ECG arrhythmia classification, the model architecture,
            and the different types of cardiac arrhythmias analyzed in this project.
          </p>
        </div>
      </div>

      {/* Project Overview */}
      <div className="py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title">Project Overview</h2>
            <p className="text-gray-600 mb-6">
              This project uses deep learning techniques to classify electrocardiogram (ECG) images 
              into different types of cardiac arrhythmias. The goal is to assist healthcare 
              professionals in diagnosing heart conditions more efficiently and accurately.
            </p>
            <p className="text-gray-600">
              The classification model was developed using a Convolutional Neural Network (CNN) 
              trained on a dataset derived from two renowned ECG databases: the MIT-BIH Arrhythmia 
              Dataset and The PTB Diagnostic ECG Database. This combination provides a robust 
              foundation for accurate arrhythmia classification.
            </p>
          </div>
        </div>
      </div>

      {/* Arrhythmia Types */}
      <div className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="section-title text-center">Types of Arrhythmias</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
            Our model classifies ECG images into six different categories of cardiac patterns.
            Understanding these different types can help in better interpretation of the results.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {arrhythmiaTypes.map((type) => (
              <div key={type.code} className="card p-6">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${type.color}`}>
                  {type.code}: {type.name}
                </div>
                <p className="text-gray-600">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Details */}
      <div className="py-12">
        <div className="container-custom">
          <h2 className="section-title text-center">Our Model</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
            The deep learning model behind this project is designed to extract 
            features from ECG images and classify them with high accuracy.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {modelDetails.map((detail, index) => (
              <div key={index} className="card p-6">
                <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                  <detail.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{detail.title}</h3>
                <p className="text-gray-600">{detail.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Research References */}
      <div className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title">References</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>
                <a 
                  href="https://physionet.org/content/mitdb/1.0.0/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  MIT-BIH Arrhythmia Database
                </a>
                : A standard reference database for arrhythmia detectors.
              </li>
              <li>
                <a 
                  href="https://physionet.org/content/ptbdb/1.0.0/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  PTB Diagnostic ECG Database
                </a>
                : A collection of ECGs from patients with various heart conditions.
              </li>
              <li>
                <a 
                  href="https://www.kaggle.com/datasets/erhmrai/ecg-image-data" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  ECG Arrhythmia Image Dataset on Kaggle
                </a>
                : The dataset used for training and testing the model.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;