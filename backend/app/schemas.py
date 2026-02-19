from pydantic import BaseModel, constr, conint
from typing import Optional

class ProductCreate(BaseModel):
    sku: constr(min_length=1, max_length=50) # type: ignore
    name: constr(min_length=1, max_length=100) # type: ignore
    description: Optional[str] = None

class LocationCreate(BaseModel):
    name: constr(min_length=1, max_length=50) # type: ignore

class StockAdjust(BaseModel):
    product_sku: str
    location_id: int
    quantity: int # Can be negative for removal, positive for addition

class StockMove(BaseModel):
    product_sku: str
    from_location_id: int
    to_location_id: int
    quantity: conint(gt=0) # type: ignore
