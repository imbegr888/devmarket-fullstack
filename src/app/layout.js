import './globals.css';

export const metadata = {
  title: 'DevMarket / Nodera',
  description: 'Fullstack portfolio marketplace',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="bg-gray-950 text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
