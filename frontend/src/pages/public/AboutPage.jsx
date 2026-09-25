import React from 'react';
import { Heart, ShieldCheck, Zap, Users, Building2, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto py-4">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 fill-red-600" /> About BloodConnect
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Saving Lives Through Digital Innovation</h1>
        <p className="text-gray-600 text-base max-w-2xl mx-auto">
          BloodConnect is a state-of-the-art mobile-first Blood Bank Management System empowering hospitals, voluntary blood donors, and administrators to coordinate emergency blood requirements in real time.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <Zap className="w-8 h-8 text-red-600" />
          <h3 className="font-bold text-gray-900 text-lg">Real-Time Sync</h3>
          <p className="text-sm text-gray-600">Immediate inventory updates upon donation and request fulfillment to eliminate delays.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <ShieldCheck className="w-8 h-8 text-red-600" />
          <h3 className="font-bold text-gray-900 text-lg">Verified Network</h3>
          <p className="text-sm text-gray-600">All participating hospital licenses and donor credentials undergo strict admin verification.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <Award className="w-8 h-8 text-red-600" />
          <h3 className="font-bold text-gray-900 text-lg">Mobile Optimization</h3>
          <p className="text-sm text-gray-600">Designed ground-up for smartphones to enable rapid emergency requests on the move.</p>
        </div>
      </div>
    </div>
  );
}
