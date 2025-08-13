1) Install WSL on Windows
2) Install mongodb on Windows
3) Install Docker on Windows
4) Starting WSL on Windows, run "docker-compose up --build"
5) Install Postman on Windows
6) Starting Postman, check endpoint like localhost:3000/auth/register. It is post request. Body will be JSON like:
{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password"
}
It will insert user information into mongodb database.
7) In Postman, POST endpoint like localhost:3000/auth/login. Body will be JSON like:
{
    "email": "test@example.com",
    "password": "password"
}
It will return JWT token.
8) In Postman, POST endpoint like localhost:3001/products. Body will be JSON like:
{
    "name": "product1",
    "description": "desc",
    "price": 10
}
9) There are other endpoints like PATCH localhost:3001/products/<product-id>, Body will be JSON like:
{
    "name": "product1",
    "description": "desc",
    "price": 5
}
10) DELETE endpoint localhost:3001/products/<product-id>
In Authorization tab, we have to set Bearer token returned from localhost:3000/auth/login for product service endpoints like:
POST endpoint like localhost:3001/products
PATCH endpoint like localhost:3001/products/<product-id>
DELETE endpoint like localhost:3001/products/<product-id>