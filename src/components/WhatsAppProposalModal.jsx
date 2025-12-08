import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTheme } from "../contexts/ThemeContext";
import { FaWhatsapp, FaTimes, FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: ${props => props.$isDarkMode ? '#1f1f1f' : '#ffffff'};
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.$isDarkMode ? '#404040' : '#e5e7eb'};
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#1f2937'};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.$isDarkMode ? '#9ca3af' : '#6b7280'};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$isDarkMode ? '#2d2d2d' : '#f3f4f6'};
    color: ${props => props.$isDarkMode ? '#ffffff' : '#1f2937'};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.$isDarkMode ? '#d1d5db' : '#374151'};
  margin-bottom: 0.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.$isDarkMode ? '#404040' : '#e5e7eb'};
  border-radius: 8px;
  background: ${props => props.$isDarkMode ? '#2d2d2d' : '#ffffff'};
  color: ${props => props.$isDarkMode ? '#ffffff' : '#1f2937'};
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;

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
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.$isDarkMode ? '#404040' : '#e5e7eb'};
  border-radius: 8px;
  background: ${props => props.$isDarkMode ? '#2d2d2d' : '#ffffff'};
  color: ${props => props.$isDarkMode ? '#ffffff' : '#1f2937'};
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  &::placeholder {
    color: ${props => props.$isDarkMode ? '#6b7280' : '#9ca3af'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: ${props => props.$isDarkMode ? '#2d2d2d' : '#f3f4f6'};
  color: ${props => props.$isDarkMode ? '#ffffff' : '#374151'};

  &:hover:not(:disabled) {
    background: ${props => props.$isDarkMode ? '#404040' : '#e5e7eb'};
  }
`;

const SendButton = styled(Button)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
`;

const HelpText = styled.p`
  font-size: 0.75rem;
  color: ${props => props.$isDarkMode ? '#9ca3af' : '#6b7280'};
  margin-top: 0.5rem;
`;

const ErrorMessage = styled.div`
  background: ${props => props.$isDarkMode ? '#7f1d1d' : '#fee2e2'};
  color: ${props => props.$isDarkMode ? '#fca5a5' : '#dc2626'};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SuccessMessage = styled.div`
  background: ${props => props.$isDarkMode ? '#14532d' : '#d1fae5'};
  color: ${props => props.$isDarkMode ? '#86efac' : '#059669'};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const WhatsAppProposalModal = ({ isOpen, onClose, chatbotId, apiBase, templates = [], authenticatedPhone = null }) => {
  const { isDarkMode } = useTheme();
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setSelectedTemplateId("");
      setError("");
      setSuccess(false);
      
      // Auto-populate phone number if user is authenticated
      if (authenticatedPhone) {
        setPhoneNumber(authenticatedPhone);
      } else {
        // Try to get phone from localStorage as fallback
        try {
          const savedPhone = localStorage.getItem('chatbot_user_phone');
          if (savedPhone) {
            setPhoneNumber(savedPhone);
          } else {
            setPhoneNumber("");
          }
        } catch (e) {
          setPhoneNumber("");
        }
      }
      
      // Auto-select first template if available
      if (templates.length > 0) {
        setSelectedTemplateId(templates[0]._id);
      }
    }
  }, [isOpen, templates, authenticatedPhone]);

  const handleSend = async () => {
    if (!selectedTemplateId) {
      setError("Please select a template");
      return;
    }

    if (!phoneNumber.trim()) {
      setError("Please enter a phone number");
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
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
        toast.success("Proposal sent successfully! ✅");
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      } else {
        throw new Error(response.data.message || "Failed to send proposal");
      }
    } catch (error) {
      console.error("Error sending proposal:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to send proposal";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent $isDarkMode={isDarkMode} onClick={(e) => e.stopPropagation()}>
        <ModalHeader $isDarkMode={isDarkMode}>
          <ModalTitle $isDarkMode={isDarkMode}>
            <FaWhatsapp style={{ color: "#10b981" }} />
            Send WhatsApp Proposal
          </ModalTitle>
          <CloseButton $isDarkMode={isDarkMode} onClick={handleClose} disabled={sending}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

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
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            disabled={sending || templates.length === 0}
          >
            {templates.length === 0 ? (
              <option value="">No templates available</option>
            ) : (
              <>
                <option value="">-- Select a template --</option>
                {templates.map((template) => (
                  <option key={template._id} value={template._id}>
                    {template.display_name}
                    {template.description ? ` - ${template.description}` : ""}
                  </option>
                ))}
              </>
            )}
          </Select>
          {templates.length === 0 && (
            <HelpText $isDarkMode={isDarkMode}>
              No proposal templates are configured. Please contact support.
            </HelpText>
          )}
        </FormGroup>

        <FormGroup>
          <Label $isDarkMode={isDarkMode}>Phone Number *</Label>
          <Input
            $isDarkMode={isDarkMode}
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+91 9876543210 or 9876543210"
            disabled={sending}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !sending && selectedTemplateId && phoneNumber.trim()) {
                handleSend();
              }
            }}
          />
          <HelpText $isDarkMode={isDarkMode}>
            Enter phone number with or without country code
          </HelpText>
        </FormGroup>

        <ButtonGroup>
          <CancelButton $isDarkMode={isDarkMode} onClick={handleClose} disabled={sending}>
            Cancel
          </CancelButton>
          <SendButton
            onClick={handleSend}
            disabled={sending || !selectedTemplateId || !phoneNumber.trim() || templates.length === 0}
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
      </ModalContent>
    </ModalOverlay>
  );
};

export default WhatsAppProposalModal;

