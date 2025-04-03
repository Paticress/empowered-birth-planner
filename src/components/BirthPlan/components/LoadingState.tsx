
export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-maternal-50">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-maternal-500 border-r-transparent"></div>
        <p className="mt-4 text-maternal-800">Carregando...</p>
      </div>
    </div>
  );
}
