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

export const metadata = {
  title: "Vehems Study Loft",
  description: "notes made easy !!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${customFont.variable} ${adventPro.variable} ${blatantBold.variable} ${jost.variable} ${libreBodoni.variable} ${literata.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
