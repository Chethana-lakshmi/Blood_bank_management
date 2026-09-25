import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock, Mail, Heart, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      if (user?.role === 'admin') navigate('/admin/dashboard');
      else if (user?.role === 'hospital') navigate('/hospital/dashboard');
      else navigate('/donor/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email, password) => {
    onSubmit({ email, password });
  };

  return (
    <div className="max-w-md mx-auto py-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-md">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Welcome Back</h1>
        <p className="text-sm text-gray-500">Sign in to manage your blood bank portal</p>
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium text-center">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="email"
              placeholder="user@example.com"
              {...register('email', { required: 'Email is required' })}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
            />
          </div>
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
              className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
        </div>

        <Button type="submit" loading={loading} className="w-full shadow-lg shadow-red-500/20">
          Sign In
        </Button>

        <p className="text-center text-xs text-gray-500 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-red-600 hover:underline">
            Register here
          </Link>
        </p>
      </form>

      {/* Quick Demo Credentials Assistant */}
      <div className="bg-gray-100/70 p-4 rounded-2xl border border-gray-200/60 space-y-3">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider text-center">⚡ One-Click Demo Sign-in</h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => fillDemo('admin@bloodconnect.com', 'Admin@123')}
            className="p-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 hover:bg-red-50 hover:border-red-200 transition-all text-center"
          >
            🔑 Admin
          </button>
          <button
            type="button"
            onClick={() => fillDemo('john.donor@example.com', 'Donor@123')}
            className="p-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 hover:bg-red-50 hover:border-red-200 transition-all text-center"
          >
            🩸 Donor
          </button>
          <button
            type="button"
            onClick={() => fillDemo('city.hospital@example.com', 'Hospital@123')}
            className="p-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 hover:bg-red-50 hover:border-red-200 transition-all text-center"
          >
            🏥 Hospital
          </button>
        </div>
      </div>
    </div>
  );
}
