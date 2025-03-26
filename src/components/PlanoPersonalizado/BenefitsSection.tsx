
import { FeatureCard } from '@/components/FeatureCard';

export function BenefitsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="landing-container">
        <div className="text-center mb-16 section-transition">
          <h2 className="heading-secondary text-maternal-900">Benefícios do Plano Personalizado</h2>
          <p className="subheading max-w-3xl mx-auto">
            Com o Modelo Personalizável de Plano de Parto, você pode definir todos os detalhes do seu parto de forma simples e rápida
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            title="Evite Intervenções Indesejadas"
            description="Comunique claramente suas preferências e evite procedimentos desnecessários durante o parto"
          />
          
          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            title="Mais Segurança"
            description="Tenha mais segurança e tranquilidade sabendo que suas escolhas foram documentadas e comunicadas"
          />
          
          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            }
            title="Defenda Suas Escolhas"
            description="Um documento bem estruturado para defender suas escolhas com respeito e clareza"
          />
        </div>
      </div>
    </section>
  );
}
