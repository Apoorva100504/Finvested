import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ---------------- LEFT SIDEBAR ---------------- */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-blue-200 flex items-center justify-center hover:scale-105 transition-transform duration-300 cursor-pointer group">
              <div className="h-10 w-10 rounded-full bg-blue-600 opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-800">
              Shironika Marimuthu
            </h2>
          </div>

          <div className="mt-6">
            {menuItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActivePage(item)}
                className={`flex justify-between items-center py-3 pl-2 cursor-pointer rounded transition-all duration-200
                  ${activePage === item ? "bg-gray-100 font-medium text-green-600" : "hover:bg-gray-50 hover:text-green-500"}
                `}
              >
                <span className={`${activePage === item ? 'font-medium' : ''}`}>{item}</span>
                <span className={`text-lg transition-transform duration-200 ${activePage === item ? 'text-green-500' : 'text-gray-400'}`}>
                  {activePage === item ? '→' : '›'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- RIGHT PANEL ---------------- */}
        <div className="bg-white rounded-xl shadow p-6 col-span-2">
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
    dob: "**/**/2004",
    mobile: "*****14948",
    email: "shi***********@gmail.com"
  });
  const [tempValue, setTempValue] = useState("");

  const handleEditClick = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue.replace(/\*/g, ''));
  };

  const handleSave = (field) => {
    if (tempValue.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: field === 'dob' || field === 'mobile' || field === 'email' 
          ? tempValue.replace(/./g, '*')
          : tempValue
      }));
    }
    setEditingField(null);
    setTempValue("");
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  const DetailRow = ({ label, field, value }) => {
    const isEditing = editingField === field;
    
    return (
      <div className="py-4 border-b flex justify-between items-center hover:bg-gray-50 transition-colors duration-200 rounded-lg px-2">
        <div className="flex-1">
          <p className="text-sm text-gray-500">{label}</p>
          {isEditing ? (
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full py-1 px-2 border border-green-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-200"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave(field);
                if (e.key === 'Escape') handleCancel();
              }}
            />
          ) : (
            <p className="text-gray-800 font-medium">{value}</p>
          )}
        </div>
        
        {isEditing ? (
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => handleSave(field)}
              className="p-1.5 bg-green-500 text-white rounded-full hover:bg-green-600 hover:scale-110 active:scale-95 transition-all duration-200"
              title="Save"
            >
              <CheckIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 hover:scale-110 active:scale-95 transition-all duration-200"
              title="Cancel"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleEditClick(field, value)}
            className="p-1.5 text-green-600 hover:bg-green-100 rounded-full hover:scale-110 active:scale-95 transition-all duration-200"
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
      <h3 className="text-xl font-semibold text-gray-800">Personal Details</h3>
      <p className="text-sm text-gray-500 mt-1">PAN – ******072Q</p>

      <div className="mt-6 space-y-4">
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

function ChangePassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState({
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
    if (!formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in both password fields' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setMessage({ 
        type: 'success', 
        text: 'Password updated successfully!' 
      });
      
      // Reset form
      setFormData({
        newPassword: "",
        confirmPassword: ""
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }, 1500);
  };

  const PasswordInput = ({ label, field }) => {
    return (
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">{label}</label>
        <div className="flex items-center border-b border-gray-300 pb-1 group hover:border-green-400 transition-colors duration-200">
          <input
            type={showPassword[field] ? "text" : "password"}
            value={formData[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder="Enter password"
            className="w-full outline-none text-gray-800 transition-all duration-200 group-hover:text-gray-900"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility(field)}
            className="p-1 text-gray-500 hover:text-green-600 hover:scale-110 active:scale-95 transition-all duration-200"
            title={showPassword[field] ? "Hide password" : "Show password"}
          >
            {showPassword[field] ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <h3 className="text-xl font-semibold text-gray-800">Change Password</h3>
      <p className="text-sm text-gray-500 mt-1">Update your account password</p>

      <div className="mt-6 space-y-6">
        <PasswordInput label="New Password" field="newPassword" />
        <PasswordInput label="Confirm New Password" field="confirmPassword" />

        {message.text && (
          <div className={`p-3 rounded-lg border transition-all duration-300 animate-fadeIn ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-2">
              <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 px-5 py-2.5 bg-[#0fbaad] text-white rounded-md hover:bg-[#0ca095] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-medium shadow-sm hover:shadow disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              Updating...
            </span>
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
    newPIN: "",
    confirmPIN: ""
  });
  const [showPIN, setShowPIN] = useState({
    newPIN: false,
    confirmPIN: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (field, value) => {
    // Allow only numbers
    const numericValue = value.replace(/\D/g, '');
    // Limit to 6 digits
    if (numericValue.length <= 6) {
      setFormData(prev => ({ ...prev, [field]: numericValue }));
      if (message.text) setMessage({ type: '', text: '' });
    }
  };

  const togglePINVisibility = (field) => {
    setShowPIN(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = () => {
    if (!formData.newPIN || !formData.confirmPIN) {
      setMessage({ type: 'error', text: 'Please enter both PIN fields' });
      return;
    }

    if (formData.newPIN.length !== 6) {
      setMessage({ type: 'error', text: 'PIN must be exactly 6 digits' });
      return;
    }

    if (formData.newPIN !== formData.confirmPIN) {
      setMessage({ type: 'error', text: 'PINs do not match' });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setMessage({ 
        type: 'success', 
        text: 'Groww PIN updated successfully!' 
      });
      
      // Reset form
      setFormData({
        newPIN: "",
        confirmPIN: ""
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }, 1500);
  };

  const PINInput = ({ label, field }) => {
    return (
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">{label}</label>
        <div className="flex items-center border-b border-gray-300 pb-1 group hover:border-green-400 transition-colors duration-200">
          <input
            type={showPIN[field] ? "text" : "password"}
            value={formData[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder="******"
            inputMode="numeric"
            maxLength={6}
            className="w-full outline-none text-gray-800 tracking-widest text-xl font-mono transition-all duration-200 group-hover:text-gray-900"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button
            type="button"
            onClick={() => togglePINVisibility(field)}
            className="p-1 text-gray-500 hover:text-green-600 hover:scale-110 active:scale-95 transition-all duration-200"
            title={showPIN[field] ? "Hide PIN" : "Show PIN"}
          >
            {showPIN[field] ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {formData[field].length}/6 digits
        </p>
      </div>
    );
  };

  return (
    <>
      <h3 className="text-xl font-semibold text-gray-800">Change Groww PIN</h3>
      <p className="text-sm text-gray-500 mt-1">Update your 6-digit Groww PIN</p>

      <div className="mt-6 space-y-6">
        <PINInput label="New PIN" field="newPIN" />
        <PINInput label="Confirm New PIN" field="confirmPIN" />

        {message.text && (
          <div className={`p-3 rounded-lg border transition-all duration-300 animate-fadeIn ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-2">
              <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 px-5 py-2.5 bg-[#0fbaad] text-white rounded-md hover:bg-[#0ca095] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-medium shadow-sm hover:shadow disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              Updating...
            </span>
          ) : "Update PIN"}
        </button>
      </div>
    </>
  );
}

// Add these CSS animations to your global CSS
const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-200 {
  transition-duration: 200ms;
}

.duration-300 {
  transition-duration: 300ms;
}

.hover\\:scale-105:hover {
  transform: scale(1.05);
}

.hover\\:scale-110:hover {
  transform: scale(1.1);
}

.hover\\:scale-\\[1\\.02\\]:hover {
  transform: scale(1.02);
}

.active\\:scale-95:active {
  transform: scale(0.95);
}

.active\\:scale-\\[0\\.98\\]:active {
  transform: scale(0.98);
}
`;

// Add the styles to the document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}