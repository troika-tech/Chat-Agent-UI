import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-toastify';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 24px;
  max-width: 960px;
  margin: 0 auto;

  @media (max-width: 720px) {
    gap: 16px;
    padding: 16px 14px 24px;
  }
`;

const Title = styled.h2`
  margin: 0 0 4px 0;
  color: ${p => p.$isDarkMode ? '#f9fafb' : '#111827'};
  text-align: center;
  @media (max-width: 720px) {
    font-size: 1.1rem;
  }
`;

const Subtitle = styled.p`
  margin: 0 0 12px 0;
  color: ${p => p.$isDarkMode ? '#94a3b8' : '#6b7280'};
  text-align: center;
  font-size: 0.95rem;
  @media (max-width: 720px) {
    font-size: 0.9rem;
  }
`;

const Grid = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 480px;

  @media (max-width: 720px) {
    max-width: 420px;
  }
`;

const Card = styled.button`
  border: 2px solid ${p => p.$active ? '#8b5cf6' : (p.$isDarkMode ? '#374151' : '#e5e7eb')};
  background: ${p => p.$isDarkMode ? '#1f2937' : '#ffffff'};
  color: inherit;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 96px;
  @media (max-width: 720px) {
    min-height: unset;
  }
`;

const Desc = styled.p`
  margin: 6px 0 0 0;
  line-height: 1.45;
  color: ${p => p.$isDarkMode ? '#cbd5e1' : '#4b5563'};
  @media (max-width: 720px) {
    margin-top: 4px;
    font-size: 0.92rem;
  }
`;

const EmailInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 420px;
  align-self: center;
`;

const EmailInput = styled.input`
  padding: 14px 16px;
  border: 2px solid ${p => p.$isDarkMode ? '#374151' : '#e5e7eb'};
  background: ${p => p.$isDarkMode ? '#1f2937' : '#ffffff'};
  color: ${p => p.$isDarkMode ? '#f9fafb' : '#111827'};
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #8b5cf6;
  }

  &::placeholder {
    color: ${p => p.$isDarkMode ? '#6b7280' : '#9ca3af'};
  }
`;

const SendBtn = styled.button`
  align-self: center;
  padding: 12px 18px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  opacity: ${p => p.disabled ? 0.6 : 1};
  min-width: 170px;
  @media (max-width: 720px) {
    width: 100%;
    max-width: 420px;
  }
`;

const ServiceSelection = ({ onSendProposal, phoneNumber }) => {
  const { isDarkMode } = useTheme();
  const whatsappService = { id: 'whatsapp', name: 'WhatsApp Marketing', desc: 'Campaigns and automations', long: 'Launch approved templates, schedule broadcasts and build automation flows that convert at scale.' };
  const [selected, setSelected] = useState(whatsappService);
  const [sending, setSending] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const services = [
    { id: 'whatsapp', name: 'WhatsApp Marketing', desc: 'Campaigns and automations', long: 'Launch approved templates, schedule broadcasts and build automation flows that convert at scale.' },
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendClick = () => {
    if (!selected) return;
    setShowEmailInput(true);
  };

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      setEmailError('Please enter your email');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    setSending(true);
    setEmailError('');
    try {
      const response = await fetch('https://api.0804.in/api/proposal/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to send proposal');
      }

      // Show success toast notification
      toast.success('Proposal sent successfully to your email!');

      // Reset form
      setEmail('');
      setShowEmailInput(false);
    } catch (error) {
      // Show error toast notification
      toast.error(error.message || 'Failed to send proposal. Please try again.');
      setEmailError(error.message || 'Failed to send proposal. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Container>
      <Title $isDarkMode={isDarkMode}>Get WhatsApp Marketing Proposal</Title>
      <Subtitle $isDarkMode={isDarkMode}>
        {showEmailInput ? 'Enter your email to receive the proposal' : "We'll send a tailored proposal to your email."}
      </Subtitle>

      {!showEmailInput ? (
        <>
          <Grid>
            {services.map(s => (
              <Card
                key={s.id}
                onClick={() => setSelected(s)}
                $active={selected?.id === s.id}
                $isDarkMode={isDarkMode}
              >
                <div style={{fontWeight:700, marginBottom:6, color: isDarkMode ? '#f9fafb' : '#111827'}}>{s.name}</div>
                <div style={{opacity:0.8, color: isDarkMode ? '#e5e7eb' : '#374151'}}>{s.desc}</div>
                <Desc $isDarkMode={isDarkMode}>{s.long}</Desc>
              </Card>
            ))}
          </Grid>
          <SendBtn disabled={!selected || sending} onClick={handleSendClick}>
            Send Proposal
          </SendBtn>
        </>
      ) : (
        <EmailInputContainer>
          <EmailInput
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleEmailSubmit();
            }}
            $isDarkMode={isDarkMode}
            autoFocus
          />
          {emailError && (
            <div style={{color: '#ef4444', fontSize: '0.875rem', textAlign: 'center'}}>
              {emailError}
            </div>
          )}
          <SendBtn disabled={sending} onClick={handleEmailSubmit}>
            {sending ? 'Sending…' : 'Send to Email'}
          </SendBtn>
          <button
            onClick={() => {
              setShowEmailInput(false);
              setEmail('');
              setEmailError('');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: isDarkMode ? '#94a3b8' : '#6b7280',
              cursor: 'pointer',
              fontSize: '0.9rem',
              textDecoration: 'underline'
            }}
          >
            Back
          </button>
        </EmailInputContainer>
      )}
    </Container>
  );
};

export default ServiceSelection;


