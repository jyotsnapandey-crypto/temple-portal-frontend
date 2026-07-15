import { useState, useRef, useEffect } from 'react';

const TempleChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '🙏 Namaste! I am your Temple Heritage Guide. Ask me anything about Indian temples, pilgrimages, rituals, or plan your next spiritual journey!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://temple-portal-backend-production.up.railway.app/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
  })
});

const data = await response.json();
const assistantMessage = {
  role: 'assistant',
  content: data.reply || 'I apologize, I could not process that. Please try again.'
};
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '🙏 Sorry, I am having trouble connecting. Please try again in a moment.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'Best temples to visit in Varanasi?',
    'What is the significance of Tirupati?',
    'Plan a 3-day pilgrimage in South India',
    'Dress code for temple visits?',
  ];

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
          style={{
            width: 360,
            height: 520,
            background: '#fff',
            border: '1.5px solid rgba(255,160,50,0.3)',
            boxShadow: '0 20px 60px rgba(120,30,0,0.25), 0 0 0 1px rgba(255,160,50,0.1)',
          }}>

          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #4A0E0E, #B5390A)' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                style={{ background: 'rgba(255,255,255,0.15)' }}>🛕</div>
              <div>
                <div className="text-white font-semibold text-sm">Temple Guide AI</div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-orange-200 text-xs">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}
              className="text-orange-200 hover:text-white transition-colors text-lg">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #fff 100%)' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-1"
                    style={{ background: 'linear-gradient(135deg, #7B1F1F, #B5390A)' }}>🛕</div>
                )}
                <div className="max-w-xs px-3 py-2 rounded-2xl text-sm leading-relaxed"
                  style={msg.role === 'user' ? {
                    background: 'linear-gradient(135deg, #7B1F1F, #B5390A)',
                    color: 'white',
                    borderBottomRightRadius: 4,
                  } : {
                    background: 'white',
                    color: '#3d2c2c',
                    border: '1px solid rgba(255,160,50,0.2)',
                    borderBottomLeftRadius: 4,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7B1F1F, #B5390A)' }}>🛕</div>
                <div className="px-4 py-3 rounded-2xl bg-white border border-orange-100 flex items-center gap-1"
                  style={{ borderBottomLeftRadius: 4 }}>
                  <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => setInput(s)}
                  className="text-xs px-2.5 py-1 rounded-full transition-all hover:scale-105"
                  style={{ background: 'rgba(255,160,50,0.1)', border: '1px solid rgba(255,160,50,0.3)', color: '#7B1F1F' }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-orange-100 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about temples..."
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
              style={{ background: '#FFF8F0' }}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}
              className="px-3 py-2 rounded-xl text-white text-sm font-medium transition-all hover:scale-105 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #7B1F1F, #B5390A)' }}>
              {loading ? '...' : '➤'}
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110"
        style={{
          background: 'linear-gradient(135deg, #7B1F1F, #B5390A)',
          boxShadow: '0 4px 20px rgba(180,50,0,0.5), 0 0 0 3px rgba(255,160,50,0.2)',
          animation: isOpen ? 'none' : 'pulse-btn 2.5s ease-in-out infinite',
        }}>
        {isOpen ? '✕' : '🛕'}
      </button>

      <style>{`
        @keyframes pulse-btn {
          0%, 100% { box-shadow: 0 4px 20px rgba(180,50,0,0.5), 0 0 0 3px rgba(255,160,50,0.2); }
          50%       { box-shadow: 0 4px 30px rgba(180,50,0,0.7), 0 0 0 8px rgba(255,160,50,0.1); }
        }
      `}</style>
    </>
  );
};

export default TempleChat;