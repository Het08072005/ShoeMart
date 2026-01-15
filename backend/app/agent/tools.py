#tools.py
import httpx
from livekit.agents import function_tool, RunContext, ToolError

FASTAPI_URL = "http://localhost:8000/api/search"  # FastAPI backend endpoint

@function_tool(
    name="search_products",
    description="Search products from FastAPI backend and recommend the top result"
)
async def search_products(
    ctx: RunContext,
    query: str,
    category: str | None = None
) -> dict:
    """
    LiveKit Agent Tool to search products from FastAPI backend and return recommendation
    """

    if not query or not query.strip():
        raise ToolError("Search query is empty")

    params = {"q": query.strip()}
    if category:
        params["category"] = category.strip()

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.get(FASTAPI_URL, params=params)
            res.raise_for_status()  # Raise exception for HTTP errors

        products = res.json()

        if not isinstance(products, list):
            raise ToolError("Unexpected response format from backend")

        if products:
            recommendation = f"I found {len(products)} products for '{query}'. I recommend checking out '{products[0]['name']}'!"
        else:
            recommendation = f"Sorry, no products available for '{query}'."

        return {
            "status": "ok",
            "query": query.strip(),
            "recommendation": recommendation
        }

    except httpx.HTTPStatusError as e:
        raise ToolError(f"FastAPI returned an error: {e.response.status_code}")
    except Exception as e:
        raise ToolError(f"Failed to search products: {str(e)}")
