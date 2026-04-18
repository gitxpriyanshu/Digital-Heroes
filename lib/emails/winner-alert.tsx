import React from 'react';

interface WinnerAlertEmailProps {
  matchType: string;
  prizeAmount: number;
}

export const WinnerAlertEmail = ({ matchType, prizeAmount }: WinnerAlertEmailProps) => (
  <div style={{ fontFamily: 'sans-serif', backgroundColor: '#000', color: '#fff', padding: '40px', textAlign: 'center' }}>
    <h1 style={{ color: '#fbbf24' }}>🏆 You are a Winner!</h1>
    <p>Congratulations! You matched {matchType} numbers in this month&apos;s draw.</p>
    <div style={{ margin: '40px 0', padding: '30px', border: '1px solid #333', borderRadius: '20px', backgroundColor: '#111' }}>
      <p style={{ margin: 0, opacity: 0.6, fontSize: '14px', textTransform: 'uppercase' }}>Your Prize</p>
      <h2 style={{ fontSize: '48px', margin: '10px 0', color: '#fbbf24' }}>£{prizeAmount.toFixed(2)}</h2>
    </div>
    <p>Our team is verifying the result. You will be notified once the payment is processed.</p>
    <a href="https://digital-heroes.com/dashboard" style={{ 
      display: 'inline-block', 
      marginTop: '20px', 
      padding: '12px 24px', 
      backgroundColor: '#fbbf24', 
      color: '#000', 
      textDecoration: 'none', 
      borderRadius: '8px',
      fontWeight: 'bold'
    }}>View Winnings</a>
  </div>
);
