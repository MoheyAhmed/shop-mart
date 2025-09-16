# ShopMart - E-commerce Website

A modern, responsive e-commerce website built with Next.js, React, and Tailwind CSS. This project replicates the functionality and design of a professional online shopping platform.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with smooth animations
- **Product Catalog**: Browse products with filtering, sorting, and search
- **Shopping Cart**: Add/remove items, update quantities, and view totals
- **Product Details**: Detailed product pages with image galleries
- **Categories**: Organized product categories with dedicated pages
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **API Integration**: Uses DummyJSON API for product data
- **State Management**: Context API for cart state management
- **Loading States**: Skeleton loaders and loading spinners

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **API**: DummyJSON (https://dummyjson.com/)
- **Icons**: Heroicons (SVG)
- **Images**: Next.js Image component with optimization

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── cart/              # Shopping cart page
│   ├── categories/        # Product categories page
│   ├── products/          # Products listing and details
│   │   └── [id]/         # Dynamic product detail pages
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Home page
├── components/            # Reusable components
│   ├── Header.js          # Navigation header
│   ├── Footer.js          # Site footer
│   ├── ProductCard.js     # Product card component
│   └── LoadingSpinner.js  # Loading component
└── context/               # React Context
    └── CartContext.js     # Shopping cart state management
```

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
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Pages & Features

### Home Page (`/`)
- Hero section with call-to-action
- Featured products showcase
- Service highlights (Free shipping, Quality guarantee, 24/7 support)
- Newsletter subscription

### Products Page (`/products`)
- Product grid with filtering and sorting
- Search functionality
- Category filtering
- Pagination
- Responsive grid layout

### Product Details (`/products/[id]`)
- Detailed product information
- Image gallery with thumbnails
- Add to cart functionality
- Quantity selector
- Related products
- Product specifications

### Categories Page (`/categories`)
- Category grid with images
- Product count per category
- Direct links to filtered products

### Shopping Cart (`/cart`)
- Cart items management
- Quantity updates
- Remove items
- Order summary with totals
- Promo code input
- Checkout button

## 🎨 Design Features

- **Responsive Grid**: Adapts to different screen sizes
- **Hover Effects**: Smooth transitions and hover states
- **Loading States**: Skeleton loaders for better UX
- **Image Optimization**: Next.js Image component with lazy loading
- **Custom Scrollbar**: Styled scrollbars for better aesthetics
- **Smooth Scrolling**: Enhanced navigation experience

## 🛒 Shopping Cart Features

- Add/remove products
- Update quantities
- Persistent storage (localStorage)
- Real-time total calculation
- Cart item counter in header
- Clear cart functionality

## 🔧 API Integration

The project uses the DummyJSON API for product data:
- Products: `https://dummyjson.com/products`
- Categories: `https://dummyjson.com/products/categories`
- Single Product: `https://dummyjson.com/products/{id}`

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
- **Grid System**: Responsive product grids
- **Navigation**: Mobile-friendly hamburger menu

## 🚀 Deployment

The project can be deployed to various platforms:

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Netlify
```bash
npm run build
npm run export
# Deploy dist folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🎯 Future Enhancements

- [ ] User authentication and profiles
- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Payment integration (Stripe)
- [ ] Order history
- [ ] Admin dashboard
- [ ] Product search with filters
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] PWA features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [DummyJSON](https://dummyjson.com/) for providing the API
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Next.js](https://nextjs.org/) for the React framework
- [Heroicons](https://heroicons.com/) for the beautiful icons
- [Unsplash](https://unsplash.com/) for the placeholder images

## 📞 Support

If you have any questions or need help, please open an issue in the repository.

---

**Happy Shopping! 🛍️**