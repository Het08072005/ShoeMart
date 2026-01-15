# import re
# from rapidfuzz import fuzz, process

# class QueryParser:
#     STOP_WORDS = {
#         "show", "me", "find", "i", "want", "to", "buy", "looking", "for",
#         "a", "an", "the", "some", "please", "get", "shoes", "shoe", "pair", "hey", "cool"
#     }

#     GENDERS = {
#         "male": "male", "men": "male", "man": "male",
#         "female": "female", "women": "female", "woman": "female",
#         "kids": "kids", "child": "kids",
#         "unisex": "unisex"
#     }

#     COLORS = [
#         "red", "blue", "black", "white", "green", "yellow",
#         "grey", "gray", "brown", "pink", "orange", "purple", "beige"
#     ]

#     OCCASIONS = [
#         "casual", "sports", "formal", "party", "running",
#         "gym", "office", "sneakers", "wedding"
#     ]

#     SIZE_PREFIXES = ["size", "uk", "us", "eu", "number", "no"]

#     PRICE_KEYWORDS = {
#         "max": ["less", "under", "below", "cheaper", "upto", "price <", "not more than"],
#         "min": ["more", "above", "over", "greater", "starting", "price >", "not less than"]
#     }

#     NATURAL_PRICE_WORDS = {
#         "cheap": {"max": 5000},
#         "affordable": {"max": 7000},
#         "expensive": {"min": 10000},
#         "not too expensive": {"max": 7000}
#     }

#     @staticmethod
#     def clean_price(price_str: str) -> int:
#         price_str = price_str.lower().replace(" ", "")
#         match = re.match(r"(\d+(\.\d+)?)(k)?", price_str)
#         if match:
#             number = float(match.group(1))
#             if match.group(3):  # 'k' present
#                 number *= 1000
#             return int(number)
#         return 0

#     @staticmethod
#     def parse(query_text: str):
#         if not query_text:
#             return {"keywords": [], "filters": {}}

#         text = query_text.lower().strip()
#         text = text.replace("then", "than").replace("underneeth", "under").replace("below", "under")

#         extracted = {
#             "min_price": None,
#             "max_price": None,
#             "genders": set(),
#             "colors": set(),
#             "occasions": set(),
#             "sizes": set(),
#             "keywords": []
#         }

#         # ---------- Natural language price ----------
#         for word, price_dict in QueryParser.NATURAL_PRICE_WORDS.items():
#             if word in text:
#                 if price_dict.get("min"):
#                     extracted["min_price"] = price_dict["min"]
#                 if price_dict.get("max"):
#                     extracted["max_price"] = price_dict["max"]
#                 text = text.replace(word, "")

#         # ---------- Price ranges ----------
#         range_match = re.findall(r'(?:between|from|range)\s*(\d+k?)\s*(?:and|to|-)\s*(\d+k?)', text)
#         for m in range_match:
#             min_p = QueryParser.clean_price(m[0])
#             max_p = QueryParser.clean_price(m[1])
#             extracted["min_price"] = min(extracted["min_price"] or min_p, min_p)
#             extracted["max_price"] = max(extracted["max_price"] or max_p, max_p)
#             text = text.replace(f"between {m[0]} and {m[1]}", "")

#         # ---------- Comparative price ----------
#         for bound, kws in QueryParser.PRICE_KEYWORDS.items():
#             for kw in kws:
#                 matches = re.findall(rf'{kw}\s*(\d+k?)', text)
#                 for match in matches:
#                     value = QueryParser.clean_price(match)
#                     if bound == "max":
#                         extracted["max_price"] = min(extracted["max_price"] or value, value)
#                     else:
#                         extracted["min_price"] = max(extracted["min_price"] or value, value)
#                     text = text.replace(f"{kw} {match}", "")

#         # ---------- Sizes (with ranges) ----------
#         size_matches = re.findall(r'(?:' + '|'.join(QueryParser.SIZE_PREFIXES) + r')\s*(\d+)(?:\s*to\s*(\d+))?', text)
#         for start, end in size_matches:
#             if end:
#                 for s in range(int(start), int(end)+1):
#                     extracted["sizes"].add(str(s))
#             else:
#                 extracted["sizes"].add(start)
#         text = re.sub(r'(?:' + '|'.join(QueryParser.SIZE_PREFIXES) + r')\s*(\d+)(?:\s*to\s*(\d+))?', "", text)

#         # ---------- Genders ----------
#         for word, gender in QueryParser.GENDERS.items():
#             # Use word boundary to match whole words only
#             if re.search(rf'\b{word}\b', text):
#                 extracted["genders"].add(gender)
#                 text = re.sub(rf'\b{word}\b', "", text)

#         # ---------- Colors (fuzzy matching) ----------
#         for color in QueryParser.COLORS:
#             result = process.extractOne(color, text.split(), scorer=fuzz.ratio)
#             if result:
#                 match, score, _ = result  # rapidfuzz returns 3 values
#                 if score > 80:
#                     extracted["colors"].add(color)
#                     text = text.replace(match, "")

#         # ---------- Occasions ----------
#         for occ in QueryParser.OCCASIONS:
#             if occ in text:
#                 extracted["occasions"].add(occ)
#                 text = text.replace(occ, "")

#         # ---------- Keywords ----------
#         words = re.findall(r'\b\w+\b', text)
#         extracted["keywords"] = [w for w in words if w not in QueryParser.STOP_WORDS and len(w) > 2]

#         return {
#             "keywords": extracted["keywords"],
#             "filters": {
#                 "min_price": extracted["min_price"],
#                 "max_price": extracted["max_price"],
#                 "genders": list(extracted["genders"]),
#                 "colors": list(extracted["colors"]),
#                 "occasions": list(extracted["occasions"]),
#                 "sizes": list(extracted["sizes"])
#             }
#         }















# import re
# from rapidfuzz import fuzz, process

# class QueryParser:
#     STOP_WORDS = {
#         "show", "me", "find", "i", "want", "to", "buy", "looking", "for",
#         "a", "an", "the", "some", "please", "get", "shoes", "shoe",
#         "pair", "hey", "cool", "best", "top", "popular", "trending"
#     }

#     GENDERS = {
#         "male": "male", "men": "male", "man": "male",
#         "female": "female", "women": "female", "woman": "female",
#         "kids": "kids", "child": "kids",
#         "unisex": "unisex"
#     }

#     COLORS = [
#         "red", "blue", "black", "white", "green", "yellow",
#         "grey", "gray", "brown", "pink", "orange", "purple", "beige"
#     ]

#     OCCASIONS = [
#         "casual", "sports", "formal", "party", "running",
#         "gym", "office", "sneakers", "wedding"
#     ]

#     SIZE_PREFIXES = ["size", "uk", "us", "eu", "number", "no"]

#     PRICE_KEYWORDS = {
#         "max": ["less", "under", "below", "cheaper", "upto", "price <", "not more than"],
#         "min": ["more", "above", "over", "greater", "starting", "price >", "not less than"]
#     }

#     NATURAL_PRICE_WORDS = {
#         "cheap": {"max": 5000},
#         "affordable": {"max": 7000},
#         "expensive": {"min": 10000},
#         "not too expensive": {"max": 7000}
#     }

#     BEST_KEYWORDS = {
#         "best", "top", "popular", "trending", "most sold", "recommended", "high rating"
#     }

#     @staticmethod
#     def clean_price(price_str: str) -> int:
#         price_str = price_str.lower().replace(" ", "")
#         match = re.match(r"(\d+(\.\d+)?)(k)?", price_str)
#         if match:
#             number = float(match.group(1))
#             if match.group(3):
#                 number *= 1000
#             return int(number)
#         return 0

#     @staticmethod
#     def parse(query_text: str):
#         if not query_text:
#             return {"keywords": [], "filters": {}}

#         text = query_text.lower().strip()

#         extracted = {
#             "min_price": None,
#             "max_price": None,
#             "genders": set(),
#             "colors": set(),
#             "occasions": set(),
#             "sizes": set(),
#             "keywords": [],
#             "is_best_query": False
#         }

#         # ---------- Detect BEST / POPULAR ----------
#         for kw in QueryParser.BEST_KEYWORDS:
#             if kw in text:
#                 extracted["is_best_query"] = True
#                 text = text.replace(kw, "")

#         # ---------- Natural price ----------
#         for word, price_dict in QueryParser.NATURAL_PRICE_WORDS.items():
#             if word in text:
#                 if price_dict.get("min"):
#                     extracted["min_price"] = price_dict["min"]
#                 if price_dict.get("max"):
#                     extracted["max_price"] = price_dict["max"]
#                 text = text.replace(word, "")

#         # ---------- Price range ----------
#         range_match = re.findall(
#             r'(?:between|from|range)\s*(\d+k?)\s*(?:and|to|-)\s*(\d+k?)',
#             text
#         )
#         for m in range_match:
#             extracted["min_price"] = QueryParser.clean_price(m[0])
#             extracted["max_price"] = QueryParser.clean_price(m[1])

#         # ---------- Sizes ----------
#         size_matches = re.findall(
#             r'(?:' + '|'.join(QueryParser.SIZE_PREFIXES) + r')\s*(\d+)(?:\s*to\s*(\d+))?',
#             text
#         )
#         for start, end in size_matches:
#             if end:
#                 for s in range(int(start), int(end) + 1):
#                     extracted["sizes"].add(str(s))
#             else:
#                 extracted["sizes"].add(start)

#         # ---------- Gender ----------
#         for word, gender in QueryParser.GENDERS.items():
#             if re.search(rf'\b{word}\b', text):
#                 extracted["genders"].add(gender)

#         # ---------- Colors ----------
#         for color in QueryParser.COLORS:
#             result = process.extractOne(color, text.split(), scorer=fuzz.ratio)
#             if result and result[1] > 80:
#                 extracted["colors"].add(color)

#         # ---------- Occasions ----------
#         for occ in QueryParser.OCCASIONS:
#             if occ in text:
#                 extracted["occasions"].add(occ)

#         # ---------- Keywords ----------
#         words = re.findall(r'\b\w+\b', text)
#         extracted["keywords"] = [
#             w for w in words if w not in QueryParser.STOP_WORDS and len(w) > 2
#         ]

#         return {
#             "keywords": extracted["keywords"],
#             "filters": {
#                 "min_price": extracted["min_price"],
#                 "max_price": extracted["max_price"],
#                 "genders": list(extracted["genders"]),
#                 "colors": list(extracted["colors"]),
#                 "occasions": list(extracted["occasions"]),
#                 "sizes": list(extracted["sizes"]),
#                 "is_best_query": extracted["is_best_query"]
#             }
#         }











import re
from rapidfuzz import fuzz, process


class QueryParser:
    # --------------------------------------------------
    # STOP WORDS
    # --------------------------------------------------
    STOP_WORDS = {
        "show", "me", "find", "i", "want", "to", "buy", "looking", "for",
        "a", "an", "the", "some", "please", "get", "shoes", "shoe",
        "pair", "hey", "cool", "best", "top", "popular", "trending",
        "recommended", "most", "selling", "rated"
    }

    # --------------------------------------------------
    # GENDERS
    # --------------------------------------------------
    GENDERS = {
        "male": "male", "men": "male", "man": "male", "boys": "male",
        "female": "female", "women": "female", "woman": "female", "girls": "female",
        "kids": "kids", "child": "kids", "children": "kids",
        "unisex": "unisex"
    }

    # --------------------------------------------------
    # COLORS
    # --------------------------------------------------
    COLORS = [
        "red", "blue", "black", "white", "green", "yellow",
        "grey", "gray", "brown", "pink", "orange", "purple",
        "beige", "navy", "maroon"
    ]

    # --------------------------------------------------
    # OCCASIONS + INTENT NORMALIZATION
    # --------------------------------------------------
    OCCASION_SYNONYMS = {
        "gym": "gym",
        "training": "training",
        "workout": "gym",
        "fitness": "gym",
        "running": "running",
        "jogging": "running",
        "sports": "sports",
        "casual": "casual",
        "daily": "casual",
        "office": "formal",
        "formal": "formal",
        "party": "party",
        "wedding": "wedding",
        "sneakers": "casual"
    }

    OCCASIONS = list(set(OCCASION_SYNONYMS.values()))

    # --------------------------------------------------
    # SIZES
    # --------------------------------------------------
    SIZE_PREFIXES = ["size", "uk", "us", "eu", "number", "no"]

    # --------------------------------------------------
    # PRICE KEYWORDS
    # --------------------------------------------------
    PRICE_KEYWORDS = {
        "max": ["less", "under", "below", "cheaper", "upto", "price <", "not more than"],
        "min": ["more", "above", "over", "greater", "starting", "price >", "not less than"]
    }

    NATURAL_PRICE_WORDS = {
        "cheap": {"max": 3000},
        "budget": {"max": 2500},
        "affordable": {"max": 5000},
        "midrange": {"min": 4000, "max": 8000},
        "expensive": {"min": 9000},
        "premium": {"min": 10000},
        "not too expensive": {"max": 6000}
    }

    # --------------------------------------------------
    # BEST / POPULAR INTENT
    # --------------------------------------------------
    BEST_KEYWORDS = {
        "best", "top", "popular", "trending", "most sold",
        "recommended", "high rating", "top rated", "best selling"
    }

    # --------------------------------------------------
    # BRAND LIST (DB SAFE)
    # --------------------------------------------------
    BRANDS = [
        "nike", "adidas", "puma", "bata", "campus",
        "reebok", "skechers", "fila", "woodland"
    ]

    # --------------------------------------------------
    # CLEAN PRICE
    # --------------------------------------------------
    @staticmethod
    def clean_price(price_str: str) -> int:
        price_str = price_str.lower().replace(" ", "")
        match = re.match(r"(\d+(\.\d+)?)(k)?", price_str)
        if match:
            number = float(match.group(1))
            if match.group(3):
                number *= 1000
            return int(number)
        return 0

    # --------------------------------------------------
    # MAIN PARSER
    # --------------------------------------------------
    @staticmethod
    def parse(query_text: str):
        if not query_text:
            return {"keywords": [], "filters": {}}

        text = query_text.lower().strip()

        extracted = {
            "min_price": None,
            "max_price": None,
            "genders": set(),
            "colors": set(),
            "occasions": set(),
            "sizes": set(),
            "brands": set(),
            "keywords": [],
            "is_best_query": False
        }

        # ---------- BEST INTENT ----------
        for kw in QueryParser.BEST_KEYWORDS:
            if kw in text:
                extracted["is_best_query"] = True
                text = text.replace(kw, " ")

        # ---------- NATURAL PRICE ----------
        for word, price_dict in QueryParser.NATURAL_PRICE_WORDS.items():
            if word in text:
                extracted["min_price"] = price_dict.get("min", extracted["min_price"])
                extracted["max_price"] = price_dict.get("max", extracted["max_price"])
                text = text.replace(word, " ")

        # ---------- PRICE RANGE ----------
        range_match = re.findall(
            r'(?:between|from|range)\s*(\d+k?)\s*(?:and|to|-)\s*(\d+k?)',
            text
        )
        for low, high in range_match:
            extracted["min_price"] = QueryParser.clean_price(low)
            extracted["max_price"] = QueryParser.clean_price(high)

        # ---------- COMPARATIVE PRICE ----------
        for bound, words in QueryParser.PRICE_KEYWORDS.items():
            for w in words:
                match = re.search(rf'{w}\s*(\d+k?)', text)
                if match:
                    value = QueryParser.clean_price(match.group(1))
                    if bound == "max":
                        extracted["max_price"] = value
                    else:
                        extracted["min_price"] = value

        # ---------- SIZE ----------
        size_matches = re.findall(
            r'(?:' + '|'.join(QueryParser.SIZE_PREFIXES) + r')\s*(\d+)(?:\s*to\s*(\d+))?',
            text
        )
        for start, end in size_matches:
            if end:
                for s in range(int(start), int(end) + 1):
                    extracted["sizes"].add(str(s))
            else:
                extracted["sizes"].add(start)

        # ---------- GENDER ----------
        for word, gender in QueryParser.GENDERS.items():
            if re.search(rf'\b{word}\b', text):
                extracted["genders"].add(gender)

        # ---------- BRAND ----------
        for brand in QueryParser.BRANDS:
            if re.search(rf'\b{brand}\b', text):
                extracted["brands"].add(brand)

        # ---------- COLORS (FUZZY) ----------
        tokens = text.split()
        for color in QueryParser.COLORS:
            match = process.extractOne(color, tokens, scorer=fuzz.ratio)
            if match and match[1] >= 85:
                extracted["colors"].add(color)

        # ---------- OCCASIONS (SYNONYM BASED) ----------
        for word, normalized in QueryParser.OCCASION_SYNONYMS.items():
            if re.search(rf'\b{word}\b', text):
                extracted["occasions"].add(normalized)

        # ---------- KEYWORDS ----------
        words = re.findall(r'\b[a-z0-9]+\b', text)
        extracted["keywords"] = [
            w for w in words
            if w not in QueryParser.STOP_WORDS and len(w) > 2
        ]

        return {
            "keywords": extracted["keywords"],
            "filters": {
                "min_price": extracted["min_price"],
                "max_price": extracted["max_price"],
                "genders": list(extracted["genders"]),
                "colors": list(extracted["colors"]),
                "occasions": list(extracted["occasions"]),
                "sizes": list(extracted["sizes"]),
                "brands": list(extracted["brands"]),
                "is_best_query": extracted["is_best_query"]
            }
        }















































