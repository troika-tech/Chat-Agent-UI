import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 48px 16px 72px;
  overflow-y: auto;
  background: ${p =>
    p.$isDarkMode
      ? 'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.2), transparent 55%), #050816'
      : 'radial-gradient(circle at 30% 15%, rgba(79,70,229,0.18), transparent 52%), #f3f7ff'};

  @media (max-width: 720px) {
    padding: 32px 12px 48px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px 24px 48px;
  width: min(920px, 100%);
  background: ${p => p.$isDarkMode ? 'rgba(15, 23, 42, 0.6)' : 'linear-gradient(180deg, #f8fbff 0%, #ffffff 60%)'};
  border-radius: 24px;
  box-shadow: ${p => p.$isDarkMode ? '0 20px 45px rgba(0,0,0,0.45)' : '0 25px 55px rgba(15, 23, 42, 0.08)'};

  @media (max-width: 720px) {
    gap: 16px;
    padding: 20px 16px 32px;
    border-radius: 20px;
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

const AccentBar = styled.div`
  width: 120px;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
`;

const TemplateList = styled.div`
  width: 100%;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-right: 8px;
`;

const Card = styled.button`
  border: 2px solid ${p => p.$active ? '#a855f7' : 'transparent'};
  background: ${p => p.$isDarkMode ? '#111827' : '#ffffff'};
  color: inherit;
  border-radius: 16px;
  padding: 20px 22px;
  cursor: pointer;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
  box-shadow: ${p =>
    p.$active
      ? '0 15px 35px rgba(168,85,247,0.25)'
      : p.$isDarkMode
      ? '0 12px 25px rgba(0,0,0,0.35)'
      : '0 12px 30px rgba(15, 23, 42, 0.08)'};

  &:hover {
    transform: translateY(-2px);
    border-color: #a855f7;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const CardTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${p => p.$isDarkMode ? '#ffffff' : '#0f172a'};
`;

const CardSubtitle = styled.div`
  font-size: 0.95rem;
  color: ${p => p.$isDarkMode ? '#cbd5f5' : '#475569'};
  margin-top: 2px;
`;

const SelectedBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 4px 10px;
  border-radius: 999px;
  color: ${p => p.$isDarkMode ? '#f8fafc' : '#f8fafc'};
  background: ${p => p.$isDarkMode ? 'rgba(15,23,42,0.85)' : '#0b1120'};
`;

const Desc = styled.p`
  margin: 0;
  line-height: 1.55;
  font-size: 0.98rem;
  color: ${p => p.$isDarkMode ? '#cbd5e1' : '#475569'};
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
  border-radius: 12px;
  background: ${p => p.$isDarkMode ? '#0f172a' : '#0b1120'};
  color: #f8fafc;
  font-weight: 600;
  cursor: pointer;
  opacity: ${p => p.disabled ? 0.5 : 1};
  min-width: 180px;
  box-shadow: ${p => p.$isDarkMode ? '0 18px 35px rgba(0,0,0,0.4)' : '0 20px 35px rgba(15,17,32,0.35)'};
  transition: transform 0.15s ease, box-shadow 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${p => p.$isDarkMode ? '0 22px 40px rgba(0,0,0,0.55)' : '0 24px 45px rgba(15,17,32,0.45)'};
  }

  @media (max-width: 720px) {
    width: 100%;
    max-width: 420px;
  }
`;

const ConfirmationBanner = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${p => p.$isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#ecfdf5'};
  border: 1px solid ${p => p.$isDarkMode ? 'rgba(16, 185, 129, 0.4)' : '#6ee7b7'};
  color: ${p => p.$isDarkMode ? '#6ee7b7' : '#047857'};
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  text-align: center;
  margin: 0 auto;
`;

const ServiceSelection = ({ chatbotId, apiBase }) => {
  const { isDarkMode } = useTheme();
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [selected, setSelected] = useState(null);
  const [sending, setSending] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Helper function to strip HTML tags for preview text
  const stripHtmlTags = (html) => {
    if (!html) return '';
    // Use regex to remove HTML tags as a fallback if document is not available
    if (typeof document === 'undefined') {
      return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    }
    try {
      const tmp = document.createElement('DIV');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    } catch (e) {
      // Fallback to regex if DOM manipulation fails
      return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    }
  };

  // Helper function to get plain text preview
  const getPlainTextPreview = (html, maxLength = 200) => {
    const plainText = stripHtmlTags(html);
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + '...';
  };

  // Fetch email templates from backend
  useEffect(() => {
    const fetchTemplates = async () => {
      if (!chatbotId || !apiBase) {
        console.log('ServiceSelection: Missing chatbotId or apiBase, using default service');
        setLoadingTemplates(false);
        // Fallback to default service if no chatbotId/apiBase
        const defaultService = {
          id: 'whatsapp',
          name: 'PlastiWorld 2026 Event Information',
          desc: 'B2B Plastic Finished Products Expo',
          long: 'Get detailed information about PlastiWorld 2026 including event dates, venue details, exhibitor registration, visitor registration, product categories, floor plans, and complete event guide to help you plan your participation effectively.'
        };
        setTemplates([defaultService]);
        setSelected(defaultService);
        return;
      }

      try {
        setLoadingTemplates(true);
        const response = await axios.get(`${apiBase}/chatbot/${chatbotId}/email-templates`);
        const templatesData = response.data?.data?.templates || response.data?.templates || [];
        
        // Filter only active templates
        const activeTemplates = templatesData.filter(t => t.is_active !== false);
        
        if (activeTemplates.length > 0) {
          // Map templates to service format
          const mappedTemplates = activeTemplates.map(t => ({
            id: t._id,
            name: t.template_name,
            desc: t.email_subject,
            long: getPlainTextPreview(t.email_body, 200), // Use plain text for preview
            template: t // Keep full template data
          }));
          setTemplates(mappedTemplates);
          setSelected(mappedTemplates[0]);
        } else {
          // Fallback to default service if no templates
          const defaultService = {
            id: 'whatsapp',
            name: 'PlastiWorld 2026 Event Information',
            desc: 'B2B Plastic Finished Products Expo',
            long: 'Get detailed information about PlastiWorld 2026 including event dates, venue details, exhibitor registration, visitor registration, product categories, floor plans, and complete event guide to help you plan your participation effectively.'
          };
          setTemplates([defaultService]);
          setSelected(defaultService);
        }
      } catch (error) {
        console.error('Error fetching email templates:', error);
        // Fallback to default service on error
        const defaultService = {
          id: 'whatsapp',
          name: 'PlastiWorld 2026 Event Information',
          desc: 'B2B Plastic Finished Products Expo',
          long: 'Get detailed information about PlastiWorld 2026 including event dates, venue details, exhibitor registration, visitor registration, product categories, floor plans, and complete event guide to help you plan your participation effectively.'
        };
        setTemplates([defaultService]);
        setSelected(defaultService);
      } finally {
        setLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, [chatbotId, apiBase]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendClick = () => {
    if (!selected) return;
    setShowEmailInput(true);
  };

  const handleEmailSubmit = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError('Please enter your email');
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      setEmailError('Please enter a valid email');
      return;
    }

    setSending(true);
    setEmailError('');

    try {
      // If we have a template (from backend), use the new email API
      if (!selected?.template?._id) {
        throw new Error("Selected template is missing. Please choose again.");
      }

      const response = await axios.post(
        `${apiBase}/chatbot/${chatbotId}/send-email`,
        {
          template_id: selected.template._id,
          recipient_email: trimmedEmail,
        }
      );

      if (!response.data?.success && !response.data?.data?.sent) {
        throw new Error(
          response.data?.message ||
            response.data?.error ||
            "Failed to send email"
        );
      }

      toast.success('Email sent successfully!');
      setEmail('');
      setShowEmailInput(false);
      setConfirmationMessage(
        `Template "${selected?.name || 'Email'}" has been emailed to ${trimmedEmail}.`
      );
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to send email. Please try again.');
      setEmailError(error.response?.data?.message || error.message || 'Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loadingTemplates) {
    return (
      <PageWrapper $isDarkMode={isDarkMode}>
        <Container $isDarkMode={isDarkMode}>
          <Title $isDarkMode={isDarkMode}>Loading Email Templates...</Title>
          <Subtitle $isDarkMode={isDarkMode}>Please wait while we load available templates.</Subtitle>
        </Container>
      </PageWrapper>
    );
  }

  if (templates.length === 0) {
    return (
      <PageWrapper $isDarkMode={isDarkMode}>
        <Container $isDarkMode={isDarkMode}>
          <Title $isDarkMode={isDarkMode}>No Email Templates Available</Title>
          <Subtitle $isDarkMode={isDarkMode}>Please contact support for assistance.</Subtitle>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper $isDarkMode={isDarkMode}>
    <Container $isDarkMode={isDarkMode}>
      <AccentBar />
      <Title $isDarkMode={isDarkMode}>
        {showEmailInput 
          ? `Send: ${selected?.name || 'Email Template'}` 
          : 'Select an Email Template'}
      </Title>

      <Subtitle $isDarkMode={isDarkMode}>
        {showEmailInput
          ? 'Enter your email to receive the selected template.'
          : "Choose a template to receive via email."}
      </Subtitle>

      {confirmationMessage && !showEmailInput && (
        <ConfirmationBanner $isDarkMode={isDarkMode}>
          {confirmationMessage}
        </ConfirmationBanner>
      )}

      {!showEmailInput ? (
        <>
          <TemplateList $isDarkMode={isDarkMode}>
            {templates.map(template => (
              <Card
                key={template.id}
                onClick={() => setSelected(template)}
                $active={selected?.id === template.id}
                $isDarkMode={isDarkMode}
              >
                <CardHeader>
                  <div>
                    <CardTitle $isDarkMode={isDarkMode}>{template.name}</CardTitle>
                    <CardSubtitle $isDarkMode={isDarkMode}>{template.desc}</CardSubtitle>
                  </div>
                  {selected?.id === template.id && (
                    <SelectedBadge $isDarkMode={isDarkMode}>
                      Selected
                    </SelectedBadge>
                  )}
                </CardHeader>
                <Desc $isDarkMode={isDarkMode}>{template.long}</Desc>
              </Card>
            ))}
          </TemplateList>
          <SendBtn disabled={!selected || sending} onClick={handleSendClick} $isDarkMode={isDarkMode}>
            Get Details
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
            {sending ? 'Sending…' : 'Send Email'}
          </SendBtn>
          <button
            onClick={() => {
              setShowEmailInput(false);
              setEmail('');
              setEmailError('');
              setConfirmationMessage('');
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
    </PageWrapper>
  );
};

export default ServiceSelection;


