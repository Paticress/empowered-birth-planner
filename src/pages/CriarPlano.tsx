
import { BirthPlanBuilder } from "@/components/BirthPlan/BirthPlanBuilder";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export function CriarPlano() {
  return (
    <div className="min-h-screen flex flex-col bg-maternal-100">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <BirthPlanBuilder />
        </div>
      </main>
      <Footer />
    </div>
  );
}
