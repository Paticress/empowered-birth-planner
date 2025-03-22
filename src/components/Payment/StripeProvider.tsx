
import React, { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// For a real application, the publishable key is safe to include in front-end code
// (unlike secret keys which must be kept server-side)
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51PbSUiD11sLN8AKgsyqob2zncHXMOhd8mr9Ir3K83Xkl49ZsDOrj8VuV8TLXXLSUnrdW0v61KG7rmD1S7UaHltCA006fMaA9Dj';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface StripeProviderProps {
  children: ReactNode;
  amount?: number;
}

export function StripeProvider({ children, amount = 9700 }: StripeProviderProps) {
  const options = {
    mode: 'payment' as const,
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
