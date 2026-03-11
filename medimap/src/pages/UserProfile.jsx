import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Calendar, Edit2, Camera, 
  Shield, Bell, LogOut, ChevronRight, Save, X, Heart,
  FileText, Clock, Settings, Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [setupErrors, setSetupErrors] = useState({});
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    address: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    emergencyContact: '',
    avatar: null,
  });

  const [editData, setEditData] = useState({ ...user });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(prev => ({ ...prev, ...parsedUser }));
      setEditData(prev => ({ ...prev, ...parsedUser }));
      if (parsedUser.profileComplete === false) {
        setIsSetupMode(true);
        setIsEditing(true);
        setActiveTab('profile');
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const validateSetup = () => {
    const errs = {};
    if (!editData.name?.trim()) errs.name = 'Name is required';
    if (!editData.email?.trim()) errs.email = 'Email is required';
    if (!editData.phone?.trim()) errs.phone = 'Phone is required';
    if (!editData.address?.trim()) errs.address = 'Address is required';
    if (!editData.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
    if (!editData.gender) errs.gender = 'Gender is required';
    if (!editData.bloodGroup) errs.bloodGroup = 'Blood group is required';
    if (!editData.emergencyContact?.trim()) errs.emergencyContact = 'Emergency contact is required';
    setSetupErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (isSetupMode) {
      if (!validateSetup()) return;
      const completed = { ...editData, profileComplete: true };
      setUser(completed);
      localStorage.setItem('user', JSON.stringify(completed));
      setIsSetupMode(false);
      setIsEditing(false);
      navigate('/');
      return;
    }
    setUser(editData);
    localStorage.setItem('user', JSON.stringify(editData));
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const medicalHistory = [
    { date: '2026-02-15', type: 'Consultation', doctor: 'Dr. Sharma', specialty: 'Neurologist' },
    { date: '2026-01-20', type: 'Check-up', doctor: 'Dr. Patel', specialty: 'General Physician' },
    { date: '2025-12-10', type: 'Consultation', doctor: 'Dr. Gupta', specialty: 'Cardiologist' },
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'medical', label: 'Medical History', icon: FileText },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-10 animate-fade-in-up">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#050505] rounded-3xl shadow-card p-6 border border-white/[0.06]">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-black text-3xl font-extrabold shadow-lg shadow-primary-500/30 ring-4 ring-white/[0.06]">
                    {user.name.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-[#0a0a0a] p-2 rounded-full shadow-elevated hover:bg-white/[0.04] transition-colors border border-white/[0.08]">
                    <Camera className="h-3.5 w-3.5 text-gray-300" />
                  </button>
                </div>
                <h2 className="mt-4 text-lg font-extrabold text-white tracking-tight">{user.name}</h2>
                <p className="text-gray-500 text-xs font-medium">{user.email}</p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-1.5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => !isSetupMode && setActiveTab(tab.id)}
                      disabled={isSetupMode && tab.id !== 'profile'}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm ${
                        activeTab === tab.id
                          ? 'bg-primary-500/10 text-primary-400 shadow-lg shadow-primary-500/10 font-bold border border-primary-500/20'
                          : isSetupMode && tab.id !== 'profile'
                            ? 'text-gray-600 cursor-not-allowed opacity-40'
                            : 'text-gray-400 hover:bg-[#0a0a0a] font-medium'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-colors text-sm font-bold"
              >
                <LogOut className="h-4.5 w-4.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-[#050505] rounded-3xl shadow-card border border-white/[0.06]">
                <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-white tracking-tight">
                      {isSetupMode ? 'Complete Your Profile' : 'Personal Information'}
                    </h3>
                    <p className="text-gray-500 text-xs font-medium mt-0.5">
                      {isSetupMode ? 'Please fill in all required details to continue' : 'Update your personal details'}
                    </p>
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 text-primary-400 hover:bg-primary-500/10 px-4 py-2 rounded-xl transition-colors text-sm font-bold"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      {!isSetupMode && (
                        <button
                          onClick={() => {
                            setEditData(user);
                            setIsEditing(false);
                          }}
                          className="flex items-center gap-2 text-gray-400 hover:bg-[#0a0a0a] px-4 py-2 rounded-xl transition-colors text-sm font-bold"
                        >
                          <X className="h-3.5 w-3.5" />
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-primary-500 text-black px-4 py-2 rounded-xl transition-colors text-sm font-bold shadow-lg shadow-primary-500/30"
                      >
                        <Save className="h-3.5 w-3.5" />
                        {isSetupMode ? 'Save & Continue' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {isSetupMode && (
                    <div className="mb-6 bg-primary-500/5 border border-primary-500/20 rounded-2xl p-4 flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-primary-400">Welcome to MediMap!</p>
                        <p className="text-xs text-gray-500 mt-0.5">Complete your profile details below to get personalized health recommendations.</p>
                      </div>
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <User className="inline h-4 w-4 mr-2" />
                        Full Name {isSetupMode && <span className="text-red-400">*</span>}
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            name="name"
                            value={editData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className={`w-full px-4 py-3 border ${setupErrors.name ? 'border-red-500/50' : 'border-white/[0.08]'} rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white/[0.03] text-gray-200 text-sm`}
                          />
                          {setupErrors.name && <p className="text-red-400 text-xs mt-1.5 font-medium">{setupErrors.name}</p>}
                        </>
                      ) : (
                        <p className="px-4 py-3 bg-white/[0.03] rounded-2xl text-gray-200 text-sm">{user.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Mail className="inline h-4 w-4 mr-2" />
                        Email Address {isSetupMode && <span className="text-red-400">*</span>}
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="email"
                            name="email"
                            value={editData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className={`w-full px-4 py-3 border ${setupErrors.email ? 'border-red-500/50' : 'border-white/[0.08]'} rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white/[0.03] text-gray-200`}
                          />
                          {setupErrors.email && <p className="text-red-400 text-xs mt-1.5 font-medium">{setupErrors.email}</p>}
                        </>
                      ) : (
                        <p className="px-4 py-3 bg-white/[0.03] rounded-xl text-gray-200">{user.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Phone className="inline h-4 w-4 mr-2" />
                        Phone Number {isSetupMode && <span className="text-red-400">*</span>}
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="tel"
                            name="phone"
                            value={editData.phone}
                            onChange={handleChange}
                            placeholder="+91 9876543210"
                            className={`w-full px-4 py-3 border ${setupErrors.phone ? 'border-red-500/50' : 'border-white/[0.08]'} rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white/[0.03] text-gray-200`}
                          />
                          {setupErrors.phone && <p className="text-red-400 text-xs mt-1.5 font-medium">{setupErrors.phone}</p>}
                        </>
                      ) : (
                        <p className="px-4 py-3 bg-white/[0.03] rounded-xl text-gray-200">{user.phone}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <MapPin className="inline h-4 w-4 mr-2" />
                        Address {isSetupMode && <span className="text-red-400">*</span>}
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            name="address"
                            value={editData.address}
                            onChange={handleChange}
                            placeholder="City, State"
                            className={`w-full px-4 py-3 border ${setupErrors.address ? 'border-red-500/50' : 'border-white/[0.08]'} rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white/[0.03] text-gray-200`}
                          />
                          {setupErrors.address && <p className="text-red-400 text-xs mt-1.5 font-medium">{setupErrors.address}</p>}
                        </>
                      ) : (
                        <p className="px-4 py-3 bg-white/[0.03] rounded-xl text-gray-200">{user.address || '—'}</p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Calendar className="inline h-4 w-4 mr-2" />
                        Date of Birth {isSetupMode && <span className="text-red-400">*</span>}
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={editData.dateOfBirth}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${setupErrors.dateOfBirth ? 'border-red-500/50' : 'border-white/[0.08]'} rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white/[0.03] text-gray-200`}
                          />
                          {setupErrors.dateOfBirth && <p className="text-red-400 text-xs mt-1.5 font-medium">{setupErrors.dateOfBirth}</p>}
                        </>
                      ) : (
                        <p className="px-4 py-3 bg-white/[0.03] rounded-xl text-gray-200">
                          {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          }) : '—'}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Gender {isSetupMode && <span className="text-red-400">*</span>}
                      </label>
                      {isEditing ? (
                        <>
                          <select
                            name="gender"
                            value={editData.gender}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${setupErrors.gender ? 'border-red-500/50' : 'border-white/[0.08]'} rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white/[0.03] text-gray-200`}
                          >
                            <option value="" disabled>Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                          {setupErrors.gender && <p className="text-red-400 text-xs mt-1.5 font-medium">{setupErrors.gender}</p>}
                        </>
                      ) : (
                        <p className="px-4 py-3 bg-white/[0.03] rounded-xl text-gray-200">{user.gender || '—'}</p>
                      )}
                    </div>

                    {/* Blood Group */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Heart className="inline h-4 w-4 mr-2" />
                        Blood Group {isSetupMode && <span className="text-red-400">*</span>}
                      </label>
                      {isEditing ? (
                        <>
                          <select
                            name="bloodGroup"
                            value={editData.bloodGroup}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${setupErrors.bloodGroup ? 'border-red-500/50' : 'border-white/[0.08]'} rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white/[0.03] text-gray-200`}
                          >
                            <option value="" disabled>Select blood group</option>
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                              <option key={bg} value={bg}>{bg}</option>
                            ))}
                          </select>
                          {setupErrors.bloodGroup && <p className="text-red-400 text-xs mt-1.5 font-medium">{setupErrors.bloodGroup}</p>}
                        </>
                      ) : (
                        <p className="px-4 py-3 bg-white/[0.03] rounded-xl text-gray-200">{user.bloodGroup || '—'}</p>
                      )}
                    </div>

                    {/* Emergency Contact */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Shield className="inline h-4 w-4 mr-2" />
                        Emergency Contact {isSetupMode && <span className="text-red-400">*</span>}
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="tel"
                            name="emergencyContact"
                            value={editData.emergencyContact}
                            onChange={handleChange}
                            placeholder="+91 9876543211"
                            className={`w-full px-4 py-3 border ${setupErrors.emergencyContact ? 'border-red-500/50' : 'border-white/[0.08]'} rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white/[0.03] text-gray-200`}
                          />
                          {setupErrors.emergencyContact && <p className="text-red-400 text-xs mt-1.5 font-medium">{setupErrors.emergencyContact}</p>}
                        </>
                      ) : (
                        <p className="px-4 py-3 bg-white/[0.03] rounded-xl text-gray-200">{user.emergencyContact || '—'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Medical History Tab */}
            {activeTab === 'medical' && (
              <div className="bg-[#050505] rounded-3xl shadow-card border border-white/[0.06]">
                <div className="p-6 border-b border-white/[0.06]">
                  <h3 className="text-lg font-extrabold text-white tracking-tight">Medical History</h3>
                  <p className="text-gray-400 text-xs font-medium mt-0.5">Your past consultations and check-ups</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {medicalHistory.map((record, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl hover:bg-white/[0.05] transition-colors card-hover"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-primary-500/10 p-3 rounded-xl border border-primary-500/20">
                            <FileText className="h-5 w-5 text-primary-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{record.type} with {record.doctor}</p>
                            <p className="text-sm text-gray-500">{record.specialty}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-200 font-medium">
                            {new Date(record.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                          <button className="text-primary-400 text-sm font-bold hover:underline">View Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="bg-[#050505] rounded-3xl shadow-card border border-white/[0.06]">
                <div className="p-6 border-b border-white/[0.06]">
                  <h3 className="text-lg font-extrabold text-white tracking-tight">Upcoming Appointments</h3>
                  <p className="text-gray-400 text-xs font-medium mt-0.5">Manage your scheduled appointments</p>
                </div>
                <div className="p-6">
                  <div className="text-center py-12">
                    <div className="bg-[#0a0a0a] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-10 w-10 text-gray-500" />
                    </div>
                    <p className="text-gray-400 mb-5 text-sm">No upcoming appointments</p>
                    <Link
                      to="/find-specialist"
                      className="inline-flex items-center gap-2 bg-primary-500 text-black px-6 py-3 rounded-2xl hover:bg-primary-400 transition-all font-bold text-sm shadow-lg shadow-primary-500/30"
                    >
                      Book Appointment
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-[#050505] rounded-3xl shadow-card border border-white/[0.06]">
                  <div className="p-6 border-b border-white/[0.06]">
                    <h3 className="text-lg font-extrabold text-white tracking-tight">Notifications</h3>
                    <p className="text-gray-400 text-xs font-medium mt-0.5">Manage your notification preferences</p>
                  </div>
                  <div className="p-6 space-y-4">
                    {[
                      { label: 'Email Notifications', desc: 'Receive appointment reminders via email' },
                      { label: 'SMS Notifications', desc: 'Get text messages for important updates' },
                      { label: 'Health Tips', desc: 'Receive weekly health tips and recommendations' },
                    ].map((setting, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl">
                        <div>
                          <p className="font-bold text-white text-sm">{setting.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{setting.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-[#111] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#050505] rounded-3xl shadow-card border border-white/[0.06]">
                  <div className="p-6 border-b border-white/[0.06]">
                    <h3 className="text-lg font-extrabold text-white tracking-tight">Privacy & Security</h3>
                  </div>
                  <div className="p-6 space-y-3">
                    <button className="w-full flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl hover:bg-white/[0.05] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary-500/10 p-2 rounded-xl"><Shield className="h-4 w-4 text-primary-400" /></div>
                        <span className="font-bold text-white text-sm">Change Password</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl hover:bg-white/[0.05] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary-500/10 p-2 rounded-xl"><Bell className="h-4 w-4 text-primary-400" /></div>
                        <span className="font-bold text-white text-sm">Two-Factor Authentication</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="bg-red-500/5 rounded-3xl border border-red-500/20 p-6">
                  <h4 className="font-bold text-red-400 text-sm mb-2">Danger Zone</h4>
                  <p className="text-red-500 text-xs mb-4">Once you delete your account, there is no going back.</p>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl transition-colors font-bold text-sm shadow-lg shadow-red-500/30">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;
