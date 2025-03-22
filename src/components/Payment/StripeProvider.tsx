
import React, { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Safely store the publishable key
// For security, we're using a variable - in production, this would be an environment variable
// The publishable key (pk_*) is safe to include in front-end code
const STRIPE_PUBLISHABLE_KEY = 'pk_test_placeholder'; // Replace with your actual publishable key for testing

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface StripeProviderProps {
  children: ReactNode;
  amount?: number;
}

export function StripeProvider({ children, amount = 9700 }: StripeProviderProps) {
  const options = {
    mode: 'payment' as const, // Explicitly type as 'payment' literal
    currency: 'brl',
    amount: amount,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#a667e4',
        colorBackground: '#ffffff',
        colorText: '#424770',
        colorDanger: '#df1b41',
        fontFamily: 'Roboto, system-ui, sans-serif',
        borderRadius: '8px',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
