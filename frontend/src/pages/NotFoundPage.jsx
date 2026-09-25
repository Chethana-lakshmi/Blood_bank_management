import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4 px-4">
      <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-extrabold text-2xl shadow-inner">
        404
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900">Page Not Found</h1>
      <p className="text-gray-500 max-w-sm text-sm">
        The page you are looking for might have been moved or does not exist.
      </p>
      <Link to="/">
        <Button className="flex items-center gap-2">
          <Home className="w-4 h-4" /> Back to Home
        </Button>
      </Link>
    </div>
  );
}
