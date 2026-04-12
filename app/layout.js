import "./globals.css";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "Buyukgumus",
  description: "Personal portfolio and blog of Mehmet Buyukgumus",
  icons: {
    icon: "/assets/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          <div className="mainWrapper">
            <Sidebar />
            <main className="mainContent">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
