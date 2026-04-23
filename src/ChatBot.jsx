import { useEffect, useMemo, useRef, useState } from 'react'

const TOPIC_KEYWORDS = {
  about: {
    hy: ['axiom', 'ընկերություն', 'մեր մասին', 'ով եք', 'ինչ է'],
    en: ['axiom', 'company', 'about', 'who are', 'what is'],
  },
  solar: {
    hy: ['արևային', 'վահանակ', 'սոլար', 'արև'],
    en: ['solar', 'panel', 'photovoltaic', 'pv', 'sun'],
  },
  hydra: {
    hy: ['hydra', 'հիդր', 'ջրա', 'ավտոմատ'],
    en: ['hydra', 'hydraulic', 'water', 'automation', 'logic'],
  },
  location: {
    hy: ['որտեղ', 'հասցե', 'գտնվում', 'երևան', 'աբովյան', 'գրասենյակ'],
    en: ['where', 'address', 'located', 'location', 'office', 'yerevan', 'abovyan'],
  },
  contact: {
    hy: ['կապ', 'հեռախոս', 'մեյլ', 'փոստ', 'ինստագրամ', 'instagram'],
    en: ['contact', 'phone', 'email', 'mail', 'instagram', 'reach', 'call'],
  },
  price: {
    hy: ['գին', 'արժե', 'վճար', 'սակագին', 'գնի', 'քանի'],
    en: ['price', 'cost', 'quote', 'how much', 'pricing', 'fee'],
  },
  warranty: {
    hy: ['երաշխիք', 'վերանորոգում', 'սպասարկում'],
    en: ['warranty', 'guarantee', 'service', 'support', 'maintenance'],
  },
}

const TOPIC_ORDER = ['about', 'solar', 'hydra', 'location', 'contact', 'price', 'warranty']

function matchTopic(text, lang) {
  const lower = text.toLowerCase().trim()
  if (!lower) return null
  for (const topic of TOPIC_ORDER) {
    const keywords = TOPIC_KEYWORDS[topic][lang] || []
    if (keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return topic
    }
  }
  return null
}

function answerFor(topic, t) {
  switch (topic) {
    case 'about':
      return t.chatAnswerAbout
    case 'solar':
      return t.chatAnswerSolar
    case 'hydra':
      return t.chatAnswerHydra
    case 'location':
      return t.chatAnswerLocation
    case 'contact':
      return t.chatAnswerContact
    case 'price':
      return t.chatAnswerPrice
    case 'warranty':
      return t.chatAnswerWarranty
    default:
      return t.chatNoMatch
  }
}

function ChatBot({ t, lang }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(() => [
    { id: 'greet', role: 'bot', text: t.chatGreeting },
  ])
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setMessages([{ id: 'greet', role: 'bot', text: t.chatGreeting }])
  }, [lang, t.chatGreeting])

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, open])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120)
    }
  }, [open])

  const suggestions = useMemo(
    () => [
      { topic: 'about', label: t.chatSuggestionAbout },
      { topic: 'solar', label: t.chatSuggestionSolar },
      { topic: 'hydra', label: t.chatSuggestionHydra },
      { topic: 'location', label: t.chatSuggestionLocation },
      { topic: 'contact', label: t.chatSuggestionContact },
      { topic: 'price', label: t.chatSuggestionPrice },
      { topic: 'warranty', label: t.chatSuggestionWarranty },
    ],
    [t],
  )

  const sendMessage = (text, forcedTopic = null) => {
    const trimmed = text.trim()
    if (!trimmed && !forcedTopic) return
    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed || '',
    }
    const topic = forcedTopic ?? matchTopic(trimmed, lang)
    const botMsg = {
      id: `b-${Date.now() + 1}`,
      role: 'bot',
      text: answerFor(topic, t),
      pending: true,
    }
    setMessages((prev) => [...prev, userMsg, botMsg])
    setInput('')
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === botMsg.id ? { ...m, pending: false } : m)),
      )
    }, 420)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const onSuggestion = (s) => {
    sendMessage(s.label, s.topic)
  }

  return (
    <>
      <button
        type="button"
        className={`chatbot-launcher ${open ? 'chatbot-launcher--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t.chatCloseLabel : t.chatOpenLabel}
        aria-expanded={open}
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      <div
        className={`chatbot-panel ${open ? 'chatbot-panel--open' : ''}`}
        role="dialog"
        aria-label={t.chatTitle}
        aria-hidden={!open}
      >
        <header className="chatbot-header">
          <div>
            <p className="chatbot-title">{t.chatTitle}</p>
            <p className="chatbot-subtitle">{t.chatSubtitle}</p>
          </div>
          <button
            type="button"
            className="chatbot-close"
            onClick={() => setOpen(false)}
            aria-label={t.chatCloseLabel}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </header>

        <div className="chatbot-messages" ref={scrollRef}>
          {messages.map((m) => (
            <div key={m.id} className={`chatbot-msg chatbot-msg--${m.role}`}>
              {m.pending ? (
                <span className="chatbot-typing" aria-label="typing">
                  <span />
                  <span />
                  <span />
                </span>
              ) : (
                m.text
              )}
            </div>
          ))}
        </div>

        <div className="chatbot-suggestions" aria-label={t.chatSuggestionsTitle}>
          {suggestions.map((s) => (
            <button
              type="button"
              key={s.topic}
              className="chatbot-chip"
              onClick={() => onSuggestion(s)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <form className="chatbot-form" onSubmit={onSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="chatbot-input"
            placeholder={t.chatInputPlaceholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="chatbot-send" aria-label={t.chatSend}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </form>
      </div>
    </>
  )
}

export default ChatBot
