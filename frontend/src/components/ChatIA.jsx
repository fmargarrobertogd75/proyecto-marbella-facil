import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import { chatApi } from '../services/api';

const INITIAL_MSG = {
  role: 'assistant',
  content: '¡Hola! Soy tu asistente de Marbella Fácil 🌊 Puedo ayudarte a descubrir playas, restaurantes, transporte, eventos y mucho más. ¿En qué te ayudo?',
};

const ChatIA = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    // Capture current history before state update (excluding initial greeting)
    const apiHistory = [...messages.slice(1), userMsg];

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatApi.send(apiHistory);
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.message }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Lo siento, no pude conectarme ahora mismo. Inténtalo de nuevo en unos segundos.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) sendMessage(e);
  };

  return (
    <>
      {/* Ventana del chat */}
      {open && (
        <div className="chat-ia-window" role="dialog" aria-label="Asistente Marbella Fácil">
          {/* Cabecera */}
          <div className="chat-ia-header">
            <div className="chat-ia-header-info">
              <div className="chat-ia-avatar">
                <Bot size={16} />
              </div>
              <div>
                <div className="chat-ia-header-title">Asistente Marbella</div>
                <div className="chat-ia-header-status">
                  <span className="chat-ia-dot" />
                  En línea
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="chat-ia-close"
              aria-label="Cerrar chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Mensajes */}
          <div className="chat-ia-body">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-ia-row ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="chat-ia-icon-wrap">
                    <Bot size={13} />
                  </div>
                )}
                <div className="chat-ia-bubble">{msg.content}</div>
              </div>
            ))}

            {/* Indicador de escritura */}
            {loading && (
              <div className="chat-ia-row assistant">
                <div className="chat-ia-icon-wrap">
                  <Bot size={13} />
                </div>
                <div className="chat-ia-bubble chat-ia-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Sugerencias rápidas (solo si no hay conversación aún) */}
          {messages.length === 1 && (
            <div className="chat-ia-suggestions">
              {['¿Cuáles son las mejores playas?', '¿Cómo llego a Puerto Banús?', '¿Qué eventos hay esta semana?'].map(s => (
                <button
                  key={s}
                  className="chat-ia-chip"
                  onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 50); }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={sendMessage} className="chat-ia-footer">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta..."
              className="chat-ia-input"
              disabled={loading}
              maxLength={500}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="chat-ia-send"
              aria-label="Enviar mensaje"
            >
              {loading ? <Loader2 size={15} className="chat-ia-spin" /> : <Send size={15} />}
            </button>
          </form>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`chat-ia-toggle ${open ? 'open' : ''}`}
        aria-label={open ? 'Cerrar asistente' : 'Abrir asistente de IA'}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && <span className="chat-ia-toggle-label">¿Necesitas ayuda?</span>}
      </button>
    </>
  );
};

export default ChatIA;
