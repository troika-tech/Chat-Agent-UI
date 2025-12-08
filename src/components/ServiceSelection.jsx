import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { FaEnvelope, FaSpinner, FaCheckCircle, FaRocket, FaShieldAlt, FaClock, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
  padding: 0;
  overflow: hidden;
  background: ${p =>
    p.$isDarkMode
      ? '#0f172a'
      : '#ffffff'};

  @media (max-width: 968px) {
    flex-direction: column;
    overflow-y: auto;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 48px;
  background: ${p => p.$isDarkMode 
    ? '#1e293b' 
    : '#f8f8f7'};
  position: relative;
  overflow: hidden;
  background-image: ${p => p.$isDarkMode 
    ? 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)' 
    : 'radial-gradient(circle, #a8a29e 1px, transparent 1px)'};
  background-size: 24px 24px;

  @media (max-width: 968px) {
    min-height: 40vh;
    padding: 48px 32px;
  }

  @media (max-width: 720px) {
    min-height: 35vh;
    padding: 32px 24px;
  }
`;

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  max-width: 560px;
  text-align: center;
  z-index: 2;
  position: relative;
  animation: fadeInUp 0.8s ease-out;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 968px) {
    gap: 16px;
    max-width: 100%;
  }
`;

const EmailIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.05);
  }
`;

const TitleWithIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 720px) {
    gap: 16px;
  }
`;

const LeftTitle = styled.h1`
  margin: 0;
  font-size: 2.5rem;
  font-weight: 800;
  color: ${p => p.$isDarkMode ? '#ffffff' : '#1f2937'};
  line-height: 1.2;
  letter-spacing: -0.02em;
  text-shadow: ${p => p.$isDarkMode ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none'};

  @media (max-width: 968px) {
    font-size: 2rem;
  }

  @media (max-width: 720px) {
    font-size: 1.75rem;
  }
`;

const LeftSubtitle = styled.p`
  margin: 0;
  font-size: 1.125rem;
  color: ${p => p.$isDarkMode ? 'rgba(255, 255, 255, 0.95)' : '#4b5563'};
  line-height: 1.6;
  font-weight: 400;
  max-width: 480px;

  @media (max-width: 968px) {
    font-size: 1rem;
  }

  @media (max-width: 720px) {
    font-size: 0.9375rem;
  }
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin-top: 16px;
  padding-top: 20px;
  border-top: 1px solid ${p => p.$isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(31, 41, 55, 0.2)'};

  @media (max-width: 968px) {
    display: none;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: ${p => p.$isDarkMode ? 'rgba(255, 255, 255, 0.95)' : '#374151'};
  font-size: 1.0625rem;
  text-align: left;
  font-weight: 500;
  transition: transform 0.2s ease, opacity 0.2s ease;

  &:hover {
    transform: translateX(4px);
    opacity: 1;
  }
`;

const FeatureIcon = styled.div`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.$isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(31, 41, 55, 0.1)'};
  border-radius: 12px;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
  border: 1px solid ${p => p.$isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(31, 41, 55, 0.1)'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  ${FeatureItem}:hover & {
    background: ${p => p.$isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(31, 41, 55, 0.15)'};
    transform: scale(1.1);
  }
`;


const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 48px;
  background: ${p => p.$isDarkMode ? '#1e293b' : '#ffffff'};
  overflow-y: auto;
  position: relative;

  @media (max-width: 968px) {
    padding: 40px 32px;
    min-height: 60vh;
  }

  @media (max-width: 720px) {
    padding: 32px 24px;
  }
`;

const RightContent = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  animation: fadeInRight 0.8s ease-out;

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (max-width: 968px) {
    max-width: 700px;
    gap: 28px;
  }
`;

const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 2.25rem;
  font-weight: 800;
  color: ${p => p.$isDarkMode ? '#f9fafb' : '#111827'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  letter-spacing: -0.02em;

  @media (max-width: 720px) {
    font-size: 1.75rem;
  }
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${p => p.$isDarkMode ? '#94a3b8' : '#6b7280'};
  font-size: 1rem;
  line-height: 1.5;

  @media (max-width: 720px) {
    font-size: 0.9rem;
  }
`;

const TemplateList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Card = styled.button`
  border: 2px solid ${p => p.$active ? '#1f2937' : 'transparent'};
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
      ? '0 15px 35px rgba(31, 41, 55, 0.25)'
      : p.$isDarkMode
      ? '0 12px 25px rgba(0,0,0,0.35)'
      : '0 12px 30px rgba(15, 23, 42, 0.08)'};

  &:hover {
    transform: translateY(-2px);
    border-color: #1f2937;
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
  gap: 16px;
  width: 100%;
`;

const EmailInput = styled.input`
  width: 100%;
  padding: 16px 18px;
  border: 2px solid ${p => p.$isDarkMode ? '#374151' : '#e5e7eb'};
  background: ${p => p.$isDarkMode ? '#1f2937' : '#ffffff'};
  color: ${p => p.$isDarkMode ? '#f9fafb' : '#111827'};
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    border-color: ${p => p.$isDarkMode ? '#4b5563' : '#d1d5db'};
  }

  &:focus {
    border-color: #1f2937;
    box-shadow: 0 0 0 4px rgba(31, 41, 55, 0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${p => p.$isDarkMode ? '#6b7280' : '#9ca3af'};
    font-weight: 400;
  }
`;

const SendBtn = styled.button`
  width: 100%;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  background: ${p => p.$isDarkMode ? '#1f2937' : '#1f2937'};
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  opacity: ${p => p.disabled ? 0.5 : 1};
  min-height: 48px;
  box-shadow: ${p => p.$isDarkMode ? '0 18px 35px rgba(0,0,0,0.4)' : '0 20px 35px rgba(31, 41, 55, 0.25)'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: ${p => p.$isDarkMode ? '#111827' : '#111827'};
    transform: translateY(-2px);
    box-shadow: ${p => p.$isDarkMode ? '0 22px 40px rgba(0,0,0,0.55)' : '0 24px 45px rgba(31, 41, 55, 0.35)'};
  }
`;

const ConfirmationBanner = styled.div`
  width: 100%;
  background: ${p => p.$isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#ecfdf5'};
  border: 1px solid ${p => p.$isDarkMode ? 'rgba(16, 185, 129, 0.4)' : '#6ee7b7'};
  color: ${p => p.$isDarkMode ? '#6ee7b7' : '#047857'};
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
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
        <LeftSection $isDarkMode={isDarkMode}>
          <LeftContent>
          <TitleWithIcon>
            <EmailIconWrapper>
              <FaEnvelope style={{ fontSize: '3.5rem', color: isDarkMode ? '#ffffff' : '#1f2937' }} />
            </EmailIconWrapper>
            <LeftTitle $isDarkMode={isDarkMode}>Loading...</LeftTitle>
          </TitleWithIcon>
            <LeftSubtitle $isDarkMode={isDarkMode}>Please wait while we load available templates.</LeftSubtitle>
          </LeftContent>
        </LeftSection>
        <RightSection $isDarkMode={isDarkMode}>
          <RightContent>
            <FormHeader>
              <Title $isDarkMode={isDarkMode}>
                <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
                Loading Templates
              </Title>
            </FormHeader>
          </RightContent>
        </RightSection>
      </PageWrapper>
    );
  }

  if (templates.length === 0) {
    return (
      <PageWrapper $isDarkMode={isDarkMode}>
        <LeftSection $isDarkMode={isDarkMode}>
          <LeftContent>
          <TitleWithIcon>
            <EmailIconWrapper>
              <FaEnvelope style={{ fontSize: '3.5rem', color: isDarkMode ? '#ffffff' : '#1f2937' }} />
            </EmailIconWrapper>
            <LeftTitle $isDarkMode={isDarkMode}>Send Email Templates</LeftTitle>
          </TitleWithIcon>
            <LeftSubtitle $isDarkMode={isDarkMode}>
              Instantly deliver professional email templates directly to your inbox.
            </LeftSubtitle>
          </LeftContent>
        </LeftSection>
        <RightSection $isDarkMode={isDarkMode}>
          <RightContent>
            <FormHeader>
              <Title $isDarkMode={isDarkMode}>
                <FaEnvelope style={{ color: "#1f2937" }} />
                No Email Templates Available
              </Title>
              <Subtitle $isDarkMode={isDarkMode}>Please contact support for assistance.</Subtitle>
            </FormHeader>
          </RightContent>
        </RightSection>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper $isDarkMode={isDarkMode}>
      <LeftSection $isDarkMode={isDarkMode}>
        <LeftContent>
          <TitleWithIcon>
            <EmailIconWrapper>
              <FaEnvelope style={{ fontSize: '3.5rem', color: isDarkMode ? '#ffffff' : '#1f2937' }} />
            </EmailIconWrapper>
            <LeftTitle $isDarkMode={isDarkMode}>Send Email Templates</LeftTitle>
          </TitleWithIcon>
          <LeftSubtitle $isDarkMode={isDarkMode}>
            Instantly deliver professional email templates directly to your inbox. Fast, secure, and reliable.
          </LeftSubtitle>
          <FeaturesList $isDarkMode={isDarkMode}>
            <FeatureItem $isDarkMode={isDarkMode}>
              <FeatureIcon $isDarkMode={isDarkMode}>
                <FaRocket style={{ color: isDarkMode ? '#ffffff' : '#1f2937', fontSize: '1.125rem' }} />
              </FeatureIcon>
              <span>Instant delivery to your email</span>
            </FeatureItem>
            <FeatureItem $isDarkMode={isDarkMode}>
              <FeatureIcon $isDarkMode={isDarkMode}>
                <FaCheck style={{ color: isDarkMode ? '#ffffff' : '#1f2937', fontSize: '1.125rem' }} />
              </FeatureIcon>
              <span>Professional templates ready to use</span>
            </FeatureItem>
            <FeatureItem $isDarkMode={isDarkMode}>
              <FeatureIcon $isDarkMode={isDarkMode}>
                <FaShieldAlt style={{ color: isDarkMode ? '#ffffff' : '#1f2937', fontSize: '1.125rem' }} />
              </FeatureIcon>
              <span>Secure and encrypted delivery</span>
            </FeatureItem>
            <FeatureItem $isDarkMode={isDarkMode}>
              <FeatureIcon $isDarkMode={isDarkMode}>
                <FaClock style={{ color: isDarkMode ? '#ffffff' : '#1f2937', fontSize: '1.125rem' }} />
              </FeatureIcon>
              <span>Access templates anytime, anywhere</span>
            </FeatureItem>
          </FeaturesList>
        </LeftContent>
      </LeftSection>
      <RightSection $isDarkMode={isDarkMode}>
        <RightContent>
          <FormHeader>
            <Title $isDarkMode={isDarkMode}>
              <FaEnvelope style={{ color: "#1f2937" }} />
              {showEmailInput 
                ? `Send: ${selected?.name || 'Email Template'}` 
                : 'Select an Email Template'}
            </Title>
            <Subtitle $isDarkMode={isDarkMode}>
              {showEmailInput
                ? 'Enter your email to receive the selected template.'
                : "Choose a template to receive via email."}
            </Subtitle>
          </FormHeader>

          {confirmationMessage && !showEmailInput && (
            <ConfirmationBanner $isDarkMode={isDarkMode}>
              <FaCheckCircle />
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
                <FaEnvelope />
                Send Email
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
              <SendBtn disabled={sending} onClick={handleEmailSubmit} $isDarkMode={isDarkMode}>
                {sending ? (
                  <>
                    <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaEnvelope />
                    Send 
                  </>
                )}
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
                  textDecoration: 'underline',
                  textAlign: 'center',
                  padding: '8px'
                }}
              >
                Back
              </button>
            </EmailInputContainer>
          )}
        </RightContent>
      </RightSection>
    </PageWrapper>
  );
};

export default ServiceSelection;


