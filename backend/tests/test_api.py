def test_create_product(client):
    response = client.post('/api/products', json={
        'sku': 'PROD-001',
        'name': 'Test Product',
        'description': 'A test product'
    })
    assert response.status_code == 201
    assert response.json['sku'] == 'PROD-001'

def test_create_duplicate_product(client):
    client.post('/api/products', json={'sku': 'PROD-001', 'name': 'P1'})
    response = client.post('/api/products', json={'sku': 'PROD-001', 'name': 'P2'})
    assert response.status_code == 409

def test_stock_adjust_positive(client):
    # Setup
    client.post('/api/products', json={'sku': 'P1', 'name': 'Product 1'})
    client.post('/api/locations', json={'name': 'Warehouse A'})
    
    # Add stock
    response = client.post('/api/stock/adjust', json={
        'product_sku': 'P1',
        'location_id': 1,
        'quantity': 10
    })
    assert response.status_code == 200
    assert response.json['quantity'] == 10

def test_stock_adjust_negative_insufficient(client):
    # Setup
    client.post('/api/products', json={'sku': 'P1', 'name': 'Product 1'})
    client.post('/api/locations', json={'name': 'Warehouse A'})
    
    # Try to remove stock from empty
    response = client.post('/api/stock/adjust', json={
        'product_sku': 'P1',
        'location_id': 1,
        'quantity': -5
    })
    # Should fail due to logic or constraint
    assert response.status_code == 400

def test_stock_move(client):
    # Setup
    client.post('/api/products', json={'sku': 'P1', 'name': 'Product 1'})
    client.post('/api/locations', json={'name': 'Loc A'}) # ID 1
    client.post('/api/locations', json={'name': 'Loc B'}) # ID 2
    
    client.post('/api/stock/adjust', json={'product_sku': 'P1', 'location_id': 1, 'quantity': 20})
    
    # Move
    response = client.post('/api/stock/move', json={
        'product_sku': 'P1',
        'from_location_id': 1,
        'to_location_id': 2,
        'quantity': 5
    })
    assert response.status_code == 200
    
    # Verify
    stock_response = client.get('/api/stock')
    stock = stock_response.json
    
    loc_a = next(s for s in stock if s['location'] == 'Loc A')
    loc_b = next(s for s in stock if s['location'] == 'Loc B')
    
    assert loc_a['quantity'] == 15
    assert loc_b['quantity'] == 5
