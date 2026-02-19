from . import db
from datetime import datetime
from sqlalchemy import CheckConstraint

class Product(db.Model):
    sku = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    
    # Relationships
    stock_levels = db.relationship('Stock', backref='product', lazy=True)

    def to_dict(self):
        return {
            'sku': self.sku,
            'name': self.name,
            'description': self.description
        }

class Location(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    
    # Relationships
    stock_levels = db.relationship('Stock', backref='location', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

class Stock(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_sku = db.Column(db.String(50), db.ForeignKey('product.sku'), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey('location.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=0)

    # Ensure quantity is never negative
    __table_args__ = (
        CheckConstraint('quantity >= 0', name='check_stock_positive'),
        db.UniqueConstraint('product_sku', 'location_id', name='unique_stock_entry'),
    )

    def to_dict(self):
        return {
            'product_sku': self.product_sku,
            'location_id': self.location_id,
            'quantity': self.quantity
        }

class StockMovement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    action = db.Column(db.String(20), nullable=False) # 'IN', 'OUT', 'MOVE'
    quantity = db.Column(db.Integer, nullable=False)
    
    # For auditing
    product_sku = db.Column(db.String(50), db.ForeignKey('product.sku'), nullable=False)
    from_location_id = db.Column(db.Integer, db.ForeignKey('location.id'), nullable=True)
    to_location_id = db.Column(db.Integer, db.ForeignKey('location.id'), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'timestamp': self.timestamp.isoformat(),
            'action': self.action,
            'quantity': self.quantity,
            'product_sku': self.product_sku,
            'from_location_id': self.from_location_id,
            'to_location_id': self.to_location_id
        }
