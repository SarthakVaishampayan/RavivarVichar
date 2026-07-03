import Navbar from './Navbar';
import Footer from './Footer';

export default function PageLayout({ children, className = '' }) {
  return (
    <>
      <Navbar />
      <main className={`pt-[90px] ${className}`}>
        {children}
      </main>
      <Footer />
    </>
  );
}
