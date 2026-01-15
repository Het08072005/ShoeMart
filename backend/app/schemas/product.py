# schemas/product.py
from pydantic import BaseModel
from typing import List, Optional

class ProductBase(BaseModel):
    name: str
    category: str
    brand: str
    price: int
    gender: str
    colors: List[str]
    sizes: List[str]
    occasions: List[str]
    tags: List[str]
    description: str
    image_url: str

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    class Config:
        from_attributes = True