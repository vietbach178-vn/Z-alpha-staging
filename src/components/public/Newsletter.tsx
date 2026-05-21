'use client';

import { useState } from 'react';

interface Dict {
  home: { newsletter: { title: string; lead: string; placeholder: string; submit: string } };
}

interface Props { dict: Dict; muted?: boolean }

export default function Newsletter({ dict, muted = false }: Props) {
  const [email, setEmail] = useState('');

  return (
    <section className={muted ? 'section section--muted' : 'section'}>
      <div className="container">
        <div className="newsletter">
          <div className="newsletter-inner">
            <div>
              <h2>{dict.home.newsletter.title}</h2>
              <p>{dict.home.newsletter.lead}</p>
            </div>
            <form
              className="newsletter-form"
              onSubmit={(e) => { e.preventDefault(); /* TODO: wire to backend */ }}
            >
              <input
                type="email"
                placeholder={dict.home.newsletter.placeholder}
                aria-label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-dark">
                {dict.home.newsletter.submit}
                <i data-lucide="arrow-right" className="icon" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
