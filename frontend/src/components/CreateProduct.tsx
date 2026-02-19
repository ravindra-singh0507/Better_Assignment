import { useState } from 'react';
import client from '../api/client';
import { Product } from '../types/api';
import { useNavigate } from 'react-router-dom';
import { Save, AlertCircle } from 'lucide-react';

export default function CreateProduct() {
    const [formData, setFormData] = useState<Product>({ sku: '', name: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!formData.sku || !formData.name) {
                setError('SKU and Name are required');
                setLoading(false);
                return;
            }
            await client.post('/products', formData);
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                {error && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Unique ID)</label>
                    <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="e.g. LAPTOP-001"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    />
                    <p className="text-xs text-gray-400 mt-1">Must be unique.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="e.g. Example Laptop"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Optional description..."
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
                    >
                        {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Create Product</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
