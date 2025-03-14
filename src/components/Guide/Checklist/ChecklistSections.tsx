
import { ChecklistSection } from './ChecklistSection';
import { ChecklistItem } from './ChecklistItem';

export function ChecklistSections() {
  return (
    <div className="space-y-6 mb-8">
      <ChecklistSection title="Aspectos Gerais">
        <ChecklistItem label="Incluí meus dados pessoais completos (nome, data prevista do parto, etc.)" />
        <ChecklistItem label="Identifiquei claramente quem será meu acompanhante" />
        <ChecklistItem label="Defini se terei doula e incluí seus dados de contato" />
        <ChecklistItem label="Organizei o plano em seções claras e objetivas" />
      </ChecklistSection>
      
      <ChecklistSection title="Trabalho de Parto">
        <ChecklistItem label="Especifiquei preferências sobre ambiente (luz, som, privacidade)" />
        <ChecklistItem label="Indiquei preferências sobre liberdade de movimentação" />
        <ChecklistItem label="Defini opções para alívio da dor (métodos não-farmacológicos e/ou analgesia)" />
        <ChecklistItem label="Estabeleci preferências sobre alimentação e hidratação" />
        <ChecklistItem label="Especifiquei como quero que seja feito o monitoramento fetal" />
      </ChecklistSection>
      
      <ChecklistSection title="Parto">
        <ChecklistItem label="Indiquei posições preferidas para o parto" />
        <ChecklistItem label="Estabeleci preferências sobre episiotomia" />
        <ChecklistItem label="Defini preferências sobre uso de fórceps ou vácuo extrator" />
        <ChecklistItem label="Estabeleci como quero que seja feito o clampeamento do cordão" />
        <ChecklistItem label="Especifiquei preferências sobre contato pele a pele imediato" />
      </ChecklistSection>
      
      <ChecklistSection title="Pós-Parto">
        <ChecklistItem label="Estabeleci preferências sobre os exames do recém-nascido" />
        <ChecklistItem label="Indiquei preferências sobre amamentação na primeira hora" />
        <ChecklistItem label="Defini se quero que o bebê permaneça comigo o tempo todo" />
        <ChecklistItem label="Estabeleci quando e como deve ser feito o primeiro banho do bebê" />
        <ChecklistItem label="Especifiquei preferências sobre visitas no pós-parto" />
      </ChecklistSection>
      
      <ChecklistSection title="Cesárea (se necessária)">
        <ChecklistItem label="Indiquei preferências sobre o tipo de anestesia" />
        <ChecklistItem label="Estabeleci a presença do acompanhante durante a cesárea" />
        <ChecklistItem label="Defini se quero visualizar o nascimento (ex. abaixando o campo cirúrgico)" />
        <ChecklistItem label="Especifiquei preferências sobre contato pele a pele na cesárea" />
      </ChecklistSection>
    </div>
  );
}
