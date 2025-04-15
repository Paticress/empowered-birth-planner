
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';
import { BookOpen, FileText, Check, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export function Home() {
  const { navigateTo } = useNavigation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Hero Section */}
      <main className="flex-grow pt-24">
        <section className="bg-gradient-to-b from-maternal-50 to-white py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-maternal-900 mb-6">
                Plano de Parto Personalizado
              </h1>
              <p className="text-lg md:text-xl text-maternal-800 max-w-3xl mx-auto">
                Bem-vinda à plataforma de criação do seu plano de parto personalizado. 
                Aqui você poderá criar, editar e compartilhar seu plano de parto.
              </p>
            </div>
            
            {/* Product Cards */}
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              {/* Guide Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-maternal-100 hover:shadow-xl transition-shadow duration-300">
                <div className="bg-purple-50 p-6">
                  <div className="flex items-center mb-4">
                    <BookOpen className="h-8 w-8 text-purple-600 mr-3" />
                    <h2 className="text-2xl font-bold text-maternal-900">Guia do Parto Respeitoso</h2>
                  </div>
                  <p className="text-maternal-700 mb-4">
                    Um guia completo sobre gestação e parto respeitoso, com informações essenciais para sua jornada.
                  </p>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-maternal-800 mb-4">Benefícios Inclusos:</h3>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-maternal-700">Informações baseadas em evidências científicas</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-maternal-700">Entenda seus direitos durante o parto</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-maternal-700">Conheça procedimentos e intervenções</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-maternal-700">Recursos complementares para download</span>
                    </li>
                  </ul>
                  
                  <Button 
                    onClick={() => navigateTo('/guia-online')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Acessar Guia Online
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </div>
              
              {/* Birth Plan Builder Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-pink-100 hover:shadow-xl transition-shadow duration-300">
                <div className="bg-pink-50 p-6">
                  <div className="flex items-center mb-4">
                    <FileText className="h-8 w-8 text-pink-700 mr-3" />
                    <h2 className="text-2xl font-bold text-maternal-900">Construtor de Plano de Parto</h2>
                  </div>
                  <p className="text-maternal-700 mb-4">
                    Crie seu plano de parto personalizado de forma simples e rápida, com um passo a passo intuitivo.
                  </p>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-maternal-800 mb-4">Benefícios Inclusos:</h3>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-pink-700 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-maternal-700">Questionário guiado personalizado</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-pink-700 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-maternal-700">Edição facilitada de todas as seções</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-pink-700 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-maternal-700">Documento compartilhável em PDF e Word</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-pink-700 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-maternal-700">Salve e edite seu plano a qualquer momento</span>
                    </li>
                  </ul>
                  
                  <Button 
                    onClick={() => navigateTo('/criar-plano')}
                    variant="birth-plan-builder"
                    className="w-full"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Criar Meu Plano de Parto
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 bg-maternal-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold text-maternal-900 mb-10 text-center">
              O que dizem nossas usuárias
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-maternal-700 mb-4 italic">
                  "O construtor de plano de parto me ajudou muito a organizar minhas ideias e desejos para o nascimento do meu bebê. É uma ferramenta intuitiva e completa!"
                </p>
                <p className="text-maternal-900 font-semibold">Mariana S.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-maternal-700 mb-4 italic">
                  "O guia online foi fundamental para entender melhor meus direitos e as possibilidades durante o parto. Recomendo para todas as gestantes!"
                </p>
                <p className="text-maternal-900 font-semibold">Carla L.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-maternal-700 mb-4 italic">
                  "Graças ao plano de parto que criei nesta plataforma, consegui ter uma experiência de parto muito mais respeitosa e alinhada com meus desejos."
                </p>
                <p className="text-maternal-900 font-semibold">Juliana M.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
