import React from 'react';

export const DrawResultEmail = ({ winningNumbers, drawMonth }: any) => (
  <div style={{ fontFamily: 'sans-serif', backgroundColor: '#000', color: '#fff', padding: '40px', textAlign: 'center' }}>
    <h1 style={{ color: '#10b981' }}>Monthly Draw Results</h1>
    <p>The results for {drawMonth} are in!</p>
    <div style={{ margin: '30px 0', display: 'flex', justifyContent: 'center', gap: '10px' }}>
      {winningNumbers.map((num: number) => (
        <span key={num} style={{ 
          display: 'inline-block', 
          width: '50px', 
          height: '50px', 
          lineHeight: '50px', 
          backgroundColor: '#333', 
          borderRadius: '10px', 
          fontSize: '20px', 
          fontWeight: 'bold' 
        }}>
          {num}
        </span>
      ))}
    </div>
    <p style={{ opacity: 0.6 }}>Check the dashboard to see if you won!</p>
    <a href="https://digital-heroes.com/dashboard" style={{ 
      display: 'inline-block', 
      marginTop: '20px', 
      padding: '12px 24px', 
      backgroundColor: '#10b981', 
      color: '#000', 
      textDecoration: 'none', 
      borderRadius: '8px',
      fontWeight: 'bold'
    }}>Go to Dashboard</a>
  </div>
);
