
import React from 'react';

export function NextSteps() {
  return (
    <div className="bg-maternal-100 p-6 rounded-lg mb-8">
      <h3 className="text-xl font-semibold text-maternal-800 mb-4">Próximos Passos</h3>
      <ol className="list-decimal pl-5 space-y-2 mb-0">
        <li>Abra o documento Word e personalize-o conforme necessário</li>
        <li>Discuta seu plano com seu parceiro ou acompanhante de parto</li>
        <li>Agende uma consulta com seu médico para discutir o plano</li>
        <li>Faça as alterações recomendadas pelo seu médico, se necessário</li>
        <li>Imprima várias cópias para levar ao hospital/maternidade</li>
        <li>Coloque uma cópia na sua bolsa de maternidade</li>
      </ol>
    </div>
  );
}
