import { useState, useEffect } from 'react';
import client from '../api/client';
import { Product, Location } from '../types/api';
import { ArrowRight, ArrowDownToLine, ArrowUpFromLine, Save, AlertCircle } from 'lucide-react';

export default function StockAction() {
    const [mode, setMode] = useState<'ADJUST' | 'MOVE'>('ADJUST');
    const [products, setProducts] = useState<Product[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Form states
    const [productSku, setProductSku] = useState('');
    const [locationId, setLocationId] = useState('');
    const [toLocationId, setToLocationId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [adjustType, setAdjustType] = useState('add'); // add, remove

    useEffect(() => {
        // Fetch dropdown data
        Promise.all([
            client.get<Product[]>('/products'),
            client.get<Location[]>('/locations')
        ]).then(([p, l]) => {
            setProducts(p.data);
            setLocations(l.data);
        }).catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            if (mode === 'ADJUST') {
                const qty = parseInt(quantity);
                if (isNaN(qty) || qty <= 0) throw new Error('Invalid quantity');
                const finalQty = adjustType === 'add' ? qty : -qty;

                await client.post('/stock/adjust', {
                    product_sku: productSku,
                    location_id: parseInt(locationId),
                    quantity: finalQty
                });
                setMessage(`Stock ${adjustType === 'add' ? 'added to' : 'removed from'} inventory.`);
            } else {
                const qty = parseInt(quantity);
                await client.post('/stock/move', {
                    product_sku: productSku,
                    from_location_id: parseInt(locationId),
                    to_location_id: parseInt(toLocationId),
                    quantity: qty
                });
                setMessage('Stock moved successfully.');
            }
            // Reset sensitive fields
            setQuantity('');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || err.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Stock Actions</h2>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setMode('ADJUST')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'ADJUST' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Adjust Stock
                    </button>
                    <button
                        onClick={() => setMode('MOVE')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'MOVE' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Move Stock
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                {message && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">{message}</div>}
                {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm"><AlertCircle className="w-4 h-4" /> {error}</div>}

                {/* Product Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        value={productSku}
                        onChange={(e) => setProductSku(e.target.value)}
                        required
                    >
                        <option value="">Select Product...</option>
                        {products.map(p => <option key={p.sku} value={p.sku}>{p.name} ({p.sku})</option>)}
                    </select>
                </div>

                {mode === 'ADJUST' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setAdjustType('add')}
                                    className={`flex-1 py-2 px-3 rounded-lg border text-center text-sm font-medium flex items-center justify-center gap-2 ${adjustType === 'add' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-300 text-gray-600'}`}
                                >
                                    <ArrowDownToLine className="w-4 h-4" /> Add
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAdjustType('remove')}
                                    className={`flex-1 py-2 px-3 rounded-lg border text-center text-sm font-medium flex items-center justify-center gap-2 ${adjustType === 'remove' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-gray-300 text-gray-600'}`}
                                >
                                    <ArrowUpFromLine className="w-4 h-4" /> Remove
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={locationId}
                                onChange={(e) => setLocationId(e.target.value)}
                                required
                            >
                                <option value="">Select Location...</option>
                                {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>
                    </div>
                )}

                {mode === 'MOVE' && (
                    <div className="grid grid-cols-2 gap-4 relative">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">From Location</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={locationId}
                                onChange={(e) => setLocationId(e.target.value)}
                                required
                            >
                                <option value="">Origin...</option>
                                {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To Location</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={toLocationId}
                                onChange={(e) => setToLocationId(e.target.value)}
                                required
                            >
                                <option value="">Destination...</option>
                                {locations.filter(l => l.id.toString() !== locationId).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full border border-gray-200 text-gray-400 mt-3">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="0"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium flex justify-center items-center gap-2"
                >
                    {loading ? 'Processing...' : <><Save className="w-4 h-4" /> Confirm {mode === 'ADJUST' ? 'Adjustment' : 'Move'}</>}
                </button>
            </form>

            {locations.length === 0 && (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                    No locations found. You should create locations via API or add a "Create Location" feature.
                </div>
            )}
        </div>
    );
}
