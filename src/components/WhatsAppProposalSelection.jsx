import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { FaWhatsapp, FaSpinner, FaCheckCircle, FaExclamationCircle, FaCheck, FaRocket, FaShieldAlt, FaClock, FaCommentDots } from 'react-icons/fa';
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

const WhatsAppIconWrapper = styled.div`
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

const DecorativePattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: ${p => p.$isDarkMode ? 0.1 : 0.2};
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 45%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.3) 0%, transparent 45%),
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
  z-index: 1;
  animation: pulse 8s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: ${p => p.$isDarkMode ? 0.1 : 0.2};
    }
    50% {
      opacity: ${p => p.$isDarkMode ? 0.15 : 0.25};
    }
  }
`;

const FloatingShape = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  filter: blur(60px);
  z-index: 1;
  animation: float 12s ease-in-out infinite;

  &:nth-child(1) {
    top: -100px;
    left: -100px;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    bottom: -100px;
    right: -100px;
    animation-delay: 4s;
  }

  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(30px, -30px) scale(1.1);
    }
    66% {
      transform: translate(-30px, 30px) scale(0.9);
    }
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
  max-width: 480px;
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
    max-width: 600px;
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

const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${p => p.$isDarkMode ? '#e5e7eb' : '#1f2937'};
  margin-bottom: 4px;
  letter-spacing: -0.01em;
