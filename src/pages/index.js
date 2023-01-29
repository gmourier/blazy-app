import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleChange = (event) => {
    setQuestion(event.target.value);
  };

  const ask = async () => {

    const settings = {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }
		try {
      setLoading(true);
      setAnswer('');
			const res = await fetch(`https://blazy.up.railway.app?question="${question}"`, settings)
			const data = await res.json();
			console.log(data);
      setAnswer(data.answer)
      setLoading(false);
		} catch (err) {
			console.log(err);
      setLoading(false);
		}
  };

	return (
		<div className="container">
			<main className="main">
        <div>
          <div className="answer">
            {answer}
          </div>
        </div>
        <div>
          <input className="question" type="text" id="question" name="question" placeholder="What is Meilisearch?" autocomplete="off" onChange={handleChange} />
        </div>
        <button className="button" onClick={ask}>{loading ? <>🏃‍♂️ Let me think...</> : <>⚡️ Ask Blazy!</>}</button>
			</main>
		</div>
	);
}
