import { 
  customFont, 
  adventPro, 
  blatantBold, 
  jost, 
  libreBodoni, 
  literata 
} from "./fonts";
import "./globals.css";
import { Providers } from './providers';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Vehems Study Loft",
  description: "notes made easy !!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${customFont.variable} ${adventPro.variable} ${blatantBold.variable} ${jost.variable} ${libreBodoni.variable} ${literata.variable} antialiased`}
        style={{ backgroundColor: '#0a0a0a', color: '#ededed' }}
      >
        <Providers>{children}</Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
