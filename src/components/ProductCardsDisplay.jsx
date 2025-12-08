import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const ProductCardsDisplay = ({ cards }) => {
  const [loadedImages, setLoadedImages] = useState({});
  const [failedImages, setFailedImages] = useState({});
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  if (!cards || !Array.isArray(cards.cards) || cards.cards.length === 0) {
    return null;
  }

  // Limit to max 3 most relevant products
  const products = cards.cards.slice(0, 3);

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  const handleImageError = (index) => {
    setFailedImages(prev => ({ ...prev, [index]: true }));
  };

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="product-cards-container mt-4 w-full max-w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {products.length === cards.total
            ? `Showing ${products.length} ${products.length === 1 ? 'Product' : 'Products'}`
            : `Showing ${products.length} of ${cards.total} Products`
          }
        </h3>
      </div>

      {/* Embla Carousel */}
      <div className="embla-container" style={{ position: 'relative', paddingLeft: '40px', paddingRight: '40px' }}>
        {/* Previous Button */}
        {canScrollPrev && (
          <button
            onClick={scrollPrev}
            className="embla__prev"
            aria-label="Previous"
            style={{
              position: 'absolute',
              left: '0',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              minWidth: '32px',
              minHeight: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              transition: 'all 0.2s',
              padding: 0,
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}

        {/* Next Button */}
        {canScrollNext && (
          <button
            onClick={scrollNext}
            className="embla__next"
            aria-label="Next"
            style={{
              position: 'absolute',
              right: '0',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              minWidth: '32px',
              minHeight: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              transition: 'all 0.2s',
              padding: 0,
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}

        <div className="embla" ref={emblaRef} style={{ overflow: 'hidden' }}>
          <div className="embla__container" style={{ display: 'flex', gap: '1rem' }}>
            {products.map((product, index) => (
              <div
                key={index}
                className="embla__slide"
                style={{
                  flex: '0 0 calc(66.666% - 0.667rem)',
                  minWidth: 0,
                }}
              >
                <div className="product-card bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 group" style={{ height: '100%' }}>
                  {/* Product Image */}
                  <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    {!loadedImages[index] && !failedImages[index] && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-pulse flex flex-col items-center gap-2">
                          <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Loading...</div>
                        </div>
                      </div>
                    )}

                    {failedImages[index] ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-700">
                        <svg
                          className="w-16 h-16 text-gray-400 dark:text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Image unavailable</p>
                      </div>
                    ) : (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain p-2 transition-all duration-300 group-hover:scale-105"
                        style={{
                          opacity: loadedImages[index] ? 1 : 0,
                        }}
                        onLoad={() => handleImageLoad(index)}
                        onError={() => handleImageError(index)}
                        loading="lazy"
                      />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Product Title */}
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.5rem',
                    }}>
                      {product.title}
                    </h4>

                    {/* Price */}
                    {product.price && (
                      <div className="mb-3">
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {product.price}
                        </p>
                      </div>
                    )}

                    {/* Available Sizes */}
                    {product.available_sizes && product.available_sizes.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Available Sizes:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.available_sizes.slice(0, 5).map((size, sizeIdx) => (
                            <span
                              key={sizeIdx}
                              className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                            >
                              {size}
                            </span>
                          ))}
                          {product.available_sizes.length > 5 && (
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                              +{product.available_sizes.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style jsx>{`
        .product-cards-container {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .embla {
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default ProductCardsDisplay;
