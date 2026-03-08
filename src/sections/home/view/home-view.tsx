'use client';

import { HomeCTA } from '../home-cta';
import { HomeHero } from '../home-hero';
import { HomeCategories } from '../home-categories';
import { HomeComboDeals } from '../home-combo-deals';
import { HomeAllProducts } from '../home-all-products';
import { HomeTestimonials } from '../home-testimonials';
import { HomeSpecialOffer } from '../home-special-offer';
import { HomeHotDealToday } from '../home-hot-deal-today';
import { HomeTrustedBrands } from '../home-trusted-brands';

// ----------------------------------------------------------------------

export function HomeView() {
  return (
    <>
      <HomeHero />
      <HomeCategories />
      <HomeAllProducts />
      <HomeComboDeals />
      <HomeHotDealToday />
      <HomeTestimonials />
      <HomeTrustedBrands />
      <HomeCTA />
    </>
  );
}
