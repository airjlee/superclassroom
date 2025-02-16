import React, { useState, useEffect, JSX } from 'react';
import { AlertCircle, Check, Loader2, FileText, Settings, List, Home, Bell, Search, User, X, Command, ArrowLeft, Save, ChevronDown, Upload, BookOpen, Clock, Layout, Brain, Download, Video, Users, Share } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { patients, Patient } from './Patient';
import { createInterface } from 'readline';
import './AnimatedGradient.css';
import LoadingScreen from './components/LoadingScreen';
/* tslint:disable */

const Alert = ({ children }: { children: React.ReactNode }) => <div className="bg-red-200 border-l-4 border-red-500 text-black p-4" role="alert">{children}</div>;
const AlertS = ({ children }: { children: React.ReactNode }) => <div className="bg-green-200 border-l-4 border-green-500 text-black p-4" role="alert">{children}</div>;
const AlertTitle = ({ children }: { children: React.ReactNode }) => <p className="font-bold">{children}</p>;
const AlertDescription = ({ children }: { children: React.ReactNode }) => <p>{children}</p>;
const Button = ({ children, variant, size, className, ...props }: any) => <button className={`px-4 py-2 bg-blue-200 text-black rounded ${className}`} {...props}>{children}</button>;
const Card = ({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <div className={`bg-gray-100 shadow-md rounded-2xl px-8 pt-6 pb-8 mb-4 ${className || ''}`} onClick={onClick}>
    {children}
  </div>
);
const CardHeader = ({ children }: { children: React.ReactNode }) => <div className="mb-4">{children}</div>;
const CardTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-xl font-bold text-black">{children}</h2>;
const CardDescription = ({ children }: { children: React.ReactNode }) => <p className="text-gray-400">{children}</p>;
const CardContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const Input = ({ className, ...props }: any) => (
  <input 
    className={`bg-white shadow appearance-none border border-gray-200 rounded-full w-full py-6 px-3 text-black leading-tight hover:border-gray-300 focus:border-gray-200 focus:ring-0 focus:outline-none transition-all duration-300 ease-in-out focus:py-10 ${className || ''}`}
    {...props} 
  />
);
const ScrollArea = ({ children, className }: { children: React.ReactNode, className: string }) => <div className={`overflow-auto ${className}`}>{children}</div>;

interface AuthRequest {
  id: string;
  patient: string;
  service: string;
  status: 'pending' | 'approved' | 'denied';
  date: string;
  details?: string;
  patientName: string;
  patientDOB: string;
  patientGender: string;
  patientAddress: string;
  patientCity: string;
  patientState: string;
  patientZip: string;
  patientPhone: string;
  patientEmail: string;
  patientInsuranceId: string;
  patientInsuranceName: string;
  referringProviderName: string;
  referringProviderNPI: string;
  referringProviderRelationship: string;
  servicingProviderName: string;
  servicingProviderNPI: string;
  serviceType: string;
  serviceStartDate: string;
  cptCodes: string;
  icdCodes: string;
  summaryMedicalNeed: string;
  reasonsRequestedMedication: string;
}

interface RequestDetailsProps {
  request: AuthRequest;
  onBack: () => void;
  onUpdate: (updatedRequest: AuthRequest) => void;
  onRequestUpdate: (id: string) => void;
}

interface DashboardProps {
  requests: Request[];
  onSelectRequest: (id: string) => void;
  onRequestUpdate: (id: string) => void;
  setActiveTab: () => void;
}

interface RequestCardProps {
  patient: string;
  service: string;
  date: string;
  status: string;
}

interface Request {
  id: string;
  patient: string;
  service: string;
  date: string;
  status: string;
}

interface ChartData {
  date: string;
  value: number;
}

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@providence.com' && password === 'password') {
      onLogin();
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] font-['Cooper_Hewitt']">
      <div className="w-full flex justify-center pt-8 mb-8">
        <span className="text-3xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 animated-gradient text-transparent bg-clip-text font-['Fago'] tracking-[-0.05em]">
          superclassroom
        </span>
      </div>
      
      <div className="flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <div className="text-center space-y-6 mb-8">
            <p className="text-gray-600 text-sm">superclassroom</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

            <div>
              <label htmlFor="pdf-upload" className="block text-sm font-medium text-gray-700">Upload PDF (Optional)</label>
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex items-center" role="alert">
              <AlertCircle className="text-red-400 mr-3" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Log in
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Forgot password?</a>
          </div>
        </div>
      </div>
    </div>
  );
};


