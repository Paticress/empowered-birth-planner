
import { LoginForm } from '../forms/LoginForm';
import { useLoginForm } from '../hooks/useLoginForm';

export function LoginTab() {
  const {
    loginCredentials,
    isLoading,
    handleLoginChange,
    handleLogin
  } = useLoginForm();

  return (
    <LoginForm 
      loginCredentials={loginCredentials}
      isLoading={isLoading}
      handleLoginChange={handleLoginChange}
      handleLogin={handleLogin}
    />
  );
}
