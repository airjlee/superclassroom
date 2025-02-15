import React, { useState, useEffect, JSX } from 'react';
import { AlertCircle, Check, Loader2, FileText, Settings, List, Home, Bell, Search, User, X, Command, ArrowLeft, Save, ChevronDown, Upload } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import logo from './serenity-logo.png';
import { patients, Patient } from './Patient';
import { createInterface } from 'readline';

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
        <img src={logo} alt="Logo" className="h-16 w-auto" />
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

const LeftMenu: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => (
  <div className="w-64 bg-[#f9fafb] h-screen p-6 flex flex-col border-r">
    {/* Logo Section */}
    <div className="mb-8">
      <img src={logo} alt="Logo" className="h-8 w-auto" />
    </div>

    {/* Main Navigation */}
    <nav className="space-y-6 flex-1">
      <div>
        <h2 className="text-xs uppercase text-gray-500 font-semibold mb-2">Main</h2>
        <ul className="space-y-1">
          {[
            { id: 'courses', icon: Home, label: 'My Courses' },
            { id: 'golden-notes', icon: FileText, label: 'Golden Notes' },
            { id: 'summaries', icon: List, label: 'Simplified Summaries' },
            { id: 'flashcards', icon: Command, label: 'Flashcards' }
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
            { id: 'biology', icon: FileText, label: 'Biology 101' },
            { id: 'mathematics', icon: FileText, label: 'Mathematics 201' },
            { id: 'algorithms', icon: FileText, label: 'Intro to Algorithms' },
            { id: 'entrepreneurship', icon: FileText, label: 'Entrepreneurship 101' }
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
    <div className="mt-auto pt-4 border-t">
      <button className="flex items-center space-x-3 w-full px-2 py-2 rounded-lg hover:bg-gray-100">
        <User className="h-6 w-6 text-gray-600" />
        <div className="text-sm text-left">
          <p className="text-gray-900 font-medium">Student Name</p>
          <p className="text-gray-500 text-xs">student@email.com</p>
        </div>
      </button>
    </div>
  </div>
);

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

const CourseContent: React.FC<{ course: string; activeTab?: string }> = ({ course, activeTab }) => {
  const [selectedTab, setSelectedTab] = useState(activeTab || 'upload');
  
  // Tab configuration with icons and labels
  const tabs = [
    { id: 'practice', label: 'Practice Exam', icon: <FileText className="h-4 w-4" /> },
    { id: 'upload', label: 'Upload Files', icon: <Command className="h-4 w-4" /> },
    { id: 'notes', label: 'Golden Notes', icon: <Save className="h-4 w-4" /> },
    { id: 'summaries', label: 'Summaries', icon: <List className="h-4 w-4" /> },
    { id: 'flashcards', label: 'Flashcards', icon: <Command className="h-4 w-4" /> },
  ];

  // Helper to get course details
  const getCourseDetails = (courseName: string) => {
    const courseMap: { [key: string]: { title: string; description: string } } = {
      'biology': {
        title: 'Biology 101',
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

  return (
    <div>
      {/* Smaller Tab Bar with Icons */}
      <div className="flex border-b mb-6 gap-2">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`
              flex items-center gap-2 py-2 px-3 text-sm
              ${selectedTab === tab.id 
                ? 'border-b-2 border-blue-500 text-blue-500 font-medium' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      
      {/* Course Title and Description */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black">{courseDetails.title}</h2>
        <p className="text-gray-400">{courseDetails.description}</p>
      </div>
      
      {/* Content Sections */}
      {selectedTab === 'upload' && (
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto">
          <div 
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center bg-white hover:border-blue-500 transition-colors duration-300"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const files = Array.from(e.dataTransfer.files);
              console.log('Dropped files:', files);
              // Handle file upload here
            }}
          >
            <Upload className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Upload Course Materials</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Drag and drop your files here, or click to select files
            </p>
            <input
              type="file"
              multiple
              className="hidden"
              id="file-upload"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                console.log('Selected files:', files);
                // Handle file upload here
              }}
            />
            <label
              htmlFor="file-upload"
              className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition-colors duration-300"
            >
              Select Files
            </label>
            <p className="text-xs text-gray-400 mt-4">
              Supported files: PDF, DOC, DOCX, PPT, PPTX (up to 50MB each)
            </p>
          </div>
          
          {/* File List - Add this if you want to show uploaded files */}
          <div className="w-full mt-8 space-y-3">
            {/* Example uploaded files - replace with actual uploaded files state */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-700">lecture_notes_week1.pdf</span>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedTab === 'practice' && (
        <Card>
          <CardHeader>
            <CardTitle>Practice Exam</CardTitle>
            <CardDescription>Test your knowledge of {courseDetails.title}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Practice exam content */}
          </CardContent>
        </Card>
      )}
      {selectedTab === 'notes' && (
        <Card>
          <CardHeader>
            <CardTitle>Golden Notes</CardTitle>
            <CardDescription>Curated notes for {courseDetails.title}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Golden notes content */}
          </CardContent>
        </Card>
      )}
      {selectedTab === 'summaries' && (
        <Card>
          <CardHeader>
            <CardTitle>Summaries</CardTitle>
            <CardDescription>Chapter summaries for {courseDetails.title}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Summaries content */}
          </CardContent>
        </Card>
      )}
      {selectedTab === 'flashcards' && (
        <Card>
          <CardHeader>
            <CardTitle>Flashcards</CardTitle>
            <CardDescription>Study flashcards for {courseDetails.title}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Flashcards content */}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const Dashboard = ({ onSelectCourse }: { onSelectCourse: (course: string) => void }): JSX.Element => {
  return (
    <div className="flex-1">
      <h2 className="text-4xl font-semibold mb-8 mt-8 text-center">
        Hello, <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">Zachary</span>
      </h2>
      <div className="relative max-w-xl mx-auto mt-4 mb-16">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search..."
          className="pl-12 pr-4 py-5 w-full bg-white text-sm rounded-full border-gray-200"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow bg-white"
          onClick={() => onSelectCourse('biology')}
        >
          <CardHeader>
            <CardTitle>Biology 101</CardTitle>
            <CardDescription>Introduction to Cell Biology and Genetics</CardDescription>
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
            <CardTitle>Mathematics 201</CardTitle>
            <CardDescription>Advanced Calculus and Linear Algebra</CardDescription>
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
            <CardTitle>Introduction to Algorithms</CardTitle>
            <CardDescription>Fundamentals of Algorithm Design and Analysis</CardDescription>
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
            <CardTitle>Entrepreneurship 101</CardTitle>
            <CardDescription>Introduction to Business and Startups</CardDescription>
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
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleCourseSelect = (course: string) => {
    setSelectedCourse(course);
    setActiveTab('upload');
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
    }

    switch (activeTab) {
      case 'courses':
        return (
          <div className="flex">
            <LeftMenu activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 p-8">
              <Dashboard onSelectCourse={handleCourseSelect} />
            </div>
          </div>
        );
      case 'golden-notes':
      case 'summaries':
      case 'flashcards':
      case 'upload':
        return (
          <div className="flex">
            <LeftMenu activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 p-8 overflow-auto">
              {selectedCourse ? (
                <CourseContent course={selectedCourse} activeTab={activeTab} />
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
            <LeftMenu activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 p-8">
              <Dashboard onSelectCourse={handleCourseSelect} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-gray-50 text-black">
      {renderContent()}
    </div>
  );
};

export default SuperClassroomApp;