`;

const Select = styled.select`
  width: 100%;
  padding: 16px 18px;
  border: 2px solid ${p => p.$isDarkMode ? '#374151' : '#e5e7eb'};
  background: ${p => p.$isDarkMode ? '#1f2937' : '#ffffff'};
  color: ${p => p.$isDarkMode ? '#f9fafb' : '#111827'};
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    border-color: ${p => p.$isDarkMode ? '#4b5563' : '#d1d5db'};
  }

  &:focus {
    border-color: #1f2937;
    box-shadow: 0 0 0 4px rgba(31, 41, 55, 0.1);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const HelpText = styled.p`
  font-size: 0.75rem;
  color: ${p => p.$isDarkMode ? '#9ca3af' : '#6b7280'};
  margin: 0;
`;

const ErrorMessage = styled.div`
  background: ${p => p.$isDarkMode ? '#7f1d1d' : '#fee2e2'};
  color: ${p => p.$isDarkMode ? '#fca5a5' : '#dc2626'};
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SuccessMessage = styled.div`
  background: ${p => p.$isDarkMode ? '#14532d' : '#d1fae5'};
  color: ${p => p.$isDarkMode ? '#86efac' : '#059669'};
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  margin-top: 8px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 18px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  min-height: 48px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: ${p => p.$isDarkMode ? '#2d2d2d' : '#f3f4f6'};
  color: ${p => p.$isDarkMode ? '#ffffff' : '#374151'};

  &:hover:not(:disabled) {
    background: ${p => p.$isDarkMode ? '#404040' : '#e5e7eb'};
  }
`;

const SendButton = styled(Button)`
  background: ${p => p.$isDarkMode ? '#1f2937' : '#1f2937'};
  color: #ffffff;
  box-shadow: ${p => p.$isDarkMode ? '0 18px 35px rgba(0,0,0,0.4)' : '0 20px 35px rgba(31, 41, 55, 0.25)'};

  &:hover:not(:disabled) {
    background: ${p => p.$isDarkMode ? '#374151' : '#374151'};
    transform: translateY(-2px);
    box-shadow: ${p => p.$isDarkMode ? '0 22px 40px rgba(0,0,0,0.55)' : '0 24px 45px rgba(31, 41, 55, 0.35)'};
  }
`;

const ConfirmationBanner = styled.div`
  width: 100%;
  background: ${p => p.$isDarkMode ? 'rgba(31, 41, 55, 0.3)' : '#f3f4f6'};
  border: 1px solid ${p => p.$isDarkMode ? 'rgba(31, 41, 55, 0.6)' : '#d1d5db'};
  color: ${p => p.$isDarkMode ? '#e5e7eb' : '#374151'};
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  text-align: center;
`;

const WhatsAppProposalSelection = ({ chatbotId, apiBase, authenticatedPhone = null }) => {
  const { isDarkMode } = useTheme();
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  // Fetch WhatsApp proposal templates
  useEffect(() => {
    const fetchTemplates = async () => {
      if (!chatbotId || !apiBase) {
        console.log('WhatsAppProposalSelection: Missing chatbotId or apiBase');
        setLoadingTemplates(false);
        return;
      }

      try {
        setLoadingTemplates(true);
        const response = await axios.get(`${apiBase}/chatbot/${chatbotId}/whatsapp-proposal-templates`);
        console.log('WhatsApp templates API response:', response.data);
        
        // Handle different response formats
        let templatesData = [];
        if (Array.isArray(response.data)) {
          templatesData = response.data;
        } else if (response.data?.data) {
          templatesData = Array.isArray(response.data.data) ? response.data.data : [];
        } else if (response.data?.templates) {
          templatesData = Array.isArray(response.data.templates) ? response.data.templates : [];
        }
        
        // Filter only active templates (if is_active field exists)
        const activeTemplates = templatesData.filter(t => t.is_active !== false);
        
        console.log('Processed templates:', activeTemplates);
        setTemplates(activeTemplates);
        
        // Auto-select first template if available
        if (activeTemplates.length > 0) {
          setSelectedTemplateId(activeTemplates[0]._id);
        }
      } catch (error) {
        console.error('Error fetching WhatsApp proposal templates:', error);
        console.error('Error details:', error.response?.data || error.message);
        setTemplates([]);
        setError('Failed to load templates. Please try again later.');
      } finally {
        setLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, [chatbotId, apiBase]);

  // Auto-populate phone number from multiple sources
  useEffect(() => {
    // Priority 1: Authenticated phone from props
    if (authenticatedPhone) {
      setPhoneNumber(String(authenticatedPhone));
      return;
    }

    // Priority 2: Try to get phone from localStorage
    try {
      const savedPhone = localStorage.getItem('chatbot_user_phone');
      if (savedPhone) {
        setPhoneNumber(savedPhone);
        return;
      }
    } catch (e) {
      // Ignore
    }

    // Priority 3: Try to get phone from sessionStorage
    try {
      const sessionPhone = sessionStorage.getItem('chatbot_user_phone');
      if (sessionPhone) {
        setPhoneNumber(sessionPhone);
        return;
      }
    } catch (e) {
      // Ignore
    }

    // Priority 4: Try to get phone from auth blob in localStorage
    try {
      const authBlob = localStorage.getItem('chatbot_auth');
      if (authBlob) {
        const parsed = JSON.parse(authBlob);
        if (parsed?.userInfo?.phone) {
          setPhoneNumber(String(parsed.userInfo.phone));
          return;
        }
      }
    } catch (e) {
      // Ignore
    }

    // Priority 5: Try to get phone from auth blob in sessionStorage
    try {
      const authBlob = sessionStorage.getItem('chatbot_auth');
      if (authBlob) {
        const parsed = JSON.parse(authBlob);
        if (parsed?.userInfo?.phone) {
          setPhoneNumber(String(parsed.userInfo.phone));
          return;
        }
      }
    } catch (e) {
      // Ignore
    }
  }, [authenticatedPhone]);

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.trim());
  };

  const handleSend = async () => {
    if (!selectedTemplateId) {
      setError("Please select a template");
      return;
    }

    if (!phoneNumber.trim()) {
      setError("Please enter a phone number");
      return;
    }

    if (!validatePhone(phoneNumber)) {
      setError("Please enter a valid phone number");
      return;
    }

    setError("");
    setSending(true);
    setSuccess(false);

    try {
      const response = await axios.post(
        `${apiBase}/chatbot/${chatbotId}/send-whatsapp-proposal`,
        {
          phone: phoneNumber.trim(),
          template_id: selectedTemplateId,
        }
      );

      if (response.data.success) {
        setSuccess(true);
        const selectedTemplate = templates.find(t => t._id === selectedTemplateId);
        setConfirmationMessage(
          `Proposal "${selectedTemplate?.display_name || 'Proposal'}" has been sent to ${phoneNumber.trim()}.`
        );
        toast.success('Proposal sent successfully! ✅');
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setSuccess(false);
          setConfirmationMessage("");
          setPhoneNumber("");
        }, 3000);
      } else {
        throw new Error(response.data.message || "Failed to send proposal");
      }
    } catch (error) {
      console.error('Error sending proposal:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send proposal. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
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
              <WhatsAppIconWrapper>
                <FaWhatsapp style={{ fontSize: '3.5rem', color: isDarkMode ? '#ffffff' : '#1f2937' }} />
              </WhatsAppIconWrapper>
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

  if (templates.length === 0 && !loadingTemplates) {
    return (
      <PageWrapper $isDarkMode={isDarkMode}>
        <LeftSection $isDarkMode={isDarkMode}>
          <LeftContent>
            <TitleWithIcon>
              <WhatsAppIconWrapper>
                <FaWhatsapp style={{ fontSize: '3.5rem', color: isDarkMode ? '#ffffff' : '#1f2937' }} />
              </WhatsAppIconWrapper>
              <LeftTitle $isDarkMode={isDarkMode}>Send WhatsApp Proposals</LeftTitle>
            </TitleWithIcon>
            <LeftSubtitle $isDarkMode={isDarkMode}>
              Instantly deliver professional proposals directly to your client's WhatsApp.
            </LeftSubtitle>
          </LeftContent>
        </LeftSection>
        <RightSection $isDarkMode={isDarkMode}>
          <RightContent>
            <FormHeader>
          <Title $isDarkMode={isDarkMode}>
            <FaWhatsapp style={{ color: isDarkMode ? "#ffffff" : "#1f2937" }} />
            Send WhatsApp Proposal
          </Title>
          <Subtitle $isDarkMode={isDarkMode}>
            Choose a proposal template to receive via WhatsApp.
          </Subtitle>
            </FormHeader>
          
          {error && (
            <ErrorMessage $isDarkMode={isDarkMode}>
              <FaExclamationCircle />
              {error}
            </ErrorMessage>
          )}
          
          <FormContainer>
            <FormGroup>
              <Label $isDarkMode={isDarkMode}>Select Template *</Label>
              <Select $isDarkMode={isDarkMode} disabled>
                <option value="">No templates available</option>
              </Select>
              <HelpText $isDarkMode={isDarkMode}>
                No proposal templates are configured. Please contact support.
              </HelpText>
            </FormGroup>
          </FormContainer>
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
            <WhatsAppIconWrapper>
              <FaWhatsapp style={{ fontSize: '3.5rem', color: isDarkMode ? '#ffffff' : '#1f2937' }} />
            </WhatsAppIconWrapper>
            <LeftTitle $isDarkMode={isDarkMode}>Send WhatsApp Proposals</LeftTitle>
          </TitleWithIcon>
          <LeftSubtitle $isDarkMode={isDarkMode}>
            Instantly deliver professional proposals directly to your client's WhatsApp. Fast, secure, and reliable.
          </LeftSubtitle>
          <FeaturesList $isDarkMode={isDarkMode}>
            <FeatureItem $isDarkMode={isDarkMode}>
              <FeatureIcon $isDarkMode={isDarkMode}>
                <FaRocket style={{ color: isDarkMode ? '#ffffff' : '#1f2937', fontSize: '1.125rem' }} />
              </FeatureIcon>
              <span>Instant delivery to WhatsApp</span>
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
              <span>Track delivery status in real-time</span>
            </FeatureItem>
          </FeaturesList>
        </LeftContent>
      </LeftSection>
      <RightSection $isDarkMode={isDarkMode}>
        <RightContent>
          <FormHeader>
        <Title $isDarkMode={isDarkMode}>
          <FaWhatsapp style={{ color: isDarkMode ? "#ffffff" : "#1f2937" }} />
          Send WhatsApp Proposal
        </Title>
        <Subtitle $isDarkMode={isDarkMode}>
          Choose a proposal template to receive via WhatsApp.
        </Subtitle>
          </FormHeader>

        {confirmationMessage && (
          <ConfirmationBanner $isDarkMode={isDarkMode}>
            {confirmationMessage}
          </ConfirmationBanner>
        )}

        <FormContainer>
          {error && (
            <ErrorMessage $isDarkMode={isDarkMode}>
              <FaExclamationCircle />
              {error}
            </ErrorMessage>
          )}

          {success && (
            <SuccessMessage $isDarkMode={isDarkMode}>
              <FaCheckCircle />
              Proposal sent successfully!
            </SuccessMessage>
          )}

          <FormGroup>
            <Label $isDarkMode={isDarkMode}>Select Template *</Label>
            <Select
              $isDarkMode={isDarkMode}
              value={selectedTemplateId}
              onChange={(e) => {
                setSelectedTemplateId(e.target.value);
                setError("");
              }}
              disabled={sending}
            >
              {templates.map((template) => (
                <option key={template._id} value={template._id}>
                  {template.display_name}
                  {template.description ? ` - ${template.description}` : ""}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label $isDarkMode={isDarkMode}>Phone Number *</Label>
            <Input
              $isDarkMode={isDarkMode}
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setError("");
              }}
              placeholder="+91 9876543210 or 9876543210"
              disabled={sending}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !sending && selectedTemplateId && phoneNumber.trim()) {
                  handleSend();
                }
              }}
              autoFocus
            />
            <HelpText $isDarkMode={isDarkMode}>
              Enter phone number with or without country code
            </HelpText>
          </FormGroup>

          <ButtonGroup>
            <SendButton
              onClick={handleSend}
              disabled={sending || !selectedTemplateId || !phoneNumber.trim()}
              $isDarkMode={isDarkMode}
            >
              {sending ? (
                <>
                  <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
                  Sending...
                </>
              ) : (
                <>
                  <FaWhatsapp />
                  Send Proposal
                </>
              )}
            </SendButton>
          </ButtonGroup>
        </FormContainer>
        </RightContent>
      </RightSection>
    </PageWrapper>
  );
};

export default WhatsAppProposalSelection;

