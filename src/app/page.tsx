export const dynamic = 'force-dynamic';

import Hero from '@/components/Hero';
import SectionDivider from '@/components/SectionDivider';
import Portfolio from '@/components/Portfolio';
import FeaturedWork from '@/components/FeaturedWork';
import About from '@/components/About';
import Services from '@/components/Services';
import Booking from '@/components/Booking';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import InstagramFeed from '@/components/InstagramFeed';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main id="home">
      <Hero />
      <SectionDivider />
      <Portfolio />
      <FeaturedWork />
      <About />
      <Services />
      <Booking />
      <Testimonials />
      <FAQ />
      <InstagramFeed />
      <Contact />
      <Footer />
    </main>
  );
}
