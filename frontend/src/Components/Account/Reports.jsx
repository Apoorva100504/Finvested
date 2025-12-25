import { useState, useRef, useEffect } from "react";
import { EyeIcon, EyeSlashIcon, PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function UserProfile() {
  const [activePage, setActivePage] = useState("Basic Details");

  const menuItems = [
    "Basic Details",
    "Reports",
    "Change Password",
    "Change Groww PIN",
    "Trading controls",
    "Trading APIs",
    "Sell authorisation mode",
    "Trading Details",
    "Account Related Forms",
    "Nominee Details",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:py-6 px-24 flex justify-center ">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* ---------------- LEFT SIDEBAR ---------------- */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col items-center mb-8">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center hover:scale-105 transition-transform duration-300 cursor-pointer group">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-bold text-xl">SM</span>
              </div>
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-800">
              Shironika Marimuthu
            </h2>
            <p className="text-sm text-gray-500 mt-1">PAN: •••••072Q</p>
          </div>

          <div className="space-y-1">
            {menuItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActivePage(item)}
                className={`flex justify-between items-center py-3.5 px-4 cursor-pointer rounded-lg transition-all duration-200
                  ${activePage === item 
                    ? "bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 font-medium text-blue-600" 
                    : "hover:bg-gray-50 hover:text-blue-500 border border-transparent"
                  }
                `}
              >
                <span className={`text-sm ${activePage === item ? 'font-medium' : 'text-gray-600'}`}>
                  {item}
                </span>
                <span className={`text-lg transition-transform duration-200 ${activePage === item ? 'text-blue-500' : 'text-gray-400'}`}>
                  {activePage === item ? '→' : '›'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- RIGHT PANEL ---------------- */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {activePage === "Basic Details" && <BasicDetails />}
          {activePage === "Change Password" && <ChangePassword />}
          {activePage === "Change Groww PIN" && <ChangePIN />}
        </div>

      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ---------------------- BASIC DETAILS PAGE ------------------------- */
/* ------------------------------------------------------------------ */

function BasicDetails() {
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "Shironika Marimuthu",
    dob: "••/••/2004",
    mobile: "•••••14948",
    email: "shi•••••••••••@gmail.com"
  });
  const [tempValue, setTempValue] = useState("");

  const handleEditClick = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue.replace(/•/g, ''));
  };

  const handleSave = (field) => {
    if (tempValue.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: field === 'dob' || field === 'mobile' || field === 'email' 
          ? maskValue(tempValue)
          : tempValue
      }));
    }
    setEditingField(null);
    setTempValue("");
  };

  const maskValue = (value) => {
    if (value.includes('@')) {
      const [local, domain] = value.split('@');
      const maskedLocal = local.length > 3 
        ? local.substring(0, 3) + '•'.repeat(local.length - 3)
        : '•'.repeat(local.length);
      return `${maskedLocal}@${domain}`;
    } else if (/^\d+$/.test(value)) {
      return '•'.repeat(value.length - 5) + value.substring(value.length - 5);
    } else if (value.includes('/')) {
      return '••/••/' + value.split('/')[2];
    }
    return value;
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  const DetailRow = ({ label, field, value }) => {
    const isEditing = editingField === field;
    
    return (
      <div className="py-4 border-b border-gray-100 flex justify-between items-center hover:bg-gray-50/50 transition-colors duration-200 rounded-lg px-3">
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-medium mb-1.5">{label}</p>
          {isEditing ? (
            <input
              type={field === 'dob' ? 'date' : field === 'email' ? 'email' : 'text'}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full py-2 px-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave(field);
                if (e.key === 'Escape') handleCancel();
              }}
            />
          ) : (
            <p className="text-gray-800 font-medium text-lg">{value}</p>
          )}
        </div>
        
        {isEditing ? (
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => handleSave(field)}
              className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 hover:shadow-md active:scale-95 transition-all duration-200"
              title="Save"
            >
              <CheckIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 hover:shadow-md active:scale-95 transition-all duration-200"
              title="Cancel"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleEditClick(field, value)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg hover:scale-110 active:scale-95 transition-all duration-200"
            title="Edit"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Personal Details</h3>
          <p className="text-sm text-gray-500 mt-1">Update your personal information</p>
        </div>
        <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-600 font-medium">PAN – •••••072Q</p>
        </div>
      </div>

      <div className="space-y-4">
        <DetailRow label="Full Name" field="fullName" value={formData.fullName} />
        <DetailRow label="Date of Birth" field="dob" value={formData.dob} />
        <DetailRow label="Mobile Number" field="mobile" value={formData.mobile} />
        <DetailRow label="Email Address" field="email" value={formData.email} />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* ---------------------- CHANGE PASSWORD PAGE ---------------------- */
/* ------------------------------------------------------------------ */
const PasswordInput = ({
  label,
  field,
  value,
  show,
  onChange,
  onToggle,
  onEnter
}) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 font-medium mb-2">
        {label}
      </label>

      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5
                      group hover:border-blue-400
                      focus-within:border-blue-500
                      focus-within:ring-2 focus-within:ring-blue-100
                      transition-all duration-200">

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          placeholder={
            field === "currentPassword"
              ? "Enter current password"
              : "Enter new password"
          }
          className="w-full outline-none text-gray-800 placeholder-gray-400"
          onKeyDown={(e) => e.key === "Enter" && onEnter()}
        />

        <button
          type="button"
          onClick={() => onToggle(field)}
          className="ml-2 p-1 text-gray-400 hover:text-blue-600 transition-all"
        >
          {show ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};


function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (message.text) setMessage({ type: '', text: '' });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all password fields' });
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    if (formData.newPassword === formData.currentPassword) {
      setMessage({ type: 'error', text: 'New password must be different from current password' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongRegex.test(formData.newPassword)) {
      setMessage({ 
        type: 'error', 
        text: 'Password must contain uppercase, lowercase, number, and special character' 
      });
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setMessage({ 
        type: 'success', 
        text: 'Password updated successfully! You will be logged out shortly.' 
      });
      
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }, 1500);
  };

 
  

  return (
    <>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Change Password</h3>
        <p className="text-sm text-gray-500 mt-1">Update your account password securely</p>
      </div>

      <div className="max-w-lg space-y-6">
        <PasswordInput label="Current Password" field="currentPassword" />
        <PasswordInput label="New Password" field="newPassword" />
        <PasswordInput label="Confirm New Password" field="confirmPassword" />

        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
          <p className="text-sm font-medium text-blue-600 mb-2">Password Requirements:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• One uppercase letter</li>
            <li>• One lowercase letter</li>
            <li>• One number</li>
            <li>• One special character (@$!%*?&)</li>
          </ul>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg border transition-all duration-300 animate-fadeIn ${
            message.type === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700' 
              : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-3">
              <span className={`p-1.5 rounded-full ${message.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                {message.type === 'success' ? '✅' : '⚠️'}
              </span>
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full px-5 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
              Updating Password...
            </>
          ) : "Update Password"}
        </button>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* ---------------------- CHANGE PIN PAGE ---------------------------- */
/* ------------------------------------------------------------------ */

function ChangePIN() {
  const [formData, setFormData] = useState({
    currentPIN: "",
    newPIN: "",
    confirmPIN: ""
  });
  const [showPIN, setShowPIN] = useState({
    currentPIN: false,
    newPIN: false,
    confirmPIN: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeInput, setActiveInput] = useState(null);
  const inputRefs = {
    currentPIN: useRef(null),
    newPIN: useRef(null),
    confirmPIN: useRef(null)
  };

  const handleChange = (field, value) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 6) {
      setFormData(prev => ({ ...prev, [field]: numericValue }));
      if (message.text) setMessage({ type: '', text: '' });
    }
  };

  const togglePINVisibility = (field) => {
    setShowPIN(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = () => {
    if (!formData.currentPIN || !formData.newPIN || !formData.confirmPIN) {
      setMessage({ type: 'error', text: 'Please fill in all PIN fields' });
      return;
    }

    if (formData.currentPIN.length !== 6) {
      setMessage({ type: 'error', text: 'Current PIN must be 6 digits' });
      return;
    }

    if (formData.newPIN.length !== 6) {
      setMessage({ type: 'error', text: 'New PIN must be exactly 6 digits' });
      return;
    }

    if (formData.newPIN === formData.currentPIN) {
      setMessage({ type: 'error', text: 'New PIN must be different from current PIN' });
      return;
    }

    if (formData.newPIN !== formData.confirmPIN) {
      setMessage({ type: 'error', text: 'New PINs do not match' });
      return;
    }

    if (/^(\d)\1{5}$/.test(formData.newPIN)) {
      setMessage({ type: 'error', text: 'PIN cannot be all same digits' });
      return;
    }

    if (/123456|654321/.test(formData.newPIN)) {
      setMessage({ type: 'error', text: 'PIN cannot be a simple sequence' });
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setMessage({ 
        type: 'success', 
        text: 'Groww PIN updated successfully!' 
      });
      
      setFormData({
        currentPIN: "",
        newPIN: "",
        confirmPIN: ""
      });
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }, 1500);
  };
  useEffect(() => {
  if (activeInput && inputRefs[activeInput]?.current) {
    inputRefs[activeInput].current.focus();
  }
}, [activeInput, formData]);

  const PINInput = ({ label, field }) => {

  const handleContainerClick = () => {
    setActiveInput(field);
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 font-medium mb-2">{label}</label>

      <div
        onClick={handleContainerClick}
        className={`relative flex items-center border ${
          activeInput === field
            ? "border-blue-500 ring-2 ring-blue-100"
            : "border-gray-300"
        } rounded-lg px-3 py-2.5 cursor-text hover:border-blue-400 transition-all duration-200`}
      >
        {/* PIN BOXES */}
        <div className="flex items-center gap-1 mr-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className={`h-10 w-10 rounded-lg border flex items-center justify-center ${
                idx < formData[field].length
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              {showPIN[field] && idx < formData[field].length ? (
                <span className="text-lg font-bold">
                  {formData[field][idx]}
                </span>
              ) : idx < formData[field].length ? (
                <div className="h-2 w-2 rounded-full bg-blue-500" />
              ) : null}
            </div>
          ))}
        </div>

        {/* REAL INPUT (INVISIBLE BUT FOCUSABLE) */}
        <input
          ref={inputRefs[field]}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={formData[field]}
          maxLength={6}
          onChange={(e) => handleChange(field, e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="absolute opacity-0 pointer-events-none"
        />
        

        {/* EYE ICON */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            togglePINVisibility(field);
          }}
          className="ml-auto p-1 text-gray-400 hover:text-blue-600"
        >
          {showPIN[field] ? (
            <EyeSlashIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-2">
        {formData[field].length}/6 digits
      </p>
    </div>
  );
};



  return (
    <>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Change Groww PIN</h3>
        <p className="text-sm text-gray-500 mt-1">Secure your account with a 6-digit PIN</p>
      </div>

      <div className="max-w-lg space-y-6">
        <PINInput label="Current PIN" field="currentPIN" />
        <PINInput label="New PIN" field="newPIN" />
        <PINInput label="Confirm New PIN" field="confirmPIN" />

        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
          <p className="text-sm font-medium text-blue-600 mb-2">PIN Guidelines:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Must be exactly 6 digits</li>
            <li>• Avoid common sequences (123456, 654321)</li>
            <li>• Avoid repeating digits (111111, 222222)</li>
            <li>• Do not use your date of birth</li>
            <li>• Do not share your PIN with anyone</li>
          </ul>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg border transition-all duration-300 animate-fadeIn ${
            message.type === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700' 
              : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-3">
              <span className={`p-1.5 rounded-full ${message.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                {message.type === 'success' ? '✅' : '⚠️'}
              </span>
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full px-5 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
              Updating PIN...
            </>
          ) : "Update PIN"}
        </button>
      </div>
    </>
  );
}