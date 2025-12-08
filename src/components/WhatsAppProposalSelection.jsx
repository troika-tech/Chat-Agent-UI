import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { FaWhatsapp, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100%;
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

const AccentBar = styled.div`
  width: 120px;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(135deg, #10b981, #059669, #047857);
`;

const Title = styled.h2`
  margin: 0 0 4px 0;
  color: ${p => p.$isDarkMode ? '#f9fafb' : '#111827'};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
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

const FormContainer = styled.div`
  width: 100%;
  max-width: 500px;
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
  font-size: 0.875rem;
  font-weight: 500;
  color: ${p => p.$isDarkMode ? '#d1d5db' : '#374151'};
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid ${p => p.$isDarkMode ? '#374151' : '#e5e7eb'};
  background: ${p => p.$isDarkMode ? '#1f2937' : '#ffffff'};
  color: ${p => p.$isDarkMode ? '#f9fafb' : '#111827'};
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  cursor: pointer;

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid ${p => p.$isDarkMode ? '#374151' : '#e5e7eb'};
  background: ${p => p.$isDarkMode ? '#1f2937' : '#ffffff'};
  color: ${p => p.$isDarkMode ? '#f9fafb' : '#111827'};
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  &::placeholder {
    color: ${p => p.$isDarkMode ? '#6b7280' : '#9ca3af'};
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
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  box-shadow: ${p => p.$isDarkMode ? '0 18px 35px rgba(0,0,0,0.4)' : '0 20px 35px rgba(16, 185, 129, 0.25)'};

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-2px);
    box-shadow: ${p => p.$isDarkMode ? '0 22px 40px rgba(0,0,0,0.55)' : '0 24px 45px rgba(16, 185, 129, 0.35)'};
  }
`;

const ConfirmationBanner = styled.div`
  width: 100%;
  max-width: 500px;
  background: ${p => p.$isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#ecfdf5'};
  border: 1px solid ${p => p.$isDarkMode ? 'rgba(16, 185, 129, 0.4)' : '#6ee7b7'};
  color: ${p => p.$isDarkMode ? '#6ee7b7' : '#047857'};
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
        <Container $isDarkMode={isDarkMode}>
          <Title $isDarkMode={isDarkMode}>
            <FaWhatsapp style={{ color: "#10b981" }} />
            Loading WhatsApp Proposals...
          </Title>
          <Subtitle $isDarkMode={isDarkMode}>Please wait while we load available templates.</Subtitle>
        </Container>
      </PageWrapper>
    );
  }

  if (templates.length === 0 && !loadingTemplates) {
    return (
      <PageWrapper $isDarkMode={isDarkMode}>
        <Container $isDarkMode={isDarkMode}>
          <AccentBar />
          <Title $isDarkMode={isDarkMode}>
            <FaWhatsapp style={{ color: "#10b981" }} />
            Send WhatsApp Proposal
          </Title>
          <Subtitle $isDarkMode={isDarkMode}>
            Choose a proposal template to receive via WhatsApp.
          </Subtitle>
          
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
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper $isDarkMode={isDarkMode}>
      <Container $isDarkMode={isDarkMode}>
        <AccentBar />
        <Title $isDarkMode={isDarkMode}>
          <FaWhatsapp style={{ color: "#10b981" }} />
          Send WhatsApp Proposal
        </Title>
        <Subtitle $isDarkMode={isDarkMode}>
          Choose a proposal template to receive via WhatsApp.
        </Subtitle>

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
      </Container>
    </PageWrapper>
  );
};

export default WhatsAppProposalSelection;

