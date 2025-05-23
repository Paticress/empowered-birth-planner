
export function WhoRecommendations() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-maternal-800 mt-8 mb-4">Direitos Recomendados pela OMS</h2>
      
      <p className="mb-4">
        Além dos direitos garantidos por lei, a Organização Mundial da Saúde (OMS) 
        recomenda diversas práticas que devem ser respeitadas durante o parto:
      </p>
      
      <ul className="list-disc pl-5 space-y-2 mb-6">
        <li>Liberdade de posição e movimento durante o trabalho de parto</li>
        <li>Métodos não farmacológicos de alívio da dor</li>
        <li>Contato pele a pele imediato entre mãe e bebê</li>
        <li>Clampeamento tardio do cordão umbilical</li>
        <li>Amamentação na primeira hora de vida</li>
        <li>Não separação da mãe e do bebê</li>
        <li>Respeito à privacidade e dignidade</li>
      </ul>
      
      <div className="bg-maternal-100 p-4 rounded-lg border-l-4 border-maternal-600 mb-6">
        <p className="font-medium text-maternal-900">
          Importante: Mesmo durante emergências ou procedimentos não planejados, você continua
          tendo o direito a informações claras, respeito e dignidade. Você nunca perde o direito
          de participar das decisões sobre seu corpo e seu bebê.
        </p>
      </div>
    </>
  );
}
