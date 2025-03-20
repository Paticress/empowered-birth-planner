
import { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  children: ReactNode;
}

function SectionCard({ title, children }: SectionCardProps) {
  return (
    <div className="bg-white border border-maternal-200 rounded-lg p-4 shadow-sm">
      <h3 className="text-xl font-medium text-maternal-800 mb-2">{title}</h3>
      <p>{children}</p>
    </div>
  );
}

export function EssentialSections() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-maternal-800 mt-8 mb-4">Seções Essenciais</h2>
      
      <div className="space-y-6 mb-8">
        <SectionCard title="1. Dados Pessoais">
          Inclua seu nome completo, o nome do(a) parceiro(a) ou acompanhante, 
          data prevista do parto, médico/obstetra responsável, doula (se houver), 
          hospital/maternidade escolhido.
        </SectionCard>
        
        <SectionCard title="2. Preferências para o Trabalho de Parto">
          Detalhe suas preferências para ambiente (luzes, sons, privacidade), 
          movimentação (liberdade para andar, posições), métodos de alívio da dor, 
          monitoramento fetal, alimentação e hidratação durante o trabalho de parto.
        </SectionCard>
        
        <SectionCard title="3. Preferências para o Parto">
          Especifique posições para o parto, preferências sobre episiotomia, uso de fórceps ou vácuo extrator, 
          clampeamento do cordão, contato pele a pele imediato, amamentação na primeira hora.
        </SectionCard>
        
        <SectionCard title="4. Preferências para o Pós-Parto">
          Inclua preferências sobre exames do recém-nascido, permanência do bebê com a mãe, 
          banho do bebê, amamentação contínua, visitas, alta hospitalar.
        </SectionCard>
        
        <SectionCard title="5. Cesárea (se necessária)">
          Mesmo que você planeje um parto normal, é importante incluir preferências 
          para o caso de uma cesárea ser necessária: anestesia, presença do acompanhante, 
          visualização do nascimento, contato pele a pele.
        </SectionCard>
      </div>
    </>
  );
}
