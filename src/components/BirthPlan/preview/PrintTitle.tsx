
export function PrintTitle() {
  return (
    <div className="hidden print:block mb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">PLANO DE PARTO</h1>
        <img 
          src="/lovable-uploads/6f452e84-0922-495e-bad9-57a66fa763f6.png" 
          alt="Energia Materna" 
          className="h-12"
        />
      </div>
      <p className="text-center text-gray-500 mt-2">Este documento representa minhas preferências para o parto e nascimento do meu bebê.</p>
    </div>
  );
}
