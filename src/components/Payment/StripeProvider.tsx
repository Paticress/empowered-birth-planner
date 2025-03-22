
import React, { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your publishable key from Stripe Dashboard
// Go to: https://dashboard.stripe.com/apikeys
const stripePromise = loadStripe('pk_test_REPLACE_WITH_YOUR_PUBLISHABLE_KEY');

interface StripeProviderProps {
  children: ReactNode;
  amount?: number; // Allow custom amount to be passed
}

export function StripeProvider({ children, amount = 9700 }: StripeProviderProps) {
  // Configure payment options
  const options = {
    mode: 'payment' as const,
    currency: 'brl',
    amount: amount, // R$ 97,00 in cents
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#a667e4', // Adjust to match your maternal theme
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
