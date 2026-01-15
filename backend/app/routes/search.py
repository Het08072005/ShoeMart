from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from fastapi.encoders import jsonable_encoder  # 🔹 new import
from app.database import get_db
from app.schemas.product import ProductCreate, ProductResponse
from app.models.product import Product
from app.services.search_service import SearchService
from app.websocket.manager import manager  # 🔥 WebSocket manager

router = APIRouter()


# ----------------------------------------
# Add product endpoint
# ----------------------------------------
@router.post("/add", response_model=ProductResponse)
def add_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.dict())
    return SearchService.add_product(db, db_product)


# ----------------------------------------
# Get all products
# ----------------------------------------
@router.get("/all", response_model=List[ProductResponse])
def get_all_products(db: Session = Depends(get_db)):
    return SearchService.get_all(db)


# ----------------------------------------
# Simple search endpoint
# ----------------------------------------
@router.get("/search", response_model=List[ProductResponse])
async def search(q: str = Query(None), db: Session = Depends(get_db)):
    """
    Standard search endpoint:
    - Accepts query q (text)
    - Returns matching products
    - Broadcasts results via WebSocket
    """
    if not q:
        products = SearchService.get_all(db)
    else:
        products = SearchService.smart_search(db, q)

    # 🔹 Convert products to JSON-serializable format
    products_json = jsonable_encoder(products)

    # 🔥 Broadcast to all connected WebSocket clients
    await manager.broadcast({
        "type": "SEARCH_RESULT",
        "query": q or "",
        "found": len(products) > 0,
        "products": products_json
    })

    return products


# ----------------------------------------
# Smart search endpoint (natural language)
# ----------------------------------------
@router.get("/smart-search")
async def smart_search(q: str = Query(None), db: Session = Depends(get_db)):
    """
    Parses natural language queries like:
    'nike black sport shoes under 10k'
    Returns products, applied filters, parsed query
    Broadcasts results to WebSocket for frontend auto-fill
    """
    if not q:
        products = SearchService.get_all(db)
        parsed = {"keywords": [], "filters": {}}
    else:
        result = SearchService.advanced_search_with_filters(db, q)
        products = result.get("products", [])
        parsed = result.get("parsedQuery", {"keywords": [], "filters": {}})

    # 🔹 Convert products to JSON-serializable format
    products_json = jsonable_encoder(products)

    # 🔥 Broadcast to frontend
    await manager.broadcast({
        "type": "SEARCH_RESULT",
        "query": q or "",
        "found": len(products) > 0,
        "products": products_json,
        "parsedQuery": parsed
    })

    return {
        "products": products,
        "parsedQuery": parsed
    }


# ----------------------------------------
# Advanced search with multiple filters
# ----------------------------------------
@router.get("/advanced-search", response_model=List[ProductResponse])
async def advanced_search(
    q: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    min_price: Optional[int] = Query(None),
    max_price: Optional[int] = Query(None),
    color: Optional[str] = Query(None),
    size: Optional[str] = Query(None),
    occasion: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Advanced search endpoint with multiple filters:
    - q: search query (text search)
    - category, gender, min_price, max_price, color, size, occasion
    Broadcasts results via WebSocket
    """

    filters = {
        "query": q,
        "category": category,
        "gender": gender,
        "min_price": min_price,
        "max_price": max_price,
        "color": color,
        "size": size,
        "occasion": occasion
    }

    products = SearchService.advanced_search(db, filters)

    # 🔹 Convert products to JSON-serializable format
    products_json = jsonable_encoder(products)

    # 🔥 Broadcast to frontend
    await manager.broadcast({
        "type": "SEARCH_RESULT",
        "query": q or "",
        "found": len(products) > 0,
        "products": products_json,
        "filters": {k: v for k, v in filters.items() if v is not None}
    })

    return products
