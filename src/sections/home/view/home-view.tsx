'use client';

import { HomeCTA } from '../home-cta';
import { HomeHero } from '../home-hero';
import { HomeCategories } from '../home-categories';
import { HomeComboDeals } from '../home-combo-deals';
import { HomeTopProducts } from '../home-top-products';
import { HomeTestimonials } from '../home-testimonials';
import { HomeSpecialOffer } from '../home-special-offer';
import { HomeHotDealToday } from '../home-hot-deal-today';
import { HomeFeaturedBrands } from '../home-featured-brands';
import { HomePopularProducts } from '../home-popular-products';
import { HomeFeaturedProducts } from '../home-featured-products';

// ----------------------------------------------------------------------

export function HomeView() {
  return (
    <>
      <HomeHero />
      <HomeCategories />
      <HomeComboDeals />
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
