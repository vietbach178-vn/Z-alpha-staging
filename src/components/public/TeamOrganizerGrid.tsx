'use client';

import { useState } from 'react';
import type { Lang } from '@/lib/i18n';
import type { FallbackOrganizer } from '@/data/team-sample';
import Modal from './Modal';

interface Props {
  organizers: FallbackOrganizer[];
  lang: Lang;
  closeLabel: string;
}

const TONES = ['teal', 'blue', 'orange'] as const;

/** Tan initials placeholder — matches the researcher/collaborator cards below. */
const placeholder = (initials: string) =>
  `https://placehold.co/300x300/d4b896/1a1a1a?text=${encodeURIComponent(initials)}`;

export default function TeamOrganizerGrid({ organizers, lang, closeLabel }: Props) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const active = activeIdx !== null ? organizers[activeIdx] : null;
  const activeTone = activeIdx !== null ? TONES[activeIdx % TONES.length] : undefined;
  const dialogId = 'team-member-name';

  return (
    <>
      <div className="people-grid">
        {organizers.map((p, idx) => (
          <button
            key={p.initials}
            type="button"
            className="person-card--clickable"
            onClick={() => setActiveIdx(idx)}
            aria-label={`${p.name} — ${p.role[lang]}`}
          >
            <div className="person-photo">
              <img src={p.avatar ?? placeholder(p.initials)} alt={p.name} />
            </div>
            <div className="person-body">
              <p className="person-name">{p.name}</p>
              <p className="person-role">{p.role[lang]}</p>
            </div>
          </button>
        ))}
      </div>

      <Modal
        open={active !== null}
        onClose={() => setActiveIdx(null)}
        labelledBy={dialogId}
        closeAriaLabel={closeLabel}
        tone={activeTone}
      >
        {active && (
          <>
            <div className="modal-dialog__header">
              <div className="modal-dialog__avatar-tile">
                {active.avatar ? (
                  <img src={active.avatar} alt={active.name} />
                ) : (
                  <span aria-hidden="true">{active.initials}</span>
                )}
              </div>
              <div>
                <h3 id={dialogId} className="modal-dialog__name">{active.name}</h3>
                <p className="modal-dialog__role">{active.role[lang]}</p>
              </div>
            </div>

            <div className="modal-dialog__body">
              {active.bio[lang].map((para, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
              ))}
              {active.bullets && active.bullets[lang].length > 0 && (
                <ul className="modal-dialog__bullets">
                  {active.bullets[lang].map((b, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
