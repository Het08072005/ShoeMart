from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc
from app.models.product import Product
from app.utils.query_parser import QueryParser
from typing import Dict, Any, List


class SearchService:

    # ==================================================
    # INTERNAL HELPERS (SAFE)
    # ==================================================
    @staticmethod
    def _safe_order_by(query, model, field: str, descending: bool = True):
        """
        Apply order_by only if model has that column
        """
        if hasattr(model, field):
            column = getattr(model, field)
            return query.order_by(desc(column) if descending else column)
        return query

    @staticmethod
    def _apply_brand_filter(query, brands: List[str]):
        """
        Brand filter (OR based)
        """
        if brands:
            return query.filter(or_(*(Product.brand.ilike(b) for b in brands)))
        return query


    # ==================================================
    # SMART SEARCH (MAIN)
    # ==================================================
    @staticmethod
    def smart_search(db: Session, query_text: str):
        parsed = QueryParser.parse(query_text)
        f = parsed["filters"]
        keywords = parsed["keywords"]

        query = db.query(Product)

        # ---------- Keyword Search ----------
        if keywords:
            keyword_clauses = []
            for word in keywords:
                term = f"%{word}%"
                keyword_clauses.extend([
                    Product.name.ilike(term),
                    Product.brand.ilike(term),
                    Product.description.ilike(term)
                ])
            query = query.filter(or_(*keyword_clauses))

        # ---------- Price ----------
        if f.get("max_price") is not None:
            query = query.filter(Product.price <= f["max_price"])
        if f.get("min_price") is not None:
            query = query.filter(Product.price >= f["min_price"])

        # ---------- Genders (OR) ----------
        genders = f.get("genders", [])
        if genders:
            query = query.filter(or_(*(Product.gender.ilike(g) for g in genders)))

        # ---------- Brands (NEW – SAFE ADDITION) ----------
        brands = f.get("brands", [])
        query = SearchService._apply_brand_filter(query, brands)

        # ---------- Colors (OR) ----------
        colors = f.get("colors", [])
        if colors:
            query = query.filter(or_(*(Product.colors.any(c) for c in colors)))

        # ---------- Occasions (OR) ----------
        occasions = f.get("occasions", [])
        if occasions:
            query = query.filter(or_(*(Product.occasions.any(o) for o in occasions)))

        # ---------- Sizes (OR) ----------
        sizes = f.get("sizes", [])
        if sizes:
            query = query.filter(or_(*(Product.sizes.any(str(s)) for s in sizes)))

        # ---------- AUTO BEST / POPULAR SORT (NEW) ----------
        if f.get("is_best_query"):
            query = SearchService._safe_order_by(query, Product, "rating")
            query = SearchService._safe_order_by(query, Product, "total_sales")
            query = SearchService._safe_order_by(query, Product, "popularity_score")

        return query.all()


    # ==================================================
    # ADVANCED SEARCH WITH FILTER METADATA
    # ==================================================
    @staticmethod
    def advanced_search_with_filters(db: Session, query_text: str) -> Dict[str, Any]:
        """
        Advanced search that returns both products and detected filters
        """
        parsed = QueryParser.parse(query_text)
        f = parsed["filters"]
        keywords = parsed["keywords"]

        query = db.query(Product)

        # ---------- Text Search ----------
        if keywords:
            keyword_clauses = []
            for word in keywords:
                term = f"%{word}%"
                keyword_clauses.extend([
                    Product.name.ilike(term),
                    Product.brand.ilike(term),
                    Product.description.ilike(term),
                    Product.tags.any(term) if hasattr(Product, "tags") else False
                ])
            query = query.filter(or_(*keyword_clauses))

        # ---------- Price ----------
        if f.get("max_price") is not None:
            query = query.filter(Product.price <= f["max_price"])
        if f.get("min_price") is not None:
            query = query.filter(Product.price >= f["min_price"])

        # ---------- Genders ----------
        genders = f.get("genders", [])
        if genders:
            query = query.filter(or_(*(Product.gender.ilike(g) for g in genders)))

        # ---------- Brands (NEW) ----------
        brands = f.get("brands", [])
        query = SearchService._apply_brand_filter(query, brands)

        # ---------- Colors ----------
        colors = f.get("colors", [])
        if colors:
            query = query.filter(or_(*(Product.colors.any(c) for c in colors)))

        # ---------- Occasions ----------
        occasions = f.get("occasions", [])
        if occasions:
            query = query.filter(or_(*(Product.occasions.any(o) for o in occasions)))

        # ---------- Sizes ----------
        sizes = f.get("sizes", [])
        if sizes:
            query = query.filter(or_(*(Product.sizes.any(str(s)) for s in sizes)))

        # ---------- AUTO BEST SORT ----------
        if f.get("is_best_query"):
            query = SearchService._safe_order_by(query, Product, "rating")
            query = SearchService._safe_order_by(query, Product, "total_sales")
            query = SearchService._safe_order_by(query, Product, "popularity_score")

        products = query.all()

        # ---------- Applied Filters for UI ----------
        applied_filters = {}

        if f.get("min_price") or f.get("max_price"):
            applied_filters["priceRange"] = [
                f.get("min_price") or 0,
                f.get("max_price") or 20000
            ]

        if genders:
            applied_filters["gender"] = genders
        if brands:
            applied_filters["brands"] = brands
        if colors:
            applied_filters["colors"] = colors
        if occasions:
            applied_filters["occasions"] = occasions
        if sizes:
            applied_filters["sizes"] = sizes
        if keywords:
            applied_filters["keywords"] = keywords
        if f.get("is_best_query"):
            applied_filters["autoSort"] = "best"

        return {
            "products": products,
            "appliedFilters": applied_filters,
            "parsedQuery": {
                "keywords": keywords,
                "filters": f
            }
        }


    # ==================================================
    # OLD ADVANCED SEARCH (BACKWARD COMPATIBLE – UNTOUCHED)
    # ==================================================
    @staticmethod
    def advanced_search(db: Session, filters: dict):
        """
        Advanced search with multiple filter options (backward compatible)
        """
        query = db.query(Product)

        # ---------- Text Search ----------
        search_query = filters.get("query")
        if search_query:
            search_term = f"%{search_query}%"
            query = query.filter(or_(
                Product.name.ilike(search_term),
                Product.brand.ilike(search_term),
                Product.description.ilike(search_term),
            ))

        # ---------- Category Filter ----------
        category = filters.get("category")
        if category and category != "all":
            query = query.filter(Product.category.ilike(category))

        # ---------- Gender Filter ----------
        gender = filters.get("gender")
        if gender and gender != "all":
            query = query.filter(Product.gender.ilike(gender))

        # ---------- Price Range Filter ----------
        min_price = filters.get("min_price")
        max_price = filters.get("max_price")
        if min_price is not None:
            query = query.filter(Product.price >= min_price)
        if max_price is not None:
            query = query.filter(Product.price <= max_price)

        # ---------- Color Filter ----------
        color = filters.get("color")
        if color:
            query = query.filter(Product.colors.any(color))

        # ---------- Size Filter ----------
        size = filters.get("size")
        if size:
            query = query.filter(Product.sizes.any(str(size)))

        # ---------- Occasion Filter ----------
        occasion = filters.get("occasion")
        if occasion:
            query = query.filter(Product.occasions.any(occasion))

        return query.all()


    # ==================================================
    # PRODUCT CRUD
    # ==================================================
    @staticmethod
    def add_product(db: Session, product_data: Product):
        db.add(product_data)
        db.commit()
        db.refresh(product_data)
        return product_data

    @staticmethod
    def get_all(db: Session):
        return db.query(Product).all()
