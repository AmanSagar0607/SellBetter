"use client";
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import { CartContext } from '../../../_context/CartContext';
import { toast } from 'sonner';
import { ChevronDown, ArrowLeft, ShoppingCart, Heart, Sparkles, PlusCircleIcon, Loader2 } from 'lucide-react';

/**
 * A toggleable accordion component.
 * @param {string} title - The title displayed at the top of the accordion.
 * @param {React.ReactNode} content - The content displayed when the accordion is open.
 * @param {boolean} isOpen - Whether or not the accordion is open.
 * @param {function} onClick - The function called when the accordion is clicked.
 * @returns {React.ReactElement} A toggleable accordion component.
 */
function Accordion({ title, content, isOpen, onClick }) {
  return (
    <div className=" rounded-xl overflow-hidden border border-gray-800 hover:border-pink-500/30 transition-all">
      <button
        className="w-full px-6 py-3 flex justify-between items-center text-left"
        onClick={onClick}
      >
        <h2 className="text-xl font-semibold text-pink-500">{title}</h2>
        <ChevronDown
          className={`w-5 h-5 text-pink-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 animate-fadeIn">
          {content}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }) {
  const router = useRouter();
  const price = parseFloat(product.price) || 0;
  const originalPrice = parseFloat(product.originalPrice || product.original_price) || price;
  const discount = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => router.push(`/store/${product.id}`)}
      className="border border-gray-800 rounded-xl p-4 hover:border-pink-500/30 transition-all group bg-black/50 backdrop-blur-sm cursor-pointer"
    >
      <div className="flex flex-col space-y-4">
        {/* Product Image - Fixed 400x400 */}
        <div className="w-full h-[300px] rounded-xl overflow-hidden bg-black/40 border border-gray-800">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
            />
            {discount > 0 && (
              <div className="absolute top-4 right-4">
                <span className="bg-pink-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                  -{discount}% OFF
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white group-hover:text-pink-500 transition-colors line-clamp-1">
            {product.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-lg font-bold text-pink-500">${price}</span>
              {originalPrice > price && (
                <span className="text-sm text-gray-400 line-through block">
                  ${originalPrice}
                </span>
              )}
            </div>
            <span className="text-sm text-pink-500/70 bg-pink-500/10 px-3 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  const router = useRouter();
  const [hasSimilarProducts, setHasSimilarProducts] = useState(false);

  return (
    <div className="bg-black min-h-screen px-4 sm:px-8 md:px-32 lg:px-36 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/store')}
          className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Store
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Image Skeleton */}
          <div className="w-full h-[300px] sm:h-[400px] rounded-xl bg-gray-800/50 animate-pulse" />

          {/* Details Skeleton */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="h-8 bg-gray-800/50 rounded-lg w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-800/50 rounded-lg w-1/2 animate-pulse" />
              <div className="h-4 bg-gray-800/50 rounded-full w-24 animate-pulse" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 h-12 bg-gray-800/50 rounded-xl animate-pulse" />
              <div className="flex-1 h-12 bg-gray-800/50 rounded-xl animate-pulse" />
            </div>

            <div className="space-y-4">
              <div className="h-14 bg-gray-800/50 rounded-xl animate-pulse" />
              <div className="h-14 bg-gray-800/50 rounded-xl animate-pulse" />
            </div>

            <div className="flex items-center gap-4 mt-6">
              <div className="w-10 h-10 rounded-full bg-gray-800/50 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-800/50 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-800/50 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {hasSimilarProducts && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-white">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-pink-500/30 transition-all">
                  <div className="relative w-full aspect-square bg-gray-800/50 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-800/50 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-800/50 rounded w-1/2 animate-pulse" />
                    <div className="h-8 bg-gray-800/50 rounded-lg w-full animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-white">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-pink-500/30 transition-all">
                <div className="relative w-full aspect-square bg-gray-800/50 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-800/50 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-800/50 rounded w-1/2 animate-pulse" />
                  <div className="h-8 bg-gray-800/50 rounded-lg w-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const SimilarProductsSkeleton = () => (
    <div className="mt-16">
        <div className="h-8 w-48 bg-white/5 rounded-lg mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
                    <div className="relative w-full aspect-square bg-white/5"></div>
                    <div className="p-4 space-y-3">
                        <div className="h-4 bg-white/5 rounded w-3/4"></div>
                        <div className="h-6 bg-white/5 rounded w-1/4"></div>
                        <div className="h-8 bg-white/5 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

function ProductDetail() {
  const { productId } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {cart, setCart} = useContext(CartContext);
  const [isAddToCartLoading, setIsAddToCartLoading] = useState(false);
  const { user } = useUser();
  const { isSignedIn } = useAuth();

  const handleAddToCart = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    if (isAddToCartLoading) return;

    setIsAddToCartLoading(true);
    try {
      const response = await axios.post('/api/cart', {
        userId: user.id,
        productId: productId
      });

      if (response.data?.success) {
        setCart(prev => [...prev, response.data.data]);
        toast.success("Added to cart");
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAddToCartLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/all-products?id=${productId}`);
        const productsData = response.data.products;
        const productData = productsData.find(p => p.id === parseInt(productId));
        setProduct(productData);

        if (productData) {
          // Get similar products (same category)
          const similar = productsData.filter(p =>
            p.category === productData.category &&
            p.id !== parseInt(productId)
          );

          // Get other products (different category)
          const other = productsData.filter(p => 
            p.id !== parseInt(productId) && 
            p.category !== productData.category
          );

          // Combine all products and limit to 8
          const allRelated = [...similar, ...other].slice(0, 8);
          setRelatedProducts(allRelated);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  if (!product && !isLoading) {
    return <div>Product not found</div>;
  }

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (isLoading) {
    return <ProductSkeleton />;
  }

  return (
    <div className="bg-black min-h-screen px-4 sm:px-8 md:px-32 lg:px-36 py-12">

      <div className="max-w-7xl mx-auto ">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center space-x-2 text-gray-300 hover:text-pink-500 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Store</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Product Image - Fixed size and centered */}
          <div className="flex justify-center items-start">
            <div className="w-full h-[300px] sm:h-[400px] rounded-xl overflow-hidden bg-black/40 border border-gray-800 relative">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover p-4 hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-0 left-2 p-4 flex justify-between items-start z-10">
                {discount > 0 && (
                  <div className="bg-pink-500/10 text-pink-400 px-2.5 py-1 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {discount}% OFF
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add favorite logic here
                  }}
                  className={`p-2 rounded-full backdrop-blur-sm bg-black/20 text-gray-300 hover:text-pink-500 transition-all`}
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Details - Enhanced layout */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{product.title}</h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-bold text-pink-500">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm sm:text-base text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                <span className="inline-block bg-pink-500/10 text-pink-400 rounded-full px-3 py-1 text-sm font-medium">
                  {product.category}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
        <button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <ShoppingCart className="w-4 h-4" />
          <span className="font-medium">Buy Now</span>
        </button>
        <button 
          onClick={handleAddToCart}
          disabled={isAddToCartLoading}
          className="bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 hover:text-pink-500 border border-pink-500/20 transition-all flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium"
        >
          <PlusCircleIcon className="w-4 h-4" />
          <span className="font-medium">Add to Cart</span>
        </button>
      </div>

            {/* Accordions */}
            <div className="space-y-4">
              <Accordion
                title="Description"
                content={
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300">
                      {product.description}
                    </p>
                  </div>
                }
                isOpen={openAccordion === 'description'}
                onClick={() => setOpenAccordion(openAccordion === 'description' ? null : 'description')}
              />
              
              <Accordion
                title="About this item"
                content={
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-gray-300">Category: <span className="text-white">{product.category}</span></span>
                      <span className="text-gray-300">Price: <span className="text-white">${product.price}</span></span>
                      {product.originalPrice && (
                        <span className="text-gray-300">Original Price: <span className="text-white line-through">${product.originalPrice}</span></span>
                      )}
                      {discount > 0 && (
                        <span className="text-gray-300">Discount: <span className="text-pink-500">{discount}% OFF</span></span>
                      )}
                    </div>
                  </div>
                }
                isOpen={openAccordion === 'about'}
                onClick={() => setOpenAccordion(openAccordion === 'about' ? null : 'about')}
              />
            </div>

            {/* Posted by section moved below accordions */}
            {product.user && (
              <div className="flex items-center gap-4 bg-black/40 backdrop-blur-sm rounded-xl mt-6">
                <img
                  src={product.user.image || '/default-avatar.png'}
                  alt={product.user.name}
                  className="w-10 h-10 rounded-full border-2 border-pink-500/20"
                />
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm">Posted by</span>
                  <span className="text-pink-500 font-medium">{product.user.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {isLoading ? (
          <SimilarProductsSkeleton />
        ) : relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-800 pt-16">
            <h2 className="text-2xl font-bold mb-6 text-white">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  onClick={() => router.push(`/store/${relatedProduct.id}`)}
                  className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-pink-500/30 transition-all cursor-pointer group"
                >
                  <div className="relative w-full aspect-square">
                    <img
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {parseFloat(relatedProduct.originalPrice) > parseFloat(relatedProduct.price) && (
                      <div className="absolute top-3 left-3 bg-pink-500/10 text-pink-400 px-2.5 py-1 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        {Math.round(((parseFloat(relatedProduct.originalPrice) - parseFloat(relatedProduct.price)) / parseFloat(relatedProduct.originalPrice)) * 100)}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-white mb-2 line-clamp-1">{relatedProduct.title}</h3>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-lg font-bold text-pink-500">${relatedProduct.price}</span>
                      {parseFloat(relatedProduct.originalPrice) > parseFloat(relatedProduct.price) && (
                        <span className="text-sm text-gray-400 line-through">${relatedProduct.originalPrice}</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add buy now logic here
                      }}
                      className="w-full bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 hover:text-pink-500 border border-pink-500/20 transition-all flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;