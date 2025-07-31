import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainNavBar from '../components/MainNavBar';
import AnimatedSection from '../components/AnimatedSection';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <MainNavBar />
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <AnimatedSection>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-8">
              Privacy Policy
            </h1>
            <div className="prose prose-invert max-w-none">
              <p>
                Your privacy is important to us. It is Argent's policy to respect
                your privacy regarding any information we may collect from you
                across our website, and other sites we own and operate.
              </p>
              <h2 className="text-2xl font-bold mt-8 mb-4">
                Information We Collect
              </h2>
              <p>
                We only ask for personal information when we truly need it to
                provide a service to you. We collect it by fair and lawful
                means, with your knowledge and consent. We also let you know
                why we’re collecting it and how it will be used.
              </p>
              <h2 className="text-2xl font-bold mt-8 mb-4">
                How We Use Your Information
              </h2>
              <p>
                We use the information we collect in various ways, including to:
              </p>
              <ul>
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>
                  Develop new products, services, features, and functionality
                </li>
                <li>
                  Communicate with you, either directly or through one of our
                  partners, including for customer service, to provide you
                  with updates and other information relating to the website,
                  and for marketing and promotional purposes
                </li>
                <li>Send you emails</li>
                <li>Find and prevent fraud</li>
              </ul>
              <h2 className="text-2xl font-bold mt-8 mb-4">
                Security
              </h2>
              <p>
                The security of your data is important to us. We use
                industry-standard encryption and security protocols to protect
                your information.
              </p>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default PrivacyPage;
