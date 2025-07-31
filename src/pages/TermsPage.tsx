import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainNavBar from '../components/MainNavBar';
import AnimatedSection from '../components/AnimatedSection';

const TermsPage: React.FC = () => {
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
              Terms of Service
            </h1>
            <div className="prose prose-invert max-w-none">
              <p>
                By accessing our app, Argent, you are agreeing to be bound by
                these terms of service, all applicable laws and regulations,
                and agree that you are responsible for compliance with any
                applicable local laws.
              </p>
              <h2 className="text-2xl font-bold mt-8 mb-4">
                Use License
              </h2>
              <p>
                Permission is granted to temporarily download one copy of the
                materials (information or software) on Argent's website for
                personal, non-commercial transitory viewing only.
              </p>
              <h2 className="text-2xl font-bold mt-8 mb-4">
                Disclaimer
              </h2>
              <p>
                The materials on Argent's website are provided on an 'as is'
                basis. Argent makes no warranties, expressed or implied, and
                hereby disclaims and negates all other warranties including,
                without limitation, implied warranties or conditions of

                merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation
                of rights.
              </p>
              <h2 className="text-2xl font-bold mt-8 mb-4">
                Limitations
              </h2>
              <p>
                In no event shall Argent or its suppliers be liable for any
                damages (including, without limitation, damages for loss of
                data or profit, or due to business interruption) arising out
                of the use or inability to use the materials on Argent's
                website.
              </p>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default TermsPage;
