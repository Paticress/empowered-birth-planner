
import { useAuth } from "@/contexts/AuthContext";

interface DashboardHeaderProps {
  greeting: string;
}

export function DashboardHeader({ greeting }: DashboardHeaderProps) {
  const { user } = useAuth();
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-maternal-900">
        {greeting}{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
      </h1>
      <p className="text-maternal-700 mt-2">
        Bem-vinda à sua jornada para um parto respeitoso e informado.
      </p>
    </div>
  );
}
