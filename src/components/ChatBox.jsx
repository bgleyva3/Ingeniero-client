import React, { useState, useRef } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

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
      const res = await axios.post('/api/agent/query', { message: userMessage });
      setReferencedProducts(res.data.referencedProducts || []);
      setMessages(msgs => [...msgs, { from: 'agent', text: '' }]);

      // 2. Split the message using the backend AI endpoint
      const splitRes = await axios.post('/api/utils/split-agent-message', {
        agentReply: res.data.agentReply,
        referencedProducts: res.data.referencedProducts || []
      });
      setSplitMessage(splitRes.data);

      // 3. Animate the intro (optional)
      await animateAgentReply(splitRes.data.intro || '...');
    } catch (err) {
      setMessages(msgs => [
        ...msgs,
        { from: 'agent', text: 'Lo siento, hubo un error. Intenta de nuevo.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get product objects by SKU
  const getProductsBySKUs = (skus) => {
    if (!referencedProducts || !skus) return [];
    return referencedProducts.filter(p =>
      skus.includes(Number(p.sku)) || skus.includes(String(p.sku))
    );
  };

  return (
    <div className="flex flex-col h-full bg-red">
      <div className="p-4 bg-blue-500 text-white">
        <h2 className="text-xl font-semibold">Chatea con el Ingeniero Gonzalez</h2>
      </div>
      <div className="flex-1 p-4 space-y-4 bg-gray-50 overflow-y-auto">
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
                {/* Product cards (optional, remove if you don't want them) */}
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
          className="flex-1 border rounded-lg px-4 py-3 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading || animating}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors"
          disabled={loading || animating}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatBox; 