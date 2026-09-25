import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AlertTriangle, PlusCircle, CheckCircle2 } from 'lucide-react';
import requestService from '../../services/requestService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function CreateBloodRequest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      urgency: 'NORMAL',
      unitsRequired: 1,
      requiredDate: new Date().toISOString().split('T')[0]
    }
  });

  const selectedUrgency = watch('urgency');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await requestService.createRequest(data);
      navigate('/hospital/requests');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit blood request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Submit Blood Request</h1>
        <p className="text-sm text-gray-500">Request required blood units for patient care from central inventory</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm font-medium">{error}</div>
      )}

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Patient Full Name</label>
              <input
                type="text"
                placeholder="Jane Smith"
                {...register('patientName', { required: 'Patient name required' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
              {errors.patientName && <p className="text-xs text-red-600 mt-1">{errors.patientName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Required Blood Group</label>
              <select
                {...register('bloodGroup', { required: 'Select blood group' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="">Select Group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
              {errors.bloodGroup && <p className="text-xs text-red-600 mt-1">{errors.bloodGroup.message}</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Units Required</label>
              <input
                type="number"
                min="1"
                max="50"
                {...register('unitsRequired', { required: 'Units required', min: 1 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Required By Date</label>
              <input
                type="date"
                {...register('requiredDate', { required: 'Required date is needed' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          </div>

          {/* Urgency Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Urgency Level</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'NORMAL', label: 'Normal', color: 'bg-gray-100 text-gray-800' },
                { id: 'URGENT', label: 'Urgent', color: 'bg-amber-100 text-amber-800' },
                { id: 'EMERGENCY', label: 'Emergency 🚨', color: 'bg-red-600 text-white font-black animate-pulse' }
              ].map((item) => (
                <label
                  key={item.id}
                  className={`p-3 rounded-xl border text-center text-xs font-bold cursor-pointer transition-all ${
                    selectedUrgency === item.id
                      ? 'ring-2 ring-red-600 border-red-600 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={item.id}
                    {...register('urgency')}
                    className="sr-only"
                  />
                  <span className={`block px-2 py-1 rounded-lg ${item.color}`}>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">City</label>
              <input
                type="text"
                placeholder="New York"
                {...register('city', { required: 'City required' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Emergency Contact Number</label>
              <input
                type="text"
                placeholder="+1 (555) 123-4567"
                {...register('contactNumber', { required: 'Contact number required' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Medical Reason / Description</label>
            <textarea
              rows="3"
              placeholder="Provide clinical context (e.g., Surgery, Anemia, Trauma care)"
              {...register('reason', { required: 'Reason is required' })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading} className="flex-1 shadow-lg shadow-red-500/20">
              Submit Blood Request
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/hospital/requests')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
