import Footer from "@/components/Footer";
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Zindum Hotels",
  description: "Hotel Booking and Reservation",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Main content grows as needed */}
    
        
        
        <main className="flex-grow">
          <Providers>     

          {children}

          </Providers>
        </main>

        {/* Footer sits naturally at the bottom if content is short */}
        <Footer />
      </body>
    </html>
  );
}