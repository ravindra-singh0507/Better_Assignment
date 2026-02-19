from flask import Blueprint, request, jsonify
from . import db
from .models import Product, Location, Stock, StockMovement
from .schemas import ProductCreate, LocationCreate, StockAdjust, StockMove
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError

bp = Blueprint('api', __name__, url_prefix='/api')

def validate_input(schema):
    def decorator(f):
        def wrapper(*args, **kwargs):
            try:
                # Flask request.json can be None if content-type is wrong, handle that?
                json_data = request.get_json(force=True, silent=True)
                if json_data is None:
                     return jsonify({"error": "Invalid JSON or Content-Type"}), 400
                data = schema(**json_data)
                return f(data, *args, **kwargs)
            except ValidationError as e:
                return jsonify({"error": e.errors()}), 400
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator

@bp.route('/products', methods=['POST'])
@validate_input(ProductCreate)
def create_product(data):
    try:
        product = Product(sku=data.sku, name=data.name, description=data.description)
        db.session.add(product)
        db.session.commit()
        return jsonify(product.to_dict()), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Product with this SKU already exists"}), 409

@bp.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products])

@bp.route('/locations', methods=['POST'])
@validate_input(LocationCreate)
def create_location(data):
    try:
        location = Location(name=data.name)
        db.session.add(location)
        db.session.commit()
        return jsonify(location.to_dict()), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Location already exists"}), 409

@bp.route('/locations', methods=['GET'])
def get_locations():
    locations = Location.query.all()
    return jsonify([l.to_dict() for l in locations])

@bp.route('/stock', methods=['GET'])
def get_stock():
    stock = Stock.query.all()
    return jsonify([{
        'product': s.product.name,
        'sku': s.product_sku,
        'location': s.location.name,
        'quantity': s.quantity
    } for s in stock])

# Transactional Operations

@bp.route('/stock/adjust', methods=['POST'])
@validate_input(StockAdjust)
def adjust_stock(data):
    # Action: IN (positive) or OUT (negative)
    action = 'IN' if data.quantity > 0 else 'OUT'
    
    try:
        # Check existence
        product = Product.query.get(data.product_sku)
        location = Location.query.get(data.location_id)
        if not product:
            return jsonify({"error": f"Product {data.product_sku} not found"}), 404
        if not location:
            return jsonify({"error": f"Location {data.location_id} not found"}), 404
        
        stock_entry = Stock.query.filter_by(product_sku=data.product_sku, location_id=data.location_id).first()
        
        if not stock_entry:
            if data.quantity < 0:
                 return jsonify({"error": "Cannot remove stock from empty location"}), 400
            stock_entry = Stock(product_sku=data.product_sku, location_id=data.location_id, quantity=0)
            db.session.add(stock_entry)
        
        # Check constraint will catch negative balance here if flushed
        stock_entry.quantity += data.quantity
        
        # Record movement
        movement = StockMovement(
            action=action,
            quantity=abs(data.quantity),
            product_sku=data.product_sku,
            to_location_id=data.location_id if data.quantity > 0 else None,
            from_location_id=data.location_id if data.quantity < 0 else None
        )
        db.session.add(movement)
        
        db.session.commit()
        return jsonify(stock_entry.to_dict()), 200
        
    except IntegrityError as e:
        db.session.rollback()
        # This catches the CheckConstraint
        if 'check_stock_positive' in str(e):
             return jsonify({"error": "Insufficient stock"}), 400
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@bp.route('/stock/move', methods=['POST'])
@validate_input(StockMove)
def move_stock(data):
    try:
        # Check constraints
        if data.from_location_id == data.to_location_id:
             return jsonify({"error": "Source and destination must be different"}), 400
             
        source_stock = Stock.query.filter_by(product_sku=data.product_sku, location_id=data.from_location_id).first()
        
        if not source_stock or source_stock.quantity < data.quantity:
            return jsonify({"error": "Insufficient stock at source"}), 400
            
        dest_stock = Stock.query.filter_by(product_sku=data.product_sku, location_id=data.to_location_id).first()
        if not dest_stock:
            dest_stock = Stock(product_sku=data.product_sku, location_id=data.to_location_id, quantity=0)
            db.session.add(dest_stock)
            
        source_stock.quantity -= data.quantity
        dest_stock.quantity += data.quantity
        
        movement = StockMovement(
            action='MOVE',
            quantity=data.quantity,
            product_sku=data.product_sku,
            from_location_id=data.from_location_id,
            to_location_id=data.to_location_id
        )
        db.session.add(movement)
        
        db.session.commit()
        return jsonify({"message": "Stock moved successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
