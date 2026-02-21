'use client';

import { HomeCTA } from '../home-cta';
import { HomeHero } from '../home-hero';
import { HomeCategories } from '../home-categories';
import { HomeTestimonials } from '../home-testimonials';
import { HomeHotDealToday } from '../home-hot-deal-today';
import { HomeFeaturedProducts } from '../home-featured-products';
import { HomeSpecialOffer } from '../home-special-offer';
import { HomeFeaturedBrands } from '../home-featured-brands';
import { HomePopularProducts } from '../home-popular-products';
import { HomeTopProducts } from '../home-top-products';

// ----------------------------------------------------------------------

export function HomeView() {
  return (
    <>
      <HomeHero />
      <HomeCategories />
      <HomeHotDealToday />
      <HomeFeaturedProducts />
      <HomeSpecialOffer />
      <HomeFeaturedBrands />
      <HomePopularProducts />
      <HomeTopProducts />
      <HomeTestimonials />
      <HomeCTA />
    </>
  );
}
