import React from 'react';
import { Brain, User, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { useState } from 'react';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const MarkdownComponents = {
    // Enhanced table styling
    table: ({ children, ...props }: any) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden shadow-sm" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: any) => (
      <thead className="bg-gray-50" {...props}>
        {children}
      </thead>
    ),
    th: ({ children, ...props }: any) => (
      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900 bg-gray-100" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td className="border border-gray-300 px-4 py-3 text-gray-700" {...props}>
        {children}
      </td>
    ),
    tr: ({ children, ...props }: any) => (
      <tr className="hover:bg-gray-50 transition-colors" {...props}>
        {children}
      </tr>
    ),
    
    // Enhanced code blocks
    code: ({ inline, className, children, ...props }: any) => {
      if (inline) {
        return (
          <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono" {...props}>
            {children}
          </code>
        );
      }
      return (
        <div className="relative my-4">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    },
    
    // Enhanced headings
    h1: ({ children, ...props }: any) => (
      <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-4 pb-2 border-b border-gray-200" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 className="text-xl font-bold text-gray-900 mt-5 mb-3" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2" {...props}>
        {children}
      </h3>
    ),
    
    // Enhanced lists
    ul: ({ children, ...props }: any) => (
      <ul className="list-disc list-inside my-3 space-y-1 text-gray-700" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="list-decimal list-inside my-3 space-y-1 text-gray-700" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="ml-4" {...props}>
        {children}
      </li>
    ),
    
    // Enhanced blockquotes
    blockquote: ({ children, ...props }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 text-gray-700 italic" {...props}>
        {children}
      </blockquote>
    ),
    
    // Enhanced links
    a: ({ children, href, ...props }: any) => (
      <a 
        href={href} 
        className="text-blue-600 hover:text-blue-800 underline transition-colors" 
        target="_blank" 
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    
    // Enhanced images
    img: ({ src, alt, ...props }: any) => (
      <div className="my-4">
        <img 
          src={src} 
          alt={alt} 
          className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
          loading="lazy"
          {...props}
        />
        {alt && (
          <p className="text-sm text-gray-500 text-center mt-2 italic">{alt}</p>
        )}
      </div>
    ),
    
    // Enhanced paragraphs
    p: ({ children, ...props }: any) => (
      <p className="my-2 leading-relaxed text-gray-700" {...props}>
        {children}
      </p>
    ),
    
    // Enhanced horizontal rules
    hr: ({ ...props }: any) => (
      <hr className="my-6 border-t border-gray-300" {...props} />
    ),
    
    // Enhanced strong/bold text
    strong: ({ children, ...props }: any) => (
      <strong className="font-semibold text-gray-900" {...props}>
        {children}
      </strong>
    ),
    
    // Enhanced emphasis/italic text
    em: ({ children, ...props }: any) => (
      <em className="italic text-gray-700" {...props}>
        {children}
      </em>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`flex items-start space-x-3 max-w-[90%] ${
        isUser ? 'flex-row-reverse space-x-reverse' : ''
      }`}>
        {/* Avatar */}
        <motion.div 
          className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
            isUser 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
              : 'bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {isUser ? 
            <User size={16} className="text-white lg:hidden" /> : 
            <Brain size={16} className="text-gray-600 lg:hidden" />
          }
          {isUser ? 
            <User size={18} className="text-white hidden lg:block" /> : 
            <Brain size={18} className="text-gray-600 hidden lg:block" />
          }
        </motion.div>
        
        {/* Message Content */}
        <motion.div 
          className={`rounded-2xl px-4 py-3 lg:px-6 lg:py-4 shadow-sm border max-w-full relative group ${
            isUser 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 rounded-br-md' 
              : 'bg-white text-gray-900 border-gray-200 rounded-bl-md'
          }`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {/* Copy button for assistant messages */}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-md hover:bg-gray-100"
              title="Copy message"
            >
              {copied ? (
                <Check size={14} className="text-green-600" />
              ) : (
                <Copy size={14} className="text-gray-500" />
              )}
            </button>
          )}
          
          <div className={`text-sm lg:text-base leading-relaxed break-words ${
            isUser ? 'text-white' : 'text-gray-900'
          }`}>
            {isUser ? (
              // For user messages, render as plain text
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              // For assistant messages, render with markdown support
              <div className="prose prose-sm lg:prose-base max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={MarkdownComponents}
                  className="markdown-content"
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
          
          {message.createdAt && (
            <motion.div 
              className={`text-xs mt-3 ${
                isUser ? 'text-blue-100' : 'text-gray-500'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;