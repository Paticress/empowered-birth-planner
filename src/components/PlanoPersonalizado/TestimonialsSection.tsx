
import { Testimonial } from '@/components/Testimonial';

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="landing-container">
        <div className="text-center mb-16 section-transition">
          <h2 className="heading-secondary text-maternal-900">O que as mães estão dizendo</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Testimonial 
            quote="Com o modelo do Energia Materna, finalmente me senti preparada e confiante para o parto. Foi a melhor decisão!"
            name="Ana C."
            role="Mãe do Lucas"
          />
          
          <Testimonial 
            quote="O plano de parto personalizado me ajudou a comunicar minhas preferências de forma clara e objetiva. Minha equipe médica respeitou todas as minhas decisões."
            name="Juliana M."
            role="Mãe da Sofia"
          />
          
          <Testimonial 
            quote="Ter um plano de parto bem organizado me deu segurança para viver esse momento tão especial. Valeu muito a pena!"
            name="Carolina F."
            role="Mãe do Pedro"
          />
        </div>
      </div>
    </section>
  );
}
