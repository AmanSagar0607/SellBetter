'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import ProductCardItem from '@/app/_components/ProductCardItem';
import { Button } from '@/components/ui/button';
import { Package, Loader2, Filter, X } from 'lucide-react';
import { Search, ArrowDownUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

function StorePage() {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  // Memoized constants
  const categories = useMemo(() => [
    'UI kits',
    'Source Code',
    'Design kits',
    'UI Design',
    'Mockups',
    'Icons',
    'Fonts',
    'Illustrations',
    'Logos',
    'Templates',
    'Components',
    'Themes',
    'Plugins',
    'Documents',
    'Other'
  ], []);

  const priceRanges = useMemo(() => [
    { label: 'Under $10', min: 0, max: 10 },
    { label: '$10 - $50', min: 10, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: 'Over $100', min: 100, max: Infinity }
  ], []);

  // Memoized price range calculation
  const getPriceRange = useCallback((price) => {
    return priceRanges.find(range => price >= range.min && price <= range.max)?.label;
  }, [priceRanges]);

  const GetProductList = useCallback(async (loadMore = false, currentPage = 1) => {
    try {
      setError(null);
      setLoadingMore(loadMore);
      if (!loadMore) {
        setIsFiltering(true);
      }
      
      const response = await axios.get(`/api/all-products?limit=8&page=${currentPage}${
        searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''
      }${
        activeFilters.length ? `&categories=${encodeURIComponent(activeFilters.join(','))}` : ''
      }${
        sortBy ? `&sort=${encodeURIComponent(sortBy)}` : ''
      }`);
      
      const { products, pagination } = response.data;
      
      if (!products) {
        throw new Error('Invalid response format');
      }

      setProductList(prev => {
        if (loadMore) {
          // Remove duplicates using Set
          const existingIds = new Set(prev.map(p => p.id));
          const newProducts = products.filter(p => !existingIds.has(p.id));
          return [...prev, ...newProducts];
        }
        return products;
      });
      
      setTotalProducts(pagination.total);
      setHasMore(pagination.hasMore);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.response?.data?.error || error.message);
      if (!loadMore) {
        setProductList([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setIsFiltering(false);
    }
  }, [searchQuery, activeFilters, sortBy]);

  // Handle load more
  const handleLoadMore = useCallback(async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await GetProductList(true, nextPage);
  }, [page, GetProductList]);

  // Initial load
  useEffect(() => {
    GetProductList(false, 1);
  }, []); // Only run on mount

  // Debounced search and filter effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPage(1);
      GetProductList(false, 1);
    }, 100);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, activeFilters, sortBy, GetProductList]);

  // Memoized filtered and sorted products calculation
  const filteredProducts = useMemo(() => {
    let results = [...productList];
    
    // Client-side sorting for immediate feedback
    if (sortBy) {
      results.sort((a, b) => {
        switch (sortBy) {
          case 'price_low_high':
            return a.price - b.price;
          case 'price_high_low':
            return b.price - a.price;
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'popular':
            return (b.rating || 0) - (a.rating || 0);
          default:
            return 0;
        }
      });
    }
    
    return results;
  }, [productList, sortBy]);

  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Immediate UI feedback
    if (!value) {
      setIsFiltering(false);
    }
  }, []);

  const handleFilter = useCallback((filter) => {
    setActiveFilters(prev => {
      const newFilters = prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter];
      return newFilters;
    });
  }, []);

  const handleSort = useCallback((sortOption) => {
    setSortBy(sortOption);
    // Apply client-side sorting immediately
    setProductList(prev => {
      const sorted = [...prev].sort((a, b) => {
        switch (sortOption) {
          case 'price_low_high':
            return a.price - b.price;
          case 'price_high_low':
            return b.price - a.price;
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'popular':
            return (b.rating || 0) - (a.rating || 0);
          default:
            return 0;
        }
      });
      return sorted;
    });
    setPage(1);
    GetProductList(false, 1);
  }, [GetProductList]);


  return (
    <div className='bg-black px-4 sm:px-8 md:px-32 lg:px-36 py-12 min-h-screen'>
      <div className="flex flex-col mb-12">
      <div className="space-y-2">
      <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text tracking-tight">Store</h2>
        <p className="text-gray-400 text-lg"> Explore our curated collection of high-quality digital products </p>
      </div>
      </div>
      <div className="mb-8">
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col sm:flex-row items-start justify-between gap-4'>
            {/* Search Input and Results Count */}
            <div className="flex flex-col gap-2 w-full lg:max-w-xl">
              <div className="relative">
                {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div> */}
                <Input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 border border-pink-500/20 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500/30 transition-all" 
                />
              </div>
              {totalProducts > 0 && (
                <p className="text-white/60 text-sm">
                  Showing {filteredProducts.length} of {totalProducts} products
                </p>
              )}
            </div>

            {/* Filter and Sort Buttons */}
            <div className="flex items-center gap-3 sm:self-start">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button className="min-w-[120px] border border-pink-500/20 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 hover:text-pink-500 transition-all backdrop-blur-sm">
                    <Filter className="w-4 h-4 mr-2" /> Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="bg-gray-900/95 backdrop-blur-md border border-pink-500/20 text-white w-64 rounded-lg shadow-lg shadow-pink-500/10"
                  onWheel={(e) => e.stopPropagation()}
                  sideOffset={5}
                >
                  <div className="p-3 font-semibold text-pink-400 border-b border-pink-500/20">Categories</div>
                  <ScrollArea 
                    className="h-[200px] px-1" 
                    style={{
                      '--scrollbar-thumb': 'rgba(31, 31, 31, 0.7)',
                      '--scrollbar-track': 'transparent',
                      '--scrollbar-width': '4px'
                    }}
                  >
                    <div className="pr-2" onWheel={(e) => e.stopPropagation()}>
                      {categories.map(category => (
                        <DropdownMenuItem
                          key={category}
                          className={`flex items-center justify-between px-4 py-2.5 ${
                            activeFilters.includes(category) ? 'text-pink-400 bg-pink-500/10' : 'text-gray-300'
                          } hover:text-pink-400 hover:bg-pink-500/5 cursor-pointer transition-all`}
                          onClick={() => handleFilter(category)}
                        >
                          {category}
                          {activeFilters.includes(category) && <X className="w-4 h-4" />}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-3 font-semibold text-pink-400 border-t border-b border-pink-500/20">Price Range</div>
                  <ScrollArea 
                    className="h-[200px] px-1" 
                    style={{
                      '--scrollbar-thumb': 'rgba(31, 31, 31, 0.7)',
                      '--scrollbar-track': 'transparent',
                      '--scrollbar-width': '4px'
                    }}
                  >
                    <div className="pr-2" onWheel={(e) => e.stopPropagation()}>
                      {priceRanges.map(range => (
                        <DropdownMenuItem
                          key={range.label}
                          className={`flex items-center justify-between px-4 py-2.5 ${
                            activeFilters.includes(range.label) ? 'text-pink-400 bg-pink-500/10' : 'text-gray-300'
                          } hover:text-pink-400 hover:bg-pink-500/5 cursor-pointer transition-all`}
                          onClick={() => handleFilter(range.label)}
                        >
                          {range.label}
                          {activeFilters.includes(range.label) && <X className="w-4 h-4" />}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button className="min-w-[120px] border border-pink-500/20 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 hover:text-pink-500 transition-all backdrop-blur-sm">
                    <ArrowDownUp className="w-4 h-4 mr-2" /> Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="bg-gray-900/95 backdrop-blur-md border border-pink-500/20 w-64 rounded-lg shadow-lg shadow-pink-500/10"
                  sideOffset={5}
                >
                  {[
                    { value: 'price_low_high', label: 'Price: Low to High' },
                    { value: 'price_high_low', label: 'Price: High to Low' },
                    { value: 'newest', label: 'Newest First' },
                    { value: 'popular', label: 'Most Popular' }
                  ].map(option => (
                    <DropdownMenuItem
                      key={option.value}
                      className={`px-4 py-2.5 ${
                        sortBy === option.value ? 'text-pink-400 bg-pink-500/10' : 'text-gray-300'
                      } hover:text-pink-400 hover:bg-pink-500/5 cursor-pointer transition-all`}
                      onClick={() => handleSort(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {activeFilters.map(filter => (
                <div
                  key={filter}
                  className="flex items-center gap-1.5 bg-pink-500/10 text-pink-400 px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm hover:bg-pink-500/15 transition-all"
                >
                  {filter}
                  <button
                    onClick={() => handleFilter(filter)}
                    className="hover:text-pink-300 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setActiveFilters([])}
                className="text-gray-400 hover:text-pink-400 text-sm font-medium transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative max-w-[1400px] mx-auto">
        {/* Glow Effect */}
        <div className="absolute -inset-x-4 -inset-y-4 z-0 bg-gradient-to-r from-transparent via-pink-500/10 to-transparent blur-3xl opacity-50 pointer-events-none" />
        
        {loading && filteredProducts.length === 0 ? (
          <>
            {[1,2,3,4,5,6].map((_, index) => (
              <div key={index} className="relative z-10 bg-gray-800/40 rounded-xl p-4 overflow-hidden">
                <div className="animate-pulse space-y-4">
                  <div className="h-40 bg-gray-700 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer" />
                  </div>
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-700 rounded w-1/4" />
                    <div className="h-4 bg-gray-700 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : error ? (
          <div className="col-span-full text-center py-10">
            <Package className="w-16 h-16 mx-auto text-pink-500/50 mb-4" />
            <p className="text-white/60">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <Package className="w-16 h-16 mx-auto text-pink-500/50 mb-4" />
            <p className="text-white/60">No products found</p>
          </div>
        ) : (
          <>
            {filteredProducts.map((product, index) => (
              <div 
                key={`${product.id}-${index}`} 
                className={`relative z-10 transition-opacity duration-300 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}
              >
                <ProductCardItem product={product} />
              </div>
            ))}
          </>
        )}
      </div>

      {/* Load More Button */}
      {hasMore && !loading && !error && filteredProducts.length > 0 && (
        <div className="flex justify-center mt-12">
          <Button 
            onClick={handleLoadMore}
            disabled={loadingMore}
            variant="outline"
            size="lg"
            className="group border-pink-500/20 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 hover:text-pink-500 transition-all"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Products'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default StorePage;