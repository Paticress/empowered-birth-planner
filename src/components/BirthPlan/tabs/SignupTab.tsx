
import { SignupForm } from '../forms/SignupForm';
import { useLoginForm } from '../hooks/useLoginForm';

export function SignupTab() {
  const {
    signupCredentials,
    isLoading,
    handleSignupChange,
    handleSignup
  } = useLoginForm();

  return (
    <SignupForm 
      signupCredentials={signupCredentials}
      isLoading={isLoading}
      handleSignupChange={handleSignupChange}
      handleSignup={handleSignup}
    />
  );
}