const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-100 rounded-lg p-8 max-w-3xl w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-200">
          <X className="h-6 w-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

interface AICommandInputProps {
  onSuccess: (data: any) => void;
  requests: Patient[];
}

const AICommandInput: React.FC<AICommandInputProps> = ({ onSuccess, requests }) => {
  const [patientInfo, setPatientInfo] = useState('');
  const [procedure, setProcedure] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filteredRequests, setFilteredRequests] = useState<Patient[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Patient | null>(null);

  useEffect(() => {
    if (patientInfo.length > 2) {
      const filtered = requests.filter(request =>
        request.patientName.toLowerCase().includes(patientInfo.toLowerCase()) ||
        request.patientDateOfBirth.includes(patientInfo)
      );
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests([]);
    }
  }, [patientInfo, requests]);

  const handlePatientSelect = (request: Patient) => {
    setSelectedRequest(request);
    setPatientInfo(`${request.patientName} (${request.patientDateOfBirth})`);
    setFilteredRequests([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setResult(null);
    setError(null);

    try {
      const requestBody = {
        patient_info: selectedRequest ? {
          patientName: selectedRequest.patientName,
          patientDOB: selectedRequest.patientDateOfBirth,
          patientGender: selectedRequest.patientGender,
          patientAddress: selectedRequest.patientAddress,
          patientEmail: selectedRequest.patientEmail,
          patientInsuranceId: selectedRequest.healthInsuranceIDNumber,
          patientInsuranceName: selectedRequest.healthInsuranceName,
        } : patientInfo,
        procedure: procedure,
      };

      const response = await fetch('http://localhost:8000/api/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate request.');
      }

      const data = await response.json();
      setResult('Request generated successfully.');
      onSuccess(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="patientInfo" className="block text-sm font-medium text-gray-700">
            Patient Name or ID
          </label>
          <div className="relative">
            <Input
              id="patientInfo"
              value={patientInfo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatientInfo(e.target.value)}
              placeholder="Enter patient name or ID"
              className="w-full p-4 bg-gray-200 outline-none text-black"
              required
            />
            {filteredRequests.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto rounded-md shadow-lg">
                {filteredRequests.map((request) => (
                  <li
                    key={request.patientName}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePatientSelect(request)}
                  >
                    {request.patientName} ({request.patientDateOfBirth})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="procedure" className="block text-sm font-medium text-gray-700">
            Procedure
          </label>
          <Input
            id="procedure"
            value={procedure}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProcedure(e.target.value)}
            placeholder="Enter procedure"
            className="w-full p-4 bg-gray-200 outline-none text-black"
            required
          />
        </div>
        <Button type="submit" className="w-full bg-gray-900 p-4 text-white" disabled={isProcessing}>
          {isProcessing ? <Loader2 className="h-6 w-4 animate-spin mx-auto" /> : 'Generate'}
        </Button>
      </form>
      {result && (
        <Alert>
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{result}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert>
          <X className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

const RequestDetails: React.FC<RequestDetailsProps> = ({ request, onBack, onUpdate, onRequestUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<AuthRequest>(request);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData(request);
    setEditMode(false);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={onBack} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
        </Button>
        {!editMode && (
          <Button onClick={() => setEditMode(true)}>Edit Request</Button>
        )}
      </div>
      <Card>
        <div className="flex flex-row items-center justify-between">
          <CardHeader>
            <div>
              <CardTitle>{formData.patientName}</CardTitle>
              <CardDescription>{formData.service}</CardDescription>
            </div>
          </CardHeader>
              <div className="relative mr-4">
                <div
                  className={`px-4 py-2 rounded-full text-lg font-semibold ${getStatusColor(request.status)} flex items-center space-x-2 justify-center cursor-pointer`}
                  style={{ minWidth: '140px', height: '40px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(request.id);
                  }}
                >
                  <div className={`w-3 h-3 rounded-full ${getDotColor(request.status)}`} style={{ minWidth: '12px' }}></div>
                  <span>{capitalizeFirstLetter(request.status)}</span>
                  {request.status === 'pending' && (
                    <ChevronDown
                      className="h-5 w-5 ml-1"
                    />
                  )}
                </div>
                {request.status === 'pending' && openDropdown === request.id && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click event
                          onRequestUpdate(request.id);
                          setOpenDropdown(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                      >
                        Request Update
                      </button>
                    </div>
                  </div>
                )}
              </div>
        </div>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Request Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Patient Name</label>
                  <Input
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  <Input
                    name="patientDOB"
                    type="date"
                    value={formData.patientDOB}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </div>
                {/* Add other patient information fields here */}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Provider Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Referring Provider Name</label>
                  <Input
                    name="referringProviderName"
                    value={formData.referringProviderName}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Referring Provider NPI</label>
                  <Input
                    name="referringProviderNPI"
                    value={formData.referringProviderNPI}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </div>
                {/* Add other provider information fields here */}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Clinical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Service Type</label>
                  <Input
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Service Start Date</label>
                  <Input
                    name="serviceStartDate"
                    type="date"
                    value={formData.serviceStartDate}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </div>
                {/* Add other clinical information fields here */}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Rationale for Treatment</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Summary of Medical Need</label>
                <textarea
                  name="summaryMedicalNeed"
                  value={formData.summaryMedicalNeed}
                  onChange={handleInputChange}
                  rows={4}
                  className="bg-white shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  disabled={!editMode}
                />
              </div>
              <div>
                <label htmlFor="reasonsRequestedMedication" className="block text-sm font-medium mb-1">Reasons for Requested Medication or Service</label>
                <textarea
                  name="reasonsRequestedMedication"
                  value={formData.reasonsRequestedMedication}
                  onChange={handleInputChange}
                  rows={4}
                  className="bg-white shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              {/* Add other rationale fields here */}
            </div>

            {/* Add remaining sections (Patient Diagnosis, Patient Medical Records, Patient History, Physician Opinion) following the same pattern */}

            {editMode && (
              <Alert>
                <AlertCircle className="h-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Please ensure all information is accurate and complete before saving. Inaccurate or incomplete information may delay the authorization process.
                </AlertDescription>
              </Alert>
            )}

            {editMode && (
              <div className="flex justify-end space-x-4">
                <Button type="button" onClick={handleCancel} variant="secondary">
                  Cancel
                </Button>
                <Button type="submit" className="flex items-center">
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-200 text-yellow-800';
    case 'approved':
      return 'bg-green-200 text-green-800';
    case 'denied':
      return 'bg-red-200 text-red-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

const getDotColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500';
    case 'approved':
      return 'bg-green-500';
    case 'denied':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const mockApprovalData = [
  { date: '7/1/24', value: 1000 },
  { date: '7/2/24', value: 1200 },
  { date: '7/3/24', value: 800 },
  { date: '7/4/24', value: 1400 },
];

const mockSubmissionData = [
  { date: '7/1/24', value: 400 },
  { date: '7/2/24', value: 30 },
  { date: '7/3/24', value: 150 },
  { date: '7/4/24', value: 220 },
];

const ChartCard = ({ title, data }: { title: string; data: ChartData[] }): JSX.Element => (
  <Card className="w-full">
    <div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
    </div>
    <CardContent>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const RequestCard = ({ patient, service, date, status }: RequestCardProps) => (
  <Card className="w-full mb-4">
    <div className="flex justify-between items-center p-4">
      <CardContent>
        <div>
          <h3 className="font-semibold">{patient}</h3>
          <p className="text-sm text-gray-500">{service}</p>
          <p className="text-sm">Date: {date}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          status === 'Pending' ? 'bg-yellow-200 text-yellow-800' : 
          status === 'Approved' ? 'bg-green-200 text-green-800' : 
          'bg-red-200 text-red-800'
        }`}>
          {status}
        </span>
      </CardContent>
    </div>
  </Card>
);

const LeftMenu: React.FC<{ 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  onSaveProfile: () => void;
}> = ({ activeTab, setActiveTab, onSaveProfile }) => {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [adaptiveNotes, setAdaptiveNotes] = useState('');

  const handleSave = () => {
    setShowProfilePopup(false);
    onSaveProfile();
  };

  return (
    <div className="w-64 bg-[#f9fafb] h-screen p-6 flex flex-col border-r">
      {/* Logo Section */}
      <div className="mb-8">
        <span className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 animated-gradient text-transparent bg-clip-text font-['Fago'] tracking-[-0.05em]">
          superclassroom
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-6 flex-1">
        <div>
          <h2 className="text-xs uppercase text-gray-500 font-semibold mb-2">Main</h2>
          <ul className="space-y-1">
            {[
              { id: 'courses', icon: Home, label: 'Home' },
              { id: 'golden-notes', icon: BookOpen, label: 'SuperNotes' },
              { id: 'summaries', icon: List, label: 'Simplified Summaries' },
              { id: 'flashcards', icon: List, label: 'Flashcards' },
              { id: 'practice_exams', icon: FileText, label: 'Practice Exams' }
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-2 py-2 rounded-lg text-sm ${
                    activeTab === item.id 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs uppercase text-gray-500 font-semibold mb-2">Classes</h2>
          <ul className="space-y-1">
            {[
              { id: 'biology', icon: FileText, label: 'CHEM240' },
              { id: 'mathematics', icon: FileText, label: 'MATH206' },
              { id: 'algorithms', icon: FileText, label: 'CSE421' },
              { id: 'entrepreneurship', icon: FileText, label: 'ENTRE410' }
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-2 py-2 rounded-lg text-sm ${
                    activeTab === item.id 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* User Section */}
      <div className="mt-auto pt-6 border-t">
        <button 
          onClick={() => setShowProfilePopup(true)} 
          className="flex items-center space-x-3 w-full px-2 py-2 rounded-lg hover:bg-gray-100"
        >
          <User className="h-6 w-6 text-gray-600" />
          <div className="text-sm text-left">
            <p className="text-gray-900 font-medium">Zachary Lee</p>
            <p className="text-gray-500 text-xs">zaclee@uw.edu</p>
          </div>
        </button>
      </div>

      {/* Profile Popup */}
      {showProfilePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 relative">
            <button 
              onClick={() => setShowProfilePopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="space-y-6">
              <div className="text-center">
                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mx-auto flex items-center justify-center">
                  <span className="text-2xl font-semibold text-white">Z</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold">Zachary</h3>
                <p className="text-gray-500 text-sm">Student</p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700"></h4>
                <textarea
                  value={adaptiveNotes}
                  onChange={(e) => setAdaptiveNotes(e.target.value)}
                  placeholder="Add notes about learning style, preferences, or accommodations..."
                  className="w-full h-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="pt-4 border-t">
                <button
                  onClick={handleSave}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mockStudyProgress = [
  { date: '7/1/24', value: 85 },
  { date: '7/2/24', value: 88 },
  { date: '7/3/24', value: 92 },
  { date: '7/4/24', value: 95 },
] as const;

const mockQuizScores = [
  { date: '7/1/24', value: 75 },
  { date: '7/2/24', value: 82 },
  { date: '7/3/24', value: 88 },
  { date: '7/4/24', value: 90 },
] as const;

const DetailView: React.FC<{ 
  title: string;
  itemTitle: string;
  onBack: () => void;
}> = ({ title, itemTitle, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <span className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 animated-gradient text-transparent bg-clip-text font-['Fago'] tracking-[-0.05em]">
            superclassroom
          </span>
          <button 
            onClick={onBack}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Back to {title}</span>
          </button>
          </div>
        </div>
        </div>
        
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="mb-8 bg-white rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{itemTitle}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Last updated 2 days ago
            </span>
            <span>•</span>
            <span className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Created by Dr. Smith
            </span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content Preview */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-600 leading-relaxed">
                This comprehensive material covers fundamental concepts and advanced applications.
                Students will learn through interactive examples and practical demonstrations.
              </p>
              <div className="mt-6 flex items-center space-x-4">
                <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>View Full Content</span>
                </button>
                <button className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Resources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: BookOpen, title: "Study Guide", desc: "Comprehensive review materials" },
                  { icon: Video, title: "Video Lectures", desc: "Recorded explanations" },
                  { icon: FileText, title: "Practice Problems", desc: "Exercise sets with solutions" },
                  { icon: Users, title: "Discussion Forum", desc: "Student Q&A platform" }
                ].map((resource, index) => (
                  <div key={index} className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                      <resource.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{resource.title}</h3>
                      <p className="text-sm text-gray-500">{resource.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-medium text-gray-900">75%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Time spent</span>
                    <span>2.5 hours</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Brain className="h-5 w-5 text-purple-500 mr-3" />
                    <span className="font-medium text-gray-700">Start Quiz</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Save className="h-5 w-5 text-green-500 mr-3" />
                    <span className="font-medium text-gray-700">Save Notes</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Share className="h-5 w-5 text-blue-500 mr-3" />
                    <span className="font-medium text-gray-700">Share</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseContent: React.FC<{ 
  course: string; 
  activeTab?: string;
  onItemSelect: (item: { type: string; id: number; title: string }, course: string) => void;
}> = ({ course, activeTab, onItemSelect }) => {
  const [selectedTab, setSelectedTab] = useState('notes');
  
  // Helper to get course details
  const getCourseDetails = (courseName: string) => {
    const courseMap: { [key: string]: { title: string; description: string } } = {
      'biology': {
        title: 'Organic Chemistry',
        description: 'Introduction to Cell Biology and Genetics'
      },
      'mathematics': {
        title: 'Mathematics 201',
        description: 'Advanced Calculus and Linear Algebra'
      },
      // Add more courses as needed
    };
    return courseMap[courseName.toLowerCase()] || { title: courseName, description: '' };
  };

  const courseDetails = getCourseDetails(course);

  // Updated tabs array: practice exam is now the last tab (on the very right)
  const tabs = [
    { id: 'upload', label: 'Upload Files', icon: <Command className="h-4 w-4" /> },
    { id: 'notes', label: 'SuperNotes', icon: <Save className="h-4 w-4" /> },
    { id: 'summaries', label: 'Summaries', icon: <List className="h-4 w-4" /> },
    { id: 'flashcards', label: 'Flashcards', icon: <Command className="h-4 w-4" /> },
    { id: 'practice', label: 'Practice Exams', icon: <FileText className="h-4 w-4" /> },
  ];

  // NEW: State to hold uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // NEW: Handler to add files (from drop or file input)
  const handleFiles = (files: File[]) => {
    setUploadedFiles(prevFiles => [...prevFiles, ...files]);
  };

  // NEW: Handler to remove a file by index
  const removeFile = (index: number) => {
    setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleUploadAll = async () => {
    if (!uploadedFiles.length) return;

    const filesToUpload = [...uploadedFiles];
    setUploadedFiles([]); // Clear the list immediately
  
    for (let i = 0; i < filesToUpload.length; i++) {
      const formData = new FormData();
      // Make sure to append the file first
      formData.append('file', filesToUpload[i], filesToUpload[i].name);
      formData.append('course', course || '');
  
      try {
        const response = await fetch('http://localhost:8000/upload', {
          method: 'POST',
          body: formData,
        });
  
        const result = await response.json();
        if (!response.ok) {
          console.error('Upload error:', result);
          alert(`Failed to upload ${filesToUpload[i].name}: ${result.message || 'Unsupported file type'}`);
          // Add failed files back to the list
          setUploadedFiles(prev => [...prev, filesToUpload[i]]);
        }
      } catch (error) {
        console.error('Upload error:', error);
        const message = error instanceof Error ? error.message : 'Network error';
        alert(`Failed to upload ${filesToUpload[i].name}: ${message}`);
        // Add failed files back to the list
        setUploadedFiles(prev => [...prev, filesToUpload[i]]);
      }
    }
    
    if (filesToUpload.length > 0) {
      alert('Upload process completed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Enhanced Course Title and Description */}
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">{courseDetails.title}</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">{courseDetails.description}</p>
      </div>
      
      {/* Enhanced Tab Bar */}
      <div className="flex justify-center border-b border-gray-200 mb-12">
        <div className="flex space-x-8">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`
                flex items-center gap-3 py-4 px-4 relative
              ${selectedTab === tab.id 
                  ? 'text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
              <div className="flex items-center gap-2">
            {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
              </div>
              {selectedTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
          </button>
        ))}
        </div>
      </div>
      
      {/* Content Container with Max Width and Padding */}
      <div className="max-w-5xl mx-auto">
      {selectedTab === 'upload' && (
          <div className="flex flex-col items-center justify-center">
          <div 
              className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center bg-white hover:border-blue-500 transition-all duration-300 hover:shadow-lg"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const files = Array.from(e.dataTransfer.files);
              handleFiles(files);
            }}
          >
              <div className="p-4 bg-blue-50 rounded-full mb-6">
                <Upload className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Upload Course Materials</h3>
              <p className="text-gray-500 text-center mb-8 max-w-md">
                Drag and drop your files here, or click to select files from your computer
            </p>
            <input
              type="file"
              multiple
              className="hidden"
              id="file-upload"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                handleFiles(files);
              }}
            />
            <label
              htmlFor="file-upload"
                className="px-6 py-3 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Select Files
            </label>
              <p className="text-sm text-gray-400 mt-6">
              Supported files: PDF, DOC, DOCX, PPT, PPTX (up to 50MB each)
            </p>
          </div>
          
            {/* Enhanced uploaded files list */}
          {uploadedFiles.length > 0 && (
              <div className="w-full mt-8 space-y-3 bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h4 className="text-lg font-medium text-gray-900">Uploaded Files</h4>
                  <button 
                    onClick={() => handleUploadAll()}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Upload All Files
                  </button>
                </div>
                <div className="space-y-4 mt-4">
              {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900">{file.name}</span>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(index)} 
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
                </div>
            </div>
          )}
        </div>
      )}

        {/* Other tab content remains the same but with added padding and spacing */}
      {selectedTab === 'practice' && (
          <div className="grid gap-6">
          {[
            { 
              id: 1, 
              title: "Midterm Practice Exam", 
              preview: "Comprehensive review of chapters 1-5",
              questionCount: 50,
              timeLimit: "90 min",
              difficulty: "Medium",
              lastScore: 85,
              attempts: 2,
              status: "Available"
            },
            { 
              id: 2, 
              title: "Quiz 1 Practice", 
              preview: "Focus on fundamental concepts",
              questionCount: 25,
              timeLimit: "45 min",
              difficulty: "Easy",
              lastScore: 92,
              attempts: 1,
              status: "Available"
            },
            { 
              id: 3, 
              title: "Final Exam Practice", 
              preview: "Complete course material coverage",
              questionCount: 100,
              timeLimit: "180 min",
              difficulty: "Hard",
              lastScore: null,
              attempts: 0,
              status: "Locked",
              availableDate: "Dec 1, 2024"
            }
          ].map((exam) => (
            <div
              key={exam.id}
                onClick={() => onItemSelect({ type: 'practice', id: exam.id, title: exam.title }, course)}
              className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      exam.status === 'Locked' 
                        ? 'bg-gray-100 text-gray-700' 
                        : 'bg-green-50 text-green-700'
                    }`}>
                      {exam.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{exam.preview}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <List className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{exam.questionCount} questions</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{exam.timeLimit}</span>
                      </div>
                    </div>
                  </div>
                  {exam.lastScore !== null && (
                    <div className="mt-3 flex items-center justify-between border-t pt-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Last Score:</span>
                        <span className="text-sm font-medium text-blue-600">{exam.lastScore}%</span>
                      </div>
                      <span className="text-sm text-gray-500">{exam.attempts} attempts</span>
                    </div>
                  )}
                  {exam.status === 'Locked' && (
                    <div className="mt-3 text-sm text-gray-500 border-t pt-3">
                      Available from: {exam.availableDate}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
        
      {selectedTab === 'notes' && (
          <div className="grid gap-6">
          {[
            { id: 1, title: "Chapter 1: Introduction", preview: "Key concepts and fundamental principles", progress: 85, lastUpdated: "2 days ago" },
            { id: 2, title: "Chapter 2: Core Concepts", preview: "Deep dive into the core mechanisms", progress: 65, lastUpdated: "1 week ago" },
            { id: 3, title: "Chapter 3: Advanced Topics", preview: "Exploring complex interactions", progress: 30, lastUpdated: "3 days ago" }
          ].map((note) => (
            <div
              key={note.id}
                onClick={() => onItemSelect({ type: 'notes', id: note.id, title: note.title }, course)}
              className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 text-gray-900">{note.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{note.preview}</p>
                  <div className="flex items-center justify-between">
                    <div className="w-32">
                      <ProgressBar progress={note.progress} />
                    </div>
                    <span className="text-xs text-gray-500">Updated {note.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
        
      {selectedTab === 'summaries' && (
          <div className="grid gap-6">
          {[
            { id: 1, title: "Week 1 Summary", preview: "Overview of introductory materials", wordCount: 1200, readTime: "5 min", status: "Complete" },
            { id: 2, title: "Week 2 Summary", preview: "Summary of key theories", wordCount: 1500, readTime: "7 min", status: "In Progress" },
            { id: 3, title: "Week 3 Summary", preview: "Analysis of major concepts", wordCount: 1800, readTime: "8 min", status: "Not Started" }
          ].map((summary) => (
            <div
              key={summary.id}
                onClick={() => onItemSelect({ type: 'summaries', id: summary.id, title: summary.title }, course)}
              className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{summary.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      summary.status === 'Complete' ? 'bg-green-100 text-green-700' :
                      summary.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {summary.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{summary.preview}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {summary.wordCount} words
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {summary.readTime} read
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
        
      {selectedTab === 'flashcards' && (
          <div className="grid gap-6">
          {[
            { id: 1, title: "Basic Concepts", count: 24, preview: "Fundamental terms and definitions", mastery: 85, dueCards: 12, lastStudied: "Today" },
            { id: 2, title: "Advanced Terms", count: 32, preview: "Complex terminology and applications", mastery: 65, dueCards: 8, lastStudied: "Yesterday" },
            { id: 3, title: "Final Review", count: 45, preview: "Comprehensive review set", mastery: 45, dueCards: 15, lastStudied: "3 days ago" }
          ].map((deck) => (
            <div
              key={deck.id}
                onClick={() => onItemSelect({ type: 'flashcards', id: deck.id, title: deck.title }, course)}
              className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                  <Layout className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{deck.title}</h3>
                    <span className="text-sm font-medium px-2 py-1 bg-green-50 text-green-700 rounded-full">
                      {deck.count} cards
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{deck.preview}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">{deck.mastery}% Mastery</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Last studied {deck.lastStudied}</span>
                      </div>
                    </div>
                    <span className="text-sm text-orange-600 font-medium flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {deck.dueCards} due
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

const Dashboard = ({ onSelectCourse, setActiveTab }: { onSelectCourse: (course: string) => void; setActiveTab: (tab: string) => void; }): JSX.Element => {
  const [courseSearchInput, setCourseSearchInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<any>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleCourseSearch = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: courseSearchInput })
      });
      const data = await response.json();
      setResponseData(data);
      
    } catch (error) {
      console.error('Course search error:', error);
      setIsLoading(false);
    }
  };

  const handleLoadingFinish = () => {
    setIsLoading(false);
    if (responseData) {
      // First select the course (biology for Organic Chemistry)
      onSelectCourse('biology');
      // Then navigate to the SuperNotes tab
      setTimeout(() => {
        setActiveTab('golden-notes');
      }, 100);
    }
    setCourseSearchInput("");
  };

  return (
    <div className="flex-1">
      {isLoading && <LoadingScreen onFinish={handleLoadingFinish} />}
      <h2 className="text-4xl font-semibold mb-8 mt-8 text-center">
        Hello, <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">Zachary</span>
      </h2>
      <div className="h-32">
        <div className="relative max-w-xl mx-auto">
          <Command className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="course: topics..."
            className="pl-12 pr-4 py-5 w-full bg-white text-sm rounded-full border-gray-200"
            value={courseSearchInput}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCourseSearchInput(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCourseSearch();
                setCourseSearchInput("");
              }
            }}
          />
          <div className="absolute left-1/2 transform -translate-x-1/2" style={{ width: '200px', top: '80px' }}>
            <button
              onClick={() => {
                handleCourseSearch();
                setCourseSearchInput("");
              }}
              className={`w-full mt-12 bg-gradient-to-r from-blue-500 to-purple-500 animated-gradient text-white py-3 px-6 rounded-full font-medium hover:opacity-90 transition-all duration-150 ${
                isSearchFocused ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Generate
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 my-24 gap-6">
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow bg-white"
          onClick={() => onSelectCourse('biology')}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Organic Chemistry</CardTitle>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                CHEM240
              </span>
            </div>
            <CardDescription>Introduction to Organic Chemistry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Progress: 65%</p>
                <ProgressBar progress={65} />
              </div>
              <ArrowLeft className="h-4 w-4 transform rotate-180" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow bg-white"
          onClick={() => onSelectCourse('mathematics')}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Advanced Calculus</CardTitle>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                MATH206
              </span>
            </div>
            <CardDescription>Calculus and Linear Algebra</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Progress: 42%</p>
                <ProgressBar progress={42} />
              </div>
              <ArrowLeft className="h-4 w-4 transform rotate-180" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow bg-white"
          onClick={() => onSelectCourse('algorithms')}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Algorithms</CardTitle>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                CSE421
              </span>
            </div>
            <CardDescription>Design and Analysis of Algorithms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Progress: 35%</p>
                <ProgressBar progress={35} />
              </div>
              <ArrowLeft className="h-4 w-4 transform rotate-180" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow bg-white"
          onClick={() => onSelectCourse('entrepreneurship')}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>CS Entrepreneurship</CardTitle>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                ENTRE440
              </span>
            </div>
            <CardDescription>Business Fundamentals for Engineers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Progress: 20%</p>
                <ProgressBar progress={20} />
              </div>
              <ArrowLeft className="h-4 w-4 transform rotate-180" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ActiveRequests: React.FC<{ requests: AuthRequest[], onSelectRequest: (id: string) => void, onRequestUpdate: (id: string) => void }> = ({ requests, onSelectRequest, onRequestUpdate }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <ScrollArea className="h-max">
      <div className="space-y-4">
        {[...requests].reverse().map((request: Request) => (
          <Card 
            key={request.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelectRequest(request.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <CardHeader>
                  <CardTitle>{request.patient}</CardTitle>
                  <CardDescription>{request.service}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-black">Date: {request.date}</p>
                </CardContent>
              </div>
              <div className="relative">
              <div
                className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(request.status)} flex items-center space-x-2 justify-center cursor-pointer`}
                style={{ width: '110px', height: '28px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown(request.id);
                }}
              >
                <div className={`w-2 h-2 rounded-full ${getDotColor(request.status)}`} style={{ minWidth: '8px' }}></div>
                <span>{capitalizeFirstLetter(request.status)}</span>
                {request.status === 'pending' && <ChevronDown className="h-4 w-4 ml-1" />}
              </div>
                {request.status === 'pending' && openDropdown === request.id && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click event
                          onRequestUpdate(request.id);
                          setOpenDropdown(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                      >
                        Request Update
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

const SuccessAlert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 w-72">
      <AlertS >
        <Check className="h-4 w-4" />
        <AlertDescription>{message}</AlertDescription>
      </AlertS >
    </div>
  );
};

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  const [fill, setFill] = useState(0);

  useEffect(() => {
    // Trigger the fill animation shortly after mount
    const timer = setTimeout(() => {
      setFill(progress);
    }, 100); // 100ms delay before animating the fill
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="w-48 h-2 bg-gray-200 rounded-full">
      <div 
        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
        style={{ width: `${fill}%` }}
      />
    </div>
  );
};

const SuperClassroomApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<null | { type: string; id: number; title: string; course: string }>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const handleCourseSelect = (course: string) => {
    setSelectedCourse(course);
    setActiveTab('upload');

  };

  const handleItemSelect = (item: { type: string; id: number; title: string }, course: string) => {
    setSelectedItem({ ...item, course });
  };

  const handleBackFromDetail = () => {
    setSelectedItem(null);
  };

  const handleProfileSave = () => {
    setShowSaveConfirmation(true);
    setTimeout(() => {
      setShowSaveConfirmation(false);
    }, 2000);
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
    }

    if (selectedItem) {
      return (
        <DetailView
          title={`${selectedItem.course} ${capitalizeFirstLetter(selectedItem.type)}`}
          itemTitle={selectedItem.title}
          onBack={handleBackFromDetail}
        />
      );
    }

    switch (activeTab) {
      case 'courses':
        return (
          <div className="flex">
            <LeftMenu 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              onSaveProfile={handleProfileSave}
            />
            <div className="flex-1 p-8">
              <Dashboard 
                onSelectCourse={handleCourseSelect} 
                setActiveTab={setActiveTab}
              />
            </div>
          </div>
        );
      case 'golden-notes':
      case 'summaries':
      case 'flashcards':
      case 'upload':
        return (
          <div className="flex">
            <LeftMenu activeTab={activeTab} setActiveTab={setActiveTab} onSaveProfile={handleProfileSave} />
            <main className="flex-1 p-8 overflow-auto">
              {selectedCourse ? (
                <CourseContent 
                  course={selectedCourse} 
                  activeTab={activeTab}
                  onItemSelect={handleItemSelect}
                />
              ) : (
                <div className="text-center text-gray-600 mt-8">
                  Please select a course first
                </div>
              )}
            </main>
          </div>
        );
      default:
        return (
          <div className="flex">
            <LeftMenu activeTab={activeTab} setActiveTab={setActiveTab} onSaveProfile={handleProfileSave} />
            <div className="flex-1 p-8">
              <Dashboard 
                onSelectCourse={handleCourseSelect} 
                setActiveTab={setActiveTab}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-gray-50 text-black">
      {showSaveConfirmation && (
        <div className="fixed bottom-4 right-4 bg-green-100 text-green-700 px-4 py-2 rounded-lg shadow-lg flex items-center z-50">
          <Check className="h-4 w-4 mr-2" />
          Changes saved successfully
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default SuperClassroomApp;