
export function PrintTitle() {
  return (
    <div className="hidden print:block mb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">PLANO DE PARTO</h1>
        <img 
          src="/lovable-uploads/6f452e84-0922-495e-bad9-57a66fa763f6.png" 
          alt="Energia Materna" 
          className="h-12 energia-materna-logo"
        />
      </div>
      <p className="text-sm text-gray-700 mt-2 mb-4">
        Este documento reflete minhas preferências para o parto e nascimento do meu bebê. Ele foi elaborado após 
        cuidadosa pesquisa e reflexão, em colaboração com meu parceiro e equipe de saúde. Compreendo que 
        situações imprevistas podem surgir durante o trabalho de parto, e que a saúde e bem-estar do 
        bebê e meu são prioridade. Peço gentilmente que, na ausência de emergências médicas, minhas 
        escolhas sejam respeitadas, e que quaisquer intervenções necessárias sejam discutidas comigo 
        antes de serem realizadas.
      </p>
    </div>
  );
}
