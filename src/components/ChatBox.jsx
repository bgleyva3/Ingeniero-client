import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { API_ENDPOINTS } from '../config/api';
import { Link } from 'react-router-dom';

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { from: 'agent', text: '¡Hola! Soy tu asistente técnico especializado en electricidad y productos eléctricos. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Scroll to the latest message
  const scrollToLatestMessage = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Auto-scroll when messages change
  useEffect(() => {
    // Small delay to ensure DOM has updated with new content
    const timer = setTimeout(scrollToLatestMessage, 50);
    return () => clearTimeout(timer);
  }, [messages, loading]);

  // Animate agent reply word by word
  const animateAgentReply = async (fullText, messageIndex) => {
    setAnimating(true);
    let displayed = '';
    const words = fullText.split(' ');
    for (let i = 0; i < words.length; i++) {
      displayed += (i === 0 ? '' : ' ') + words[i];
      setMessages(msgs => {
        const newMsgs = [...msgs];
        newMsgs[messageIndex].text = displayed;
        return newMsgs;
      });
      await new Promise(res => setTimeout(res, 50));
    }
    setAnimating(false);
    inputRef.current?.focus();
    // Scroll to the latest message after animation completes
    setTimeout(scrollToLatestMessage, 100);
  };

  // Custom ProductCard for chat with enhanced styling
  const ChatProductCard = ({ product }) => (
    <Link 
      to={`/productos/${product.slug}?sku=${product.sku}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-102 max-w-sm"
    >
      <div className="h-32 bg-gray-200 overflow-hidden">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <span className="text-blue-600 text-xs">📦 Producto</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">{product.name}</h4>
        <p className="text-gray-600 text-xs mb-2 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-bold text-sm">${product.price?.toFixed ? product.price.toFixed(2) : product.price}</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.category}</span>
        </div>
        <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
          <span>SKU: {product.sku}</span>
        </div>
      </div>
    </Link>
  );

  // Info request form component
  const InfoRequestForm = ({ requiredInfo, onSubmit }) => {
    const [formData, setFormData] = useState({});
    
    const handleInputChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    const getFieldLabel = (field) => {
      const labels = {
        email: 'Correo electrónico',
        phone: 'Teléfono',
        name: 'Nombre',
        address: 'Dirección',
        company: 'Empresa'
      };
      return labels[field] || field;
    };

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2 max-w-md">
        <h4 className="text-sm font-semibold text-blue-800 mb-3">Información adicional requerida:</h4>
        <form onSubmit={handleSubmit} className="space-y-3">
          {requiredInfo.map(field => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {getFieldLabel(field)}
              </label>
              <input
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                required
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded text-sm hover:bg-blue-600 transition-colors"
          >
            Enviar información
          </button>
        </form>
      </div>
    );
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(msgs => [...msgs, { from: 'customer', text: userMessage }]);
    setInput('');
    setLoading(true);
    
    // Scroll immediately after user sends message
    setTimeout(scrollToLatestMessage, 50);

    try {
      // Use the new RAG API endpoint
      const response = await axios.post(API_ENDPOINTS.rag.query, {
        query: userMessage,
        k: 5,
        chat_history: chatHistory
      });

      const { answer, response_type, products, requires_info, chat_history: newChatHistory } = response.data;
      
      // Update chat history
      setChatHistory(newChatHistory);

      // Add the agent message to the UI
      const messageIndex = messages.length + 1;
      setMessages(msgs => [...msgs, { 
        from: 'agent', 
        text: '',
        response_type,
        products: products || [],
        requires_info: requires_info || []
      }]);

      // Scroll immediately after adding agent message
      setTimeout(scrollToLatestMessage, 50);

      // Animate the text response
      await animateAgentReply(answer, messageIndex);

    } catch (error) {
      console.error('Error:', error);
      setMessages(msgs => [
        ...msgs,
        { from: 'agent', text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.' }
      ]);
      setTimeout(scrollToLatestMessage, 100);
    } finally {
      setLoading(false);
    }
  };

  const handleInfoSubmit = async (formData) => {
    const infoMessage = `Información proporcionada: ${Object.entries(formData).map(([key, value]) => `${key}: ${value}`).join(', ')}`;
    
    setMessages(msgs => [...msgs, { from: 'customer', text: infoMessage }]);
    setLoading(true);
    
    // Scroll immediately after info form submission
    setTimeout(scrollToLatestMessage, 50);

    try {
      const response = await axios.post(API_ENDPOINTS.rag.query, {
        query: `He proporcionado la información solicitada: ${infoMessage}`,
        k: 5,
        chat_history: chatHistory
      });

      const { answer, response_type, products, requires_info, chat_history: newChatHistory } = response.data;
      
      setChatHistory(newChatHistory);
      
      const messageIndex = messages.length + 1;
      setMessages(msgs => [...msgs, { 
        from: 'agent', 
        text: '',
        response_type,
        products: products || [],
        requires_info: requires_info || []
      }]);

      // Scroll immediately after adding agent message from info form
      setTimeout(scrollToLatestMessage, 50);

      await animateAgentReply(answer, messageIndex);

    } catch (error) {
      console.error('Error:', error);
      setMessages(msgs => [
        ...msgs,
        { from: 'agent', text: 'Gracias por la información. Te contactaremos pronto.' }
      ]);
      setTimeout(scrollToLatestMessage, 100);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <React.Fragment key={idx}>
            <div className={`flex ${msg.from === 'customer' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-lg max-w-[85%] ${
                msg.from === 'customer'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}>
                {msg.text}
              </div>
            </div>
            
            {/* Show products if this is an agent message with products */}
            {msg.from === 'agent' && msg.products && msg.products.length > 0 && msg.text && (
              <div className="flex justify-start">
                <div className="max-w-[85%] w-full">
                  <div className="text-sm text-gray-600 mb-2 px-2">
                    💡 Productos recomendados para ti:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {msg.products.map(product => (
                      <ChatProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Show info request form if needed */}
            {msg.from === 'agent' && msg.requires_info && msg.requires_info.length > 0 && msg.text && (
              <div className="flex justify-start">
                <InfoRequestForm 
                  requiredInfo={msg.requires_info}
                  onSubmit={handleInfoSubmit}
                />
              </div>
            )}
          </React.Fragment>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 flex items-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSend} className="p-4 border-t flex items-center bg-white">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregunta sobre productos, normas CFE, instalaciones eléctricas..."
          className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading || animating}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          disabled={loading || animating || !input.trim()}
        >
          {loading ? '...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;