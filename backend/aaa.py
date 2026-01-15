from sqlalchemy.orm import Session
from app.database import SessionLocal, Base, engine
from app.models.product import Product

# ---------- Create tables if they don't exist ----------
Base.metadata.create_all(bind=engine)

# ---------- Sample products data ----------
products_data = [
   {
  "name": "PowerFlex Pro Training Shoes",
  "category": "shoes",
  "brand": "Nike",
  "price": 4800,
  "gender": "male",
  "colors": ["black", "grey"],
  "sizes": ["7", "8", "9", "10", "11"],
  "occasions": ["training", "gym"],
  "tags": [
    "lightweight",
    "flexible",
    "breathable",
    "training shoes",
    "gym shoes",
    "sports shoes",
    "men shoes",
    "nike shoes",
    "best training shoes",
    "popular gym shoes"
  ],
  "description": "PowerFlex Pro Training Shoes by Nike are lightweight and breathable gym shoes for men. Ideal for workouts, training, and high-intensity gym sessions. One of the best and most popular Nike training shoes.",
  "image_url": "https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/354579c8-80dc-4c75-9b4c-8a8f0e50009d/NIKE+FLEX+TRAIN.png"
},
{
  "name": "AirStride Running Shoes",
  "category": "shoes",
  "brand": "Adidas",
  "price": 5200,
  "gender": "male",
  "colors": ["blue", "white"],
  "sizes": ["7", "8", "9", "10"],
  "occasions": ["running", "sports"],
  "tags": [
    "running shoes",
    "sports shoes",
    "lightweight",
    "breathable",
    "men running shoes",
    "adidas shoes",
    "best running shoes",
    "popular sports shoes"
  ],
  "description": "AirStride Running Shoes by Adidas are lightweight and breathable sports shoes for men. Designed for running, jogging, and daily workouts. Popular choice for runners.",
  "image_url": "https://assets.adidas.com/images/w_600,f_auto,q_auto/d77b99bfe5de4653be8fc3fcf5ec663f_9366/Kaptir_Flow_Shoes_White_IF6600_06_standard.jpg"
},
{
  "name": "UrbanWalk Casual Sneakers",
  "category": "shoes",
  "brand": "Puma",
  "price": 3900,
  "gender": "male",
  "colors": ["white", "black"],
  "sizes": ["7", "8", "9", "10", "11"],
  "occasions": ["casual", "daily"],
  "tags": [
    "casual shoes",
    "sneakers",
    "daily wear shoes",
    "men casual shoes",
    "puma shoes",
    "trending sneakers",
    "popular casual shoes"
  ],
  "description": "UrbanWalk Casual Sneakers by Puma are stylish and comfortable shoes for daily wear. A popular choice for casual outings and everyday use.",
  "image_url": "https://assets.myntassets.com/assets/images/17350742/2025/3/11/41db72cb-17d9-4a2d-8642-752e2a54fab61741693692143-Puma-Men-White--Black-Colourblocked-IDP-Sneakers-22817416936-7.jpg"
},
{
  "name": "EliteForm Office Shoes",
  "category": "shoes",
  "brand": "Bata",
  "price": 3500,
  "gender": "male",
  "colors": ["black", "brown"],
  "sizes": ["7", "8", "9", "10", "11"],
  "occasions": ["formal", "office"],
  "tags": [
    "formal shoes",
    "office shoes",
    "men formal shoes",
    "bata shoes",
    "best office shoes",
    "comfortable formal shoes"
  ],
  "description": "EliteForm Office Shoes by Bata are comfortable and stylish formal shoes for men. Perfect for office wear and formal occasions.",
  "image_url": "https://5.imimg.com/data5/SELLER/Default/2024/10/455998874/QS/TI/VE/183196798/men-brown-rexine-formal-shoes-500x500.jpg"
},
{
  "name": "Everyday Comfort Sports Shoes",
  "category": "shoes",
  "brand": "Campus",
  "price": 2200,
  "gender": "male",
  "colors": ["grey", "black"],
  "sizes": ["6", "7", "8", "9", "10"],
  "occasions": ["sports", "casual"],
  "tags": [
    "budget shoes",
    "sports shoes",
    "daily wear shoes",
    "men sports shoes",
    "cheap sports shoes",
    "value for money",
    "popular budget shoes"
  ],
  "description": "Everyday Comfort Sports Shoes by Campus are affordable and comfortable shoes for daily use. Best value-for-money sports shoes for men.",
  "image_url": "https://image.made-in-china.com/202f0j00nQwkpvOPLgoq/Latest-Design-Men-Running-Sports-Shoes-Breathable-Mesh-Fashion-Sneakers-for-Male.webp"
}


]


# ---------- Insert data ----------
def add_products():
    db: Session = SessionLocal()
    try:
        for pdata in products_data:
            product = Product(**pdata)
            db.add(product)
        db.commit()
        print(f"{len(products_data)} products added successfully!")
    except Exception as e:
        db.rollback()
        print("Error adding products:", e)
    finally:
        db.close()

if __name__ == "__main__":
    add_products()
