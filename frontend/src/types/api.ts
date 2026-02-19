export interface Product {
    sku: string;
    name: string;
    description?: string;
}

export interface Location {
    id: number;
    name: string;
}

export interface Stock {
    product_sku: string;
    location_id: number;
    quantity: number;
    // Extended fields from GET /stock
    product?: string;
    location?: string;
}

export interface StockMovement {
    id: number;
    timestamp: string;
    action: 'IN' | 'OUT' | 'MOVE';
    quantity: number;
    product_sku: string;
    from_location_id?: number;
    to_location_id?: number;
}
