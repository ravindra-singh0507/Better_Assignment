import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import StockList from './components/StockList';
import CreateProduct from './components/CreateProduct';
import CreateLocation from './components/CreateLocation';
import StockAction from './components/StockAction';
import { Package, ArrowRightLeft, Plus, Box, MapPin } from 'lucide-react';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
                <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
                        <Package className="w-6 h-6" />
                        <span>TinyWarehouse</span>
                    </Link>
                    <div className="flex gap-6 text-sm font-medium text-gray-600">
                        <Link to="/" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                            <Box className="w-4 h-4" /> Inventory
                        </Link>
                        <Link to="/products/new" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                            <Plus className="w-4 h-4" /> Add Product
                        </Link>
                        <Link to="/locations/new" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> Add Location
                        </Link>
                        <Link to="/stock/actions" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                            <ArrowRightLeft className="w-4 h-4" /> Stock Actions
                        </Link>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto p-6">
                    <Routes>
                        <Route path="/" element={<StockList />} />
                        <Route path="/products/new" element={<CreateProduct />} />
                        <Route path="/locations/new" element={<CreateLocation />} />
                        <Route path="/stock/actions" element={<StockAction />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
