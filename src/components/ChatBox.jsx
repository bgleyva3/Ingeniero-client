import React, { useState, useRef } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { API_ENDPOINTS } from '../config/api';

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { from: 'agent', text: '¡Hola! ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [referencedProducts, setReferencedProducts] = useState([]);
  const [splitMessage, setSplitMessage] = useState(null);
  const inputRef = useRef(null);

  // Animate agent reply word by word (for intro/outro)
  const animateAgentReply = async (fullText) => {
    setAnimating(true);
    let displayed = '';
    const words = fullText.split(' ');
    for (let i = 0; i < words.length; i++) {
      displayed += (i === 0 ? '' : ' ') + words[i];
      setMessages(msgs => [
        ...msgs.slice(0, -1),
        { from: 'agent', text: displayed }
      ]);
      await new Promise(res => setTimeout(res, 60));
    }
    setAnimating(false);
    inputRef.current?.focus();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages(msgs => [...msgs, { from: 'customer', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      // 1. Get agent response
      const res = await axios.post(API_ENDPOINTS.agent.query, { 
        message: userMessage,
        chat_history: messages.map(msg => ({
          role: msg.from === 'customer' ? 'user' : 'assistant',
          content: msg.text
        }))
      });
      setReferencedProducts(res.data.referencedProducts || []);
      setMessages(msgs => [...msgs, { from: 'agent', text: '' }]);

      // 2. Split the message using the backend AI endpoint
      const splitRes = await axios.post(API_ENDPOINTS.utils.splitMessage, {
        agentReply: res.data.agentReply,
        referencedProducts: res.data.referencedProducts || []
      });
      setSplitMessage(splitRes.data);

      // 3. Animate the intro part of the message
      if (splitRes.data.intro) {
        await animateAgentReply(splitRes.data.intro);
      }

      // 4. If there's an outro, animate it after a delay
      if (splitRes.data.outro) {
        setTimeout(async () => {
          await animateAgentReply(splitRes.data.outro);
        }, 1000);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(msgs => [
        ...msgs,
        { from: 'agent', text: 'Lo siento, hubo un error al procesar tu mensaje.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get products by SKUs
  const getProductsBySKUs = (skus) => {
    return referencedProducts.filter(p => skus.includes(p.sku));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <React.Fragment key={idx}>
            <div
              className={`flex ${msg.from === 'customer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[85%] ${
                  msg.from === 'customer'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                {msg.text}
              </div>
            </div>
            {/* After the latest agent message, show split message and product cards */}
            {msg.from === 'agent' && idx === messages.length - 1 && splitMessage && (
              <>
                {/* Product cards */}
                {splitMessage.products && splitMessage.products.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {getProductsBySKUs(splitMessage.products).map(product => (
                      <ProductCard key={product.sku} product={product} />
                    ))}
                  </div>
                )}
              </>
            )}
          </React.Fragment>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 flex items-center">
              <span className="animate-bounce">...</span>
            </div>
          </div>
        )}
      </div>
      <form
        onSubmit={handleSend}
        className="p-4 border-t flex items-center bg-white"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading || animating}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={loading || animating || !input.trim()}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatBox; 