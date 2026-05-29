'use client';

import { useState } from 'react';
import type { Lang } from '@/lib/i18n';
import type { FallbackOrganizer } from '@/data/team-sample';
import Modal from './Modal';

interface Props {
  organizers: FallbackOrganizer[];
  lang: Lang;
  closeLabel: string;
  pastRolesLabel: string;
  highlightsLabel: string;
}

const TONES = ['teal', 'blue', 'orange'] as const;
const ROLE_ICONS = ['briefcase', 'building-2', 'landmark'] as const;

export default function TeamOrganizerGrid({ organizers, lang, closeLabel, pastRolesLabel, highlightsLabel }: Props) {
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
              {p.avatar ? (
                <img src={p.avatar} alt={p.name} />
              ) : (
                <div className="modal-dialog__avatar-tile" style={{ width: '100%', height: '100%', borderRadius: 0, border: 0 }} aria-hidden="true">
                  {p.initials}
                </div>
              )}
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
            </div>

            {active.highlights && active.highlights.length > 0 && (
              <>
                <hr className="modal-dialog__rule" />
                <p className="modal-dialog__past-h">
                  <span className="modal-dialog__past-pip" aria-hidden="true">
                    <i data-lucide="graduation-cap" className="icon-sm" />
                  </span>
                  {highlightsLabel}
                </p>
                <ul className="bullet-list">
                  {active.highlights.map((h, i) => (
                    <li key={i} className="bullet-item">
                      <span className="glyph" aria-hidden="true">
                        <i data-lucide={h.icon} className="icon" />
                      </span>
                      <p dangerouslySetInnerHTML={{ __html: h.text[lang] }} />
                    </li>
                  ))}
                </ul>
              </>
            )}

            {active.bullets && active.bullets[lang].length > 0 && (
              <>
                <hr className="modal-dialog__rule" />
                <p className="modal-dialog__past-h">
                  <span className="modal-dialog__past-pip" aria-hidden="true">
                    <i data-lucide="briefcase" className="icon-sm" />
                  </span>
                  {pastRolesLabel}
                </p>
                <ul className="bullet-list">
                  {active.bullets[lang].map((b, i) => (
                    <li key={i} className="bullet-item">
                      <span className="glyph" aria-hidden="true">
                        <i data-lucide={ROLE_ICONS[i % ROLE_ICONS.length]} className="icon" />
                      </span>
                      <p dangerouslySetInnerHTML={{ __html: b }} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </Modal>
    </>
  );
}
