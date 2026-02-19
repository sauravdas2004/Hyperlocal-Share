# Hyperlocal Share 🌍

A modern web application that enables users within hyper-local communities to share, borrow, and trade items with each other. Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- **🔍 Hyper-local Search**: Find items within a specific radius using coordinates or GPS
- **🗺️ Interactive Map**: Visual map interface with pins showing available items
- **💬 Real-time Messaging**: Secure in-app chat system for arranging exchanges
- **⭐ Rating System**: Reciprocal rating system to build trust within the community
- **📱 Responsive Design**: Beautiful, modern UI that works on all devices
- **🔐 Secure Authentication**: User registration and login with NextAuth
- **📸 Item Listings**: Create detailed item listings with photos and descriptions

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file with:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_MAPLIBRE_TOKEN="your-maplibre-token"
   ```

3. **Set up the database**:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: NextAuth.js
- **Maps**: MapLibre GL JS
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom gradients and animations

## 📱 Pages

- **Home** (`/`): Search interface with location-based filtering
- **Map** (`/map`): Interactive map view with item pins
- **New Item** (`/items/new`): Create new item listings
- **Item Detail** (`/items/[id]`): View item details and message owner
- **Inbox** (`/inbox`): Chat interface for conversations
- **Login** (`/login`): User authentication
- **Signup** (`/signup`): User registration

## 🎨 Design Features

- **Gradient Backgrounds**: Beautiful color gradients throughout the app
- **Card-based Layout**: Clean, modern card designs
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Icon Integration**: Consistent iconography with Lucide React
- **Smooth Animations**: Hover effects and transitions
- **Modern Typography**: Clean, readable fonts with proper hierarchy

## 🔧 Development

The app uses:
- **App Router**: Next.js 13+ app directory structure
- **Server Components**: For better performance and SEO
- **Client Components**: For interactive features
- **TypeScript**: Full type safety
- **Prisma**: Type-safe database access
- **React Query**: Efficient data fetching and caching

## 📦 Database Schema

- **Users**: Authentication and profile information
- **Items**: Item listings with location and metadata
- **Conversations**: Chat threads between users
- **Messages**: Individual chat messages
- **Ratings**: User ratings and reviews
- **Notifications**: System notifications

## 🌟 Key Features Implemented

✅ User authentication and profiles  
✅ Item creation and management  
✅ Hyper-local search with radius filtering  
✅ Interactive map with item pins  
✅ Real-time messaging system  
✅ Rating and review system  
✅ Responsive, modern UI design  
✅ Location-based services  
✅ Image upload support  

## 🚀 Deployment

Ready for deployment on Vercel, Netlify, or any Node.js hosting platform. Just update the environment variables for production and deploy!

---

Built with ❤️ for building stronger communities through local sharing.