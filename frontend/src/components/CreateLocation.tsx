import { useState } from 'react';
import client from '../api/client';
import { Location } from '../types/api';
import { useNavigate } from 'react-router-dom';
import { Save, AlertCircle, MapPin } from 'lucide-react';

export default function CreateLocation() {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!name) {
                setError('Location Name is required');
                setLoading(false);
                return;
            }
            await client.post('/locations', { name });
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to create location');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Add New Location</h2>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                {error && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <input
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="e.g. Warehouse A, Shelf 3"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Must be unique.</p>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
                    >
                        {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Create Location</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
