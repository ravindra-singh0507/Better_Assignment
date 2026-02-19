import { useEffect, useState } from 'react';
import client from '../api/client';
import { Stock } from '../types/api';
import { Loader2 } from 'lucide-react';

export default function StockList() {
    const [stock, setStock] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchStock = async () => {
        try {
            const res = await client.get<Stock[]>('/stock');
            setStock(res.data);
        } catch (err) {
            setError('Failed to fetch stock');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStock();
    }, []);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
    if (error) return <div className="p-4 text-red-600 bg-red-50 rounded border border-red-200">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Current Inventory</h2>
                <button onClick={fetchStock} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    Refresh
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stock.map((item, idx) => (
                                <tr key={`${item.product_sku}-${item.location_id}-${idx}`} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.product_sku}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.product}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-mono font-medium">
                                        <span className={item.quantity < 10 ? 'text-red-600' : 'text-green-600'}>
                                            {item.quantity}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {stock.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No stock found. <br />
                                        <span className="text-sm">Add products or adjust stock to get started.</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
