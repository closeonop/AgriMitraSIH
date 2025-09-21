import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FloatingLabelInput, FloatingLabelTextarea } from './ui/floating-label-input';
import { BackgroundBeams } from './ui/background-beams';
import { motion } from 'framer-motion';

const ContactForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setFormStatus('success');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
      
      // Reset error message after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    }
  };

  return (
    <section className="section-padding bg-gray-50 relative overflow-hidden">
      <BackgroundBeams className="absolute inset-0 z-0" />
      <div className="container-custom relative z-20">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              {t('contact.title', 'Contact Us')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('contact.subtitle', 'Have questions or feedback? We\'d love to hear from you!')}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-10 border border-white/30 relative z-30"
          >
            {formStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {t('contact.success.title', 'Message Sent!')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('contact.success.message', 'Thank you for reaching out. We\'ll get back to you soon!')}
                </p>
                <button 
                  onClick={() => setFormStatus('idle')}
                  className="px-6 py-2 bg-primary-50 text-primary-600 rounded-lg font-medium hover:bg-primary-100 transition-colors"
                >
                  {t('contact.success.button', 'Send Another Message')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="relative z-40"
                >
                  <FloatingLabelInput
                    id="name"
                    name="name"
                    label={t('contact.form.name', 'Full Name')}
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full h-14 px-4 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="relative z-40"
                >
                  <FloatingLabelInput
                    id="email"
                    name="email"
                    label={t('contact.form.email', 'Email Address')}
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-14 px-4 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="relative z-40"
                >
                  <FloatingLabelInput
                    id="phone"
                    name="phone"
                    label={t('contact.form.phone', 'Phone Number')}
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full h-14 px-4 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="relative z-40"
                >
                  <FloatingLabelInput
                    id="subject"
                    name="subject"
                    label={t('contact.form.subject', 'Subject')}
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t('contact.form.subjectPlaceholder1', 'General Inquiry')}
                    className="w-full h-14 px-4 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="relative z-40"
                >
                  <FloatingLabelTextarea
                    id="message"
                    name="message"
                    label={t('contact.form.message', 'Your Message')}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="relative z-40"
                >
                  <button
                    type="submit"
                    disabled={formStatus === 'loading'}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {formStatus === 'loading' ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {t('contact.form.sending', 'Sending...')}
                      </div>
                    ) : (
                      t('contact.form.submit', 'Send Message')
                    )}
                  </button>
                </motion.div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;