import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ContentProvider } from "@/context/ContentContext";
import { Toaster } from "@/components/ui/toast";

export const metadata = {
  title: "Content Broadcasting System",
  description: "Role-based educational content broadcasting frontend"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ContentProvider>
            {children}
            <Toaster />
          </ContentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
