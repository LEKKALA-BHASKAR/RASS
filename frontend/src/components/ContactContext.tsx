import React, { createContext, useContext, useState } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  mobileNumber: string;
}

interface ContactContextType {
  isContactFormOpen: boolean;
  setIsContactFormOpen: (open: boolean) => void;
  formData: ContactFormData;
  setFormData: (data: ContactFormData) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  isSubmitted: boolean;
  setIsSubmitted: (submitted: boolean) => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    mobileNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <ContactContext.Provider value={{
      isContactFormOpen,
      setIsContactFormOpen,
      formData,
      setFormData,
      isSubmitting,
      setIsSubmitting,
      isSubmitted,
      setIsSubmitted
    }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
};