import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { FaMagic } from 'react-icons/fa';

export default function Home() {

  const WS_URL = "wss://blazy.up.railway.app/chat";

  const [loading, setLoading] = useState(false);
  const [isConnectionOpen, setConnectionOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [status, setStatus] = useState('Ask me anything about Meilisearch.');
  const [answer, setAnswer] = useState('');
  // const [answer, setAnswer] = useState('');
  // const [sources, setSources] = useState([]);

  const ws = useRef();

  const sendMessage = () => {
    if (question === '') {
      return;
    }
    ws.current.send(question);
    setLoading(true);
    setAnswer('');
  }

  const handleChange = (event) => {
    setQuestion(event.target.value);
  };

  useEffect(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log("Connection opened");
      setConnectionOpen(true);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.sender === "bot") {
        if (data.type === "start") {
          setStatus("Blazy is thinking...")
        } else if (data.type === "stream") {
          setStatus("Blazy is typing...")
          setAnswer((prev) => prev + data.message)
        } else if (data.type === "info") {
          setStatus(data.message)
        } else if (data.type === "end") {
          setStatus("Ask me anything about Meilisearch.")
          setLoading(false);
        } else if (data.type === "error") {
          setStatus("Ask me anything about Meilisearch.")
          setLoading(false);
          setAnswer('')
        }
      } else {
        //me getting question back. //UPDATE UI
        return;
      }
    };

    return () => {
      console.log("Cleaning up...");
      ws.current.close();
    };
  }, []);

  const ask = async () => {

    // const settings = {
    //   method: 'GET',
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //   },
    // }

		// try {
    //   setLoading(true);
    //   setAnswer('');
    //   setSources([]);

    //   if (question === '') {
    //     setLoading(false);
    //     setAnswer('Uh oh, ask me a question. 🤔');
    //   }
    //   else {
    //     const res = await fetch(`https://blazy.up.railway.app?question="${question}"`, settings)
    //     const data = await res.json();
    //     setAnswer(data.answer)
    //     setSources(data.sources.filter((str) => str !== ""))
    //     setLoading(false);
    //   }
		// } catch (err) {
		// 	console.log(err);
    //   setLoading(false);
		// }
  };

  const navigation = [
    {
      name: 'Twitter',
      href: 'https://twitter.com/meilisearch',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      href: 'https://github.com/meilisearch/meilisearch',
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
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <main className="main">
          <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto px-6 lg:px-8 flex items-center justify-center text-center">
              <div className="mx-auto max-w-2xl">
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Yo. 🤙
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  {status}
                </p>
              </div>
            </div>
          </div>

          <div>
            {/* {loading && !answer &&
              <div className="mt-1 mb-10 block w-full rounded-md p-5 text-gray-600 bg-gray-100 border-gray-200 text-sm sm:text-md">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-6 py-1">
                    <div className="h-2 bg-gray-300 rounded"></div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-2 bg-gray-300 rounded col-span-2"></div>
                        <div className="h-2 bg-gray-300 rounded col-span-1"></div>
                      </div>
                      <div className="h-2 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            } */}
            {answer &&
              <div className="mt-1 mb-10 block w-full rounded-md p-5 text-gray-600 bg-gray-100 border-gray-200 text-sm sm:text-md">
                <div className="answer leading-6">
                  {<ReactMarkdown children={answer} remarkPlugins={[remarkGfm]} />}
                </div>

                {/* {sources && sources.length > 0 &&
                  <div>
                    <p className="mt-12 text-sm text-gray-500"><strong>Sources:</strong></p>
                    <span>
                      {sources.map((source, i) =>
                        <span className="mr-2">
                          <a key={i} className="mt-2 text-xs text-gray-500 mr-1" target="_blank" href={source.url}>{source.url.split('/').pop()}</a>
                          <span className="inline-flex items-center rounded bg-gray-300 px-1 py-1 text-xs font-medium text-gray-500">
                            {source.score}
                          </span>
                        </span>
                      )}
                    </span>
                  </div>
                } */}
              </div>
            }
            <div className="mt-1">
              <textarea
                rows={4}
                name="question"
                id="question"
                className="block w-full rounded-md border-gray-200 focus:border-indigo-300 focus:ring-indigo-300 sm:text-sm"
                defaultValue={''}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-6 py-3 text-base font-medium text-white hover:bg-indigo-600 focus:outline-none mt-4 mb-4"
            onClick={sendMessage}
          >
            {loading ?
              <><div className="w-4 h-4 rounded-full animate-spin
              border-2 border-solid border-white border-t-transparent"></div>&nbsp; Processing...</>
            :
              <><FaMagic/>&nbsp;Ask</>
            }
          </button>

          <div className="rounded-md bg-yellow-50 p-4 mt-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Answers are provided by a large language model. They are not always accurate and sometimes can be completely wrong. Don't take them too seriously.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
    </div>
	);
}
