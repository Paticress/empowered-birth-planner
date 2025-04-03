
import { LoginPage } from "@/components/BirthPlan/LoginPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@/hooks/useNavigation";
import { useEffect } from "react";

export function AcessoPlano() {
  const { user } = useAuth();
  const { navigateTo } = useNavigation();
  
  // If user is already authenticated, redirect to birth plan builder
  useEffect(() => {
    if (user) {
      console.log("User already authenticated, redirecting to birth plan builder");
      navigateTo('/criar-plano');
    }
  }, [user, navigateTo]);

  return (
    <div className="min-h-screen flex flex-col bg-maternal-50">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <LoginPage />
        </div>
      </main>
      <Footer />
    </div>
  );
}
