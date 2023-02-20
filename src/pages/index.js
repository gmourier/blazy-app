import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { FaMagic } from 'react-icons/fa';
import { GiPlug, GiUnplugged } from 'react-icons/gi';
import Alert from '../components/Alert';

export default function Home() {

  const WS_URL = "wss://blazy.up.railway.app/chat";

  const [loading, setLoading] = useState(false);
  const [isConnectionOpen, setConnectionOpen] = useState(false);
  const [status, setStatus] = useState('Ask me anything about Meilisearch.');
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [answer, setAnswer] = useState('');

  const ws = useRef();
  const messageHistory = useRef(null);
  const questionInput = useRef(null);

  const handleChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }

    if (question === '') {
      return;
    }
  }

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
      event.preventDefault()
    }

    if (question === '') {
      return;
    }
  }

  const sendMessage = () => {
    if (question === '') {
      return;
    }

    if (answer != '') {
      setMessages((prev) => prev.concat({"sender": "bot", "text": answer}))
      setAnswer('');
    }

    setMessages((prev) => prev.concat({"sender": "you", "text": question}))

    ws.current.send(question);
    setLoading(true);
    setQuestion();
    setDisabled(true);
  }

  useEffect(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      setConnectionOpen(true);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.sender === "bot") {
        if (data.type === "start") {
          setAnswer('')
          setQuestion('')
          setStatus("Thinking...")
          setDisabled(true)
        } else if (data.type === "stream") {
          setStatus("Typing...")
          setAnswer((prev) => prev + data.message)
          setDisabled(true)
        } else if (data.type === "info") {
          setStatus(data.message)
        } else if (data.type === "end") {
          setStatus("Ask me anything about Meilisearch.")
          setLoading(false);
          setDisabled(false);
        } else if (data.type === "error") {
          setStatus("Ask me anything about Meilisearch.")
          setLoading(false);
          setAnswer('')
          setDisabled(false)
        }
      }

      // Scroll to the bottom of the chat
      messageHistory.current?.scrollIntoView({ behavior: 'smooth' })
    };

    return () => {
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    questionInput.current?.focus();
  }, []);

  useEffect(() => {
    messageHistory.current?.scrollIntoView({behavior: 'smooth'});
  }, []);

  const navigation = [
    {
      name: 'Twitter',
      href: 'https://twitter.com/gmourier',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      href: 'https://github.com/gmourier',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    }
  ]

	return (
    <div className="bg-gray-900 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 flex flex-col h-screen">
      <Alert />
      <div className="flex-1 overflow-auto scrollbar-hide">
          {messages.map((message, i) =>
            <>
              { message.sender === "you" &&
                <div className="mt-1 mb-5 block w-4/5 ml-auto text-white bg-gradient-to-r from-purple-500 to-pink-500 font-medium rounded-lg text-sm px-5 py-2.5">
                  <p>{message.text}</p>
                </div>
              }
              { message.sender === "bot" &&
                <div className="mt-1 mb-10 block w-4/5 text-white bg-gradient-to-br from-pink-500 to-orange-400 font-medium rounded-lg text-sm px-5 py-2.5">
                  <p className="answer leading-6">{<ReactMarkdown children={message.text} remarkPlugins={[remarkGfm]} />}</p>
                </div>
              }
            </>
          )}
          {answer &&
            <div className="mt-1 mb-10 block w-4/5 text-white bg-gradient-to-br from-pink-500 to-orange-400 font-medium rounded-lg text-sm px-5 py-2.5">
              <p className="answer leading-6"><ReactMarkdown children={answer} remarkPlugins={[remarkGfm]} /></p>
            </div>
          }
          <div className="mt-20" ref={messageHistory} />
      </div>

      <div className="sticky inset-x-0 bottom-8 mt-10">
        <div className="mt-4">
          <div className="flex mb-2">
            <div className="text-gray-700 text-right mr-auto font-semibold text-xs sm:text-md">
              {isConnectionOpen ?
                <span className="text-green-500 inline-flex"><GiPlug />&nbsp;Connected</span>
              :
              <span className="text-red-500 inline-flex"><GiUnplugged />&nbsp;Disconnected</span>
              }
            </div>
            <div className="text-gray-400 text-right ml-auto font-semibold text-sm sm:text-md">{status}</div>
          </div>
          <textarea
            rows={1}
            name="question"
            id="question"
            className="block w-full rounded-md text-white bg-gray-800 border-gray-700  focus:border-purple-500 focus:to-pink-500 focus:ring-purple-500 sm:text-sm"
            value={question}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            ref={questionInput}
            disabled={disabled}
          />
          <button
            type="button"
            className={`inline-flex items-center text-white bg-gradient-to-r from-purple-500 to-pink-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4`}
            onClick={sendMessage}
            disabled={loading | !question}
          >
            {loading ?
              <><div className="w-4 h-4 rounded-full animate-spin
              border-2 border-solid border-white border-t-transparent"></div>&nbsp; Processing...</>
            :
              <><FaMagic/>&nbsp;Ask</>
            }
          </button>
        </div>
      </div>
    </div>
	);
}
