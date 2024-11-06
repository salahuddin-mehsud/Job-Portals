
import AuthProvider from "@/components/admin-panel/AuthProvider";
import "./globals.css";
import App from "./App";
import { Toaster } from "react-hot-toast";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider><App>{children}</App></AuthProvider>
       <Toaster position="bottom-center" reverseOrder={false} />
      </body>
    </html>
  );
}
