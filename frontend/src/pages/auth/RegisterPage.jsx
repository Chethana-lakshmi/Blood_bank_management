import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Heart, Building2, User, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

export default function RegisterPage() {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('donor');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);
    try {
      const payload = {
        ...data,
        role,
        ...(role === 'hospital' ? { hospitalName: data.name } : {}),
      };
      const user = await registerAuth(payload);
      if (user?.role === 'hospital') navigate('/hospital/dashboard');
      else navigate('/donor/dashboard');
    } catch (err) {
      console.error('Registration Error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Registration failed. Please check form data.';
      setServerError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-extrabold text-gray-900">Create Account</h1>
        <p className="text-sm text-gray-500">Select your registration type to get started</p>
      </div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setRole('donor')}
          className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between space-y-2 ${
            role === 'donor'
              ? 'border-red-600 bg-red-50/50 ring-2 ring-red-600/20'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <Heart className={`w-6 h-6 ${role === 'donor' ? 'text-red-600 fill-red-600' : 'text-gray-400'}`} />
            {role === 'donor' && <CheckCircle2 className="w-5 h-5 text-red-600" />}
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm">Blood Donor</div>
            <div className="text-xs text-gray-500">Donate blood & save lives</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setRole('hospital')}
          className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between space-y-2 ${
            role === 'hospital'
              ? 'border-red-600 bg-red-50/50 ring-2 ring-red-600/20'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <Building2 className={`w-6 h-6 ${role === 'hospital' ? 'text-red-600' : 'text-gray-400'}`} />
            {role === 'hospital' && <CheckCircle2 className="w-5 h-5 text-red-600" />}
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm">Hospital</div>
            <div className="text-xs text-gray-500">Request & manage blood stock</div>
          </div>
        </button>
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium text-center">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        {/* Common Fields */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              {role === 'donor' ? 'Full Name' : 'Hospital Name'}
            </label>
            <input
              type="text"
              placeholder={role === 'donor' ? 'John Doe' : 'City Healthcare Hospital'}
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
            />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="7730952723"
              {...register('phone', { required: 'Phone is required' })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
            />
            {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Role Specific Fields */}
        {role === 'donor' ? (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Blood Group</label>
                <select
                  {...register('bloodGroup', { required: 'Select blood group' })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                >
                  <option value="">Select Blood Group</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
                {errors.bloodGroup && <p className="text-xs text-red-600 mt-1">{errors.bloodGroup.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Gender</label>
                <select
                  {...register('gender')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Date of Birth (Optional)</label>
              <input
                type="date"
                {...register('dateOfBirth')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">License Number</label>
            <input
              type="text"
              placeholder="LIC-998822"
              {...register('licenseNumber', { required: 'License number is required' })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
            />
            {errors.licenseNumber && <p className="text-xs text-red-600 mt-1">{errors.licenseNumber.message}</p>}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">City</label>
            <input
              type="text"
              placeholder="Addanki"
              {...register('city', { required: 'City is required' })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
            />
            {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">State</label>
            <input
              type="text"
              placeholder="Andhra Pradesh"
              {...register('state', { required: 'State is required' })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
            />
            {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state.message}</p>}
          </div>
        </div>

        <Button type="submit" loading={loading} className="w-full shadow-lg shadow-red-500/20 pt-1">
          Complete Registration
        </Button>

        <p className="text-center text-xs text-gray-500 pt-2">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-red-600 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
