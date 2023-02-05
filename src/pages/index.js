import { useState } from "react";
import CommandBar from "@/components/CommandBar";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);

  const handleChange = (event) => {
    setQuestion(event.target.value);
  };

  const ask = async () => {
    const settings = {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
    try {
      setLoading(true);
      setAnswer("");
      setSources([]);
      const res = await fetch(
        `https://blazy.up.railway.app?question="${question}"`,
        settings
      );
      const data = await res.json();
      setAnswer(data.answer);
      setSources(data.sources.filter((str) => str !== ""));
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const navigation = [
    {
      name: "Twitter",
      href: "https://twitter.com/meilisearch",
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      href: "https://github.com/meilisearch/meilisearch",
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
      <div className="mx-auto max-w-3xl">
        <main className="main">
          <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:text-center">
                <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-500 mb-5">
                  🧪 Work In Progress
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Hi, I'm Blazy.
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  I spent some time studying Meilisearch's documentation and I'm
                  ready to answer your questions.
                </p>
              </div>
            </div>
          </div>
          <CommandBar />

          <div>
            <div className="mt-1 mb-10 block w-full rounded-md border-gray-200 sm:text-md">
              <div className="answer">{answer}</div>

              {sources && sources.length > 0 && (
                <div>
                  <p className="mt-10 text-sm text-gray-500">Sources:</p>
                  <span>
                    {sources.map((ref, i) => (
                      <a
                        key={i}
                        className="mt-2 text-xs text-gray-500 mr-2"
                        target="_blank"
                        href={ref}
                      >
                        {ref.split("/").pop()}
                      </a>
                    ))}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-1">
              <label
                htmlFor="question"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ask me anything about <strong>Meilisearch!</strong>
              </label>
              <textarea
                rows={4}
                name="question"
                id="question"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                defaultValue={""}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-4 mb-4"
            onClick={ask}
          >
            {loading ? <>Bipbop...</> : <>Ask</>}
          </button>
        </main>

        <footer className="bg-white border-t border-gray-900/10 mt-10">
          <div className="mx-auto max-w-7xl py-12 px-6 md:flex md:items-center md:justify-between lg:px-8">
            <div className="flex content-evenly space-x-6 md:order-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
            <div className="mt-8 md:order-1 md:mt-0">
              <p className="text-center text-xs leading-5 text-gray-500">
                &copy; 2023 Meilisearch
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
