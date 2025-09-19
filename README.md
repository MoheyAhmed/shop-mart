# ShopMart - E-commerce Platform

A modern, responsive e-commerce platform built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Product Management**: Browse products, categories, and brands
- **Shopping Cart**: Add, remove, and manage cart items
- **User Authentication**: Login, signup, and user management
- **API Integration**: Real-time data from ecommerce.routemisr.com
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized with Next.js features

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── categories/        # Categories page
│   ├── brands/           # Brands page
│   └── products/         # Products pages
│       ├── page.tsx      # Products listing
│       └── [id]/         # Product detail page
├── components/            # Reusable components
│   ├── Header.tsx        # Navigation header
│   ├── Footer.tsx        # Site footer
│   └── ProductCard.tsx   # Product card component
├── context/              # React Context providers
│   ├── AuthContext.tsx   # Authentication context
│   └── CartContext.tsx   # Shopping cart context
├── config/               # Configuration files
│   └── api.ts           # API configuration and functions
└── types/               # TypeScript type definitions
    └── api.ts           # API response types
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **API**: RESTful API integration
- **Icons**: Heroicons (SVG)
- **Images**: Next.js Image component

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shop-mart
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Pages

### Home Page (`/`)
- Hero section with call-to-action
- Featured products showcase
- Features section
- Newsletter subscription

### Products Page (`/products`)
- Product listing with filters
- Search functionality
- Pagination
- Category and brand filters
- Price range filtering
- Sorting options

### Categories Page (`/categories`)
- Category grid display
- Category images and names
- Direct links to filtered products

### Brands Page (`/brands`)
- Brand grid with logos
- Pagination support
- Brand information

### Product Detail Page (`/products/[id]`)
- Detailed product information
- Image gallery
- Price and discount display
- Add to cart functionality
- Product specifications

## 🔧 API Integration

The application integrates with the ecommerce.routemisr.com API:

- **Categories**: `GET /api/v1/categories`
- **Brands**: `GET /api/v1/brands`
- **Products**: `GET /api/v1/products`
- **Product Detail**: `GET /api/v1/products/{id}`

### API Features

- Real-time data fetching
- Error handling and fallbacks
- Loading states
- Type-safe API responses
- Authentication support

## 🎨 Design Features

- **Responsive Design**: Works on all device sizes
- **Modern UI**: Clean, professional interface
- **Interactive Elements**: Hover effects and transitions
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🔐 Authentication

- User login and registration
- Token-based authentication
- Protected routes
- User context management
- Automatic token validation

## 🛒 Shopping Cart

- Add/remove products
- Quantity management
- Price calculations
- Persistent cart state
- Cart item count display

## 📦 TypeScript

Full TypeScript implementation with:

- Strict type checking
- Interface definitions for all data structures
- Type-safe API calls
- Component prop types
- Context type definitions

## 🚀 Deployment

The application is ready for deployment on:

- Vercel (recommended)
- Netlify
- Any Node.js hosting platform

### Build for Production

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Heroicons](https://heroicons.com/) for the beautiful icons
- [ecommerce.routemisr.com](https://ecommerce.routemisr.com/) for the API data

---

Built with ❤️ using Next.js and TypeScript