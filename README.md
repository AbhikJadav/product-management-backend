# Product Management Backend

A Node.js/Express backend API for managing products, categories, and materials with MongoDB.

## Features

- RESTful API endpoints
- MongoDB integration
- Input validation
- SKU uniqueness validation
- Statistical aggregation
- Pagination and filtering

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd product-management-backend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration.

## API Endpoints

### Products
- `GET /api/products` - List all products (with pagination)
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `GET /api/products/statistics` - Get product statistics

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create a new category

### Materials
- `GET /api/materials` - List all materials
- `POST /api/materials` - Create a new material

## Project Structure

```
src/
  ├── models/           # MongoDB models
  ├── routes/           # API routes
  ├── validations/      # Input validation schemas
  ├── middleware/       # Custom middleware
  └── index.js         # Application entry point
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/product_management |
| NODE_ENV | Environment mode | development |

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 409: Conflict (e.g., duplicate SKU)
- 500: Server Error

## Data Models

### Product
```javascript
{
  SKU: String,
  product_name: String,
  category_id: ObjectId,
  material_ids: [ObjectId],
  price: Number,
  status: String,
  media_url: String
}
```

### Category
```javascript
{
  category_name: String
}
```

### Material
```javascript
{
  material_name: String
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
