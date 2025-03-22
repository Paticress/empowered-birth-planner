
import React, { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Use environment variable or a secure way to store the key
const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface StripeProviderProps {
  children: ReactNode;
  amount?: number;
}

export function StripeProvider({ children, amount = 9700 }: StripeProviderProps) {
  const options = {
    mode: 'payment',
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
