'use client';
import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colourways } from '@/data/colourways';

// TODO: swap this for a real Formspree (formspree.io) or Resend endpoint
// once one is set up — the form already POSTs JSON to it. Until then (or if
// the request fails for any reason) we fall back to a prefilled mailto so
// no enquiry is ever silently lost.
const FORM_ENDPOINT = 'https://formspree.io/f/REPLACE_ME';
// TODO: swap the mailto address below for a real Chromatic Linen / Beacon
// Laundry contact once one is confirmed — placeholder for now.
const CONTACT_EMAIL = 'hello@beaconlaundry.com.au';

const VOLUME_OPTIONS = ['Under 50 items / month', '50–200 items / month', '200–500 items / month', '500+ items / month'];

type Status = 'idle' | 'sending' | 'success' | 'fallback' | 'error';

export default function EnquirePage() {
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [interested, setInterested] = useState<string[]>([]);
  const [volume, setVolume] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  function toggleColourway(id: string) {
    setInterested((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');

    const colourLabel = colourways
      .filter((c) => interested.includes(c.id))
      .map((c) => c.name)
      .join(', ');

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          contactName,
          email,
          colourways: colourLabel || 'Not specified',
          volume: volume || 'Not specified',
          message,
        }),
      });
      if (!res.ok) throw new Error('Form endpoint not configured');
      setStatus('success');
    } catch {
      const body = encodeURIComponent(
        `Business: ${businessName}\nContact: ${contactName}\nEmail: ${email}\nColourways of interest: ${
          colourLabel || 'Not specified'
        }\nEstimated volume: ${volume || 'Not specified'}\n\n${message}`
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        'Chromatic Linen Enquiry'
      )}&body=${body}`;
      setStatus('fallback');
    }
  }

  const fieldLabel = 'font-sans text-[10px] tracking-[0.25em] uppercase text-parchment/45';
  const fieldInput =
    'w-full bg-transparent border-0 border-b border-parchment/15 focus:border-teal outline-none py-2.5 font-sans text-sm text-parchment placeholder:text-parchment/25 transition-colors duration-500';

  return (
    <div className="w-full min-h-screen px-6 md:px-24 pt-32 pb-32 flex flex-col gap-12 max-w-2xl">
      <div className="flex flex-col gap-4">
        <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-parchment/40">
          Enquire
        </p>
        <h1 className="font-serif text-3xl md:text-4xl tracking-wide text-parchment">
          Stock Chromatic Linen at your property
        </h1>
        <p className="font-sans text-sm leading-relaxed text-parchment/70">
          Chromatic Linen is currently moving from pilot to first supply
          through Byron Bay Holiday Hire. If you run a BnB, boutique motel,
          caravan park or holiday rental in the Northern Rivers and want to
          get on the list — or you&rsquo;re a partner, funder or media
          contact wanting to know more — tell us a little about your
          property below.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {status === 'success' || status === 'fallback' ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3 py-10 border-t border-parchment/10"
          >
            <p className="font-serif text-xl text-parchment">
              {status === 'success' ? 'Enquiry received.' : 'Your mail app should now be open.'}
            </p>
            <p className="font-sans text-sm text-parchment/60 leading-relaxed">
              {status === 'success'
                ? "Thank you — we'll follow up shortly with swatch options and next steps."
                : 'We pre-filled an email with everything you entered. Send it through and we will follow up shortly.'}
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              <div className="flex flex-col gap-2">
                <label className={fieldLabel} htmlFor="businessName">
                  Property / business name
                </label>
                <input
                  id="businessName"
                  className={fieldInput}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Driftwood Bungalows"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={fieldLabel} htmlFor="contactName">
                  Your name
                </label>
                <input
                  id="contactName"
                  className={fieldInput}
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="First and last name"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={fieldLabel} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={fieldInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@property.com.au"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <span className={fieldLabel}>Colourways you&rsquo;re interested in</span>
              <div className="flex flex-wrap gap-4 pt-1">
                {colourways.map((c) => {
                  const active = interested.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleColourway(c.id)}
                      className="flex flex-col items-center gap-2 group"
                      aria-pressed={active}
                    >
                      <motion.span
                        className="block w-8 h-8 rounded-full border"
                        style={{
                          backgroundColor: c.hex,
                          borderColor: active ? 'rgba(229,225,247,0.9)' : 'rgba(229,225,247,0.15)',
                        }}
                        animate={{ scale: active ? 1.12 : 1 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      />
                      <span
                        className={`font-sans text-[9px] tracking-[0.15em] uppercase transition-colors duration-300 ${
                          active ? 'text-parchment/85' : 'text-parchment/35 group-hover:text-parchment/60'
                        }`}
                      >
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={fieldLabel} htmlFor="volume">
                Estimated monthly volume
              </label>
              <select
                id="volume"
                className={`${fieldInput} appearance-none cursor-pointer`}
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
              >
                <option value="" className="bg-void">
                  Select a range
                </option>
                {VOLUME_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-void">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className={fieldLabel} htmlFor="message">
                Anything else? (optional)
              </label>
              <textarea
                id="message"
                rows={3}
                className={`${fieldInput} resize-none`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Custom colour match, delivery area, timing..."
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-2 font-sans text-[11px] tracking-[0.3em] uppercase text-parchment/80 border border-parchment/30 px-8 py-3 self-start hover:border-teal hover:text-teal transition-colors duration-500 disabled:opacity-40"
            >
              {status === 'sending' ? 'Sending…' : 'Send enquiry'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-2 pt-6 border-t border-parchment/10">
        <p className="font-sans text-xs tracking-[0.15em] uppercase text-parchment/50">
          Want a custom colour match for your property?
        </p>
        <p className="font-sans text-sm text-parchment/65 leading-relaxed">
          Bespoke colour runs are available for boutique operators with a
          strong design identity — select your closest match above and
          mention it in your message, and we&rsquo;ll follow up with swatch
          options.
        </p>
      </div>

      <div className="flex flex-col gap-2 pt-6 border-t border-parchment/10">
        <p className="font-sans text-xs tracking-[0.15em] uppercase text-parchment/50">
          Distributed by
        </p>
        <p className="font-sans text-sm text-parchment/65">
          Byron Bay Holiday Hire — servicing Byron Bay, Ballina, Lennox
          Head &amp; Kingscliff
        </p>
      </div>
    </div>
  );
}
