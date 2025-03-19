
import { ChecklistSection } from './ChecklistSection';
import { ChecklistItem } from './ChecklistItem';
import { ChecklistTip } from './ChecklistTip';

export function ChecklistSections() {
  return (
    <div className="space-y-6 mb-8 print:space-y-4">
      <ChecklistSection title="Aspectos Gerais">
        <ChecklistItem id="general-1" label="Incluí meus dados pessoais completos (nome, data prevista do parto, etc.)" />
        <ChecklistItem id="general-2" label="Identifiquei claramente quem será meu acompanhante" />
        <ChecklistItem id="general-3" label="Defini se terei doula e incluí seus dados de contato" />
        <ChecklistItem id="general-4" label="Organizei o plano em seções claras e objetivas" />
      </ChecklistSection>
      
      <ChecklistSection title="Trabalho de Parto">
        <ChecklistItem id="labor-1" label="Especifiquei preferências sobre ambiente (luz, som, privacidade)" />
        <ChecklistItem id="labor-2" label="Indiquei preferências sobre liberdade de movimentação" />
        <ChecklistItem id="labor-3" label="Defini opções para alívio da dor (métodos não-farmacológicos e/ou analgesia)" />
        <ChecklistItem id="labor-4" label="Estabeleci preferências sobre alimentação e hidratação" />
        <ChecklistItem id="labor-5" label="Especifiquei como quero que seja feito o monitoramento fetal" />
      </ChecklistSection>
      
      <ChecklistSection title="Parto">
        <ChecklistItem id="birth-1" label="Indiquei posições preferidas para o parto" />
        <ChecklistItem id="birth-2" label="Estabeleci preferências sobre episiotomia" />
        <ChecklistItem id="birth-3" label="Defini preferências sobre uso de fórceps ou vácuo extrator" />
        <ChecklistItem id="birth-4" label="Estabeleci como quero que seja feito o clampeamento do cordão" />
        <ChecklistItem id="birth-5" label="Especifiquei preferências sobre contato pele a pele imediato" />
      </ChecklistSection>
      
      <ChecklistSection title="Pós-Parto">
        <ChecklistItem id="postpartum-1" label="Estabeleci preferências sobre os exames do recém-nascido" />
        <ChecklistItem id="postpartum-2" label="Indiquei preferências sobre amamentação na primeira hora" />
        <ChecklistItem id="postpartum-3" label="Defini se quero que o bebê permaneça comigo o tempo todo" />
        <ChecklistItem id="postpartum-4" label="Estabeleci quando e como deve ser feito o primeiro banho do bebê" />
        <ChecklistItem id="postpartum-5" label="Especifiquei preferências sobre visitas no pós-parto" />
      </ChecklistSection>
      
      <ChecklistSection title="Cesárea (se necessária)">
        <ChecklistItem id="csection-1" label="Indiquei preferências sobre o tipo de anestesia" />
        <ChecklistItem id="csection-2" label="Estabeleci a presença do acompanhante durante a cesárea" />
        <ChecklistItem id="csection-3" label="Defini se quero visualizar o nascimento (ex. abaixando o campo cirúrgico)" />
        <ChecklistItem id="csection-4" label="Especifiquei preferências sobre contato pele a pele na cesárea" />
      </ChecklistSection>
      
      <ChecklistSection title="Emergências e Situações Inesperadas">
        <ChecklistTip>
          Embora muitas mulheres vivenciem partos naturais tranquilos, é importante estar preparada para possíveis intercorrências. Compreender essas situações fortalece sua comunicação com a equipe médica.
        </ChecklistTip>
        <ChecklistItem id="emergency-1" label="Defini minhas preferências para situações de emergência obstétrica (hemorragia, sofrimento fetal, etc.)" />
        <ChecklistItem id="emergency-2" label="Estabeleci como quero ser informada sobre situações inesperadas" />
        <ChecklistItem id="emergency-3" label="Especifiquei quem deve tomar decisões caso eu não esteja em condições de fazê-lo" />
        <ChecklistItem id="emergency-4" label="Incluí preferências específicas para caso o bebê precise de cuidados intensivos" />
        <ChecklistItem id="emergency-5" label="Considerei a flexibilidade do plano caso aconteçam intercorrências" />
      </ChecklistSection>
    </div>
  );
}
