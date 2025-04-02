
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface CheckoutSectionProps {
  onGoBack: () => void;
}

export function CheckoutSection({ onGoBack }: CheckoutSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    acceptTerms: false
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, acceptTerms: checked }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.whatsapp || !formData.acceptTerms) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    // Simulate payment processing
    toast.success("Parabéns! Seu acesso foi liberado com sucesso!");
    
    // Reset form and go back
    setFormData({
      name: '',
      email: '',
      whatsapp: '',
      acceptTerms: false
    });
    onGoBack();
  };

  return (
    <section className="py-16 md:py-24 bg-maternal-50">
      <div className="landing-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="form-section animate-fade-in">
            <h2 className="text-2xl font-bold text-maternal-900 mb-6">Complete sua compra</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="rounded-xl border-maternal-200 focus:border-maternal-400 focus:ring-maternal-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="rounded-xl border-maternal-200 focus:border-maternal-400 focus:ring-maternal-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  placeholder="(00) 00000-0000"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className="rounded-xl border-maternal-200 focus:border-maternal-400 focus:ring-maternal-400"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={formData.acceptTerms} 
                  onCheckedChange={handleCheckboxChange}
                  className="text-maternal-600 focus:ring-maternal-400"
                />
                <Label htmlFor="terms" className="text-sm text-maternal-700">
                  Concordo com os termos de uso e política de privacidade
                </Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-maternal-600 hover:bg-maternal-700 text-white rounded-full py-6 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Finalizar Compra
              </Button>
            </form>
          </div>
          
          <div className="animate-fade-in-up">
            <Card className="bg-white border-maternal-100 shadow-md p-6">
              <h3 className="text-xl font-bold text-maternal-900 mb-4">Modelo Personalizado de Plano de Parto</h3>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-maternal-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-maternal-700">Modelo completo em formato editável</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-maternal-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-maternal-700">Checklist para revisar com a equipe médica</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-maternal-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-maternal-700">Guia de comunicação com a equipe médica</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-maternal-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-maternal-700">Acesso vitalício a atualizações</span>
                </li>
              </ul>
              
              <div className="border-t border-maternal-100 pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-maternal-700">Preço:</span>
                  <span className="text-maternal-900 font-bold">R$ 128,00</span>
                </div>
              </div>
              
              <div className="bg-maternal-50 border border-maternal-100 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-maternal-800 mb-2">🎁 BÔNUS EXCLUSIVO</h4>
                <p className="text-maternal-700 text-sm">
                  Checklist completo para revisar seu plano com a equipe médica!
                </p>
              </div>
              
              <div className="bg-maternal-50 border border-maternal-100 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-maternal-800 mb-1">Garantia de satisfação:</h4>
                <p className="text-maternal-700 text-sm">
                  Se você não gostar do material, devolvemos seu dinheiro em até 7 dias.
                </p>
              </div>
            </Card>
            
            <Button 
              variant="outline"
              onClick={onGoBack}
              className="mt-4 w-full border-maternal-300 text-maternal-700"
            >
              Voltar
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
