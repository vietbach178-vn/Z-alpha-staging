'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export interface FilterChip {
  id: string;          // empty string = "All"
  label: string;
  tone?: string;       // visual hint, optional
}

interface Dict {
  filterAll: string;
  searchPlaceholder: string;
  searchLabel: string;
  filterLabel: string;
  noResults: string;
  clearFilters: string;
}

interface Props {
  paramName: 'topic' | 'cat' | 'category';      // URL param key
  chips: FilterChip[];             // excluding the "All" chip (added automatically)
  dataAttr: 'data-topic' | 'data-category';
  dict: Dict;
}

/**
 * Renders filter chips + search input + empty state. Filters in-place by
 * toggling `hidden` on cards that already exist in the DOM (rendered server-side).
 * Each card MUST have `data-card`, the configured `dataAttr`, and `data-search`.
 */
export default function FilterToolbar({ paramName, chips, dataAttr, dict }: Props) {
  const router = useRouter();
  const pathname = usePathname() ?? '/';
  const searchParams = useSearchParams();

  const initialFilter = searchParams?.get(paramName) ?? '';
  const initialQ = searchParams?.get('q') ?? '';

  const [filter, setFilter] = useState(initialFilter);
  const [q, setQ] = useState(initialQ);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allChips: FilterChip[] = useMemo(
    () => [{ id: '', label: dict.filterAll }, ...chips],
    [chips, dict.filterAll]
  );

  // Sync URL whenever filter or q changes
  useEffect(() => {
    const url = new URL(window.location.href);
    if (filter) url.searchParams.set(paramName, filter); else url.searchParams.delete(paramName);
    if (q) url.searchParams.set('q', q); else url.searchParams.delete('q');
    router.replace(`${pathname}${url.search ? `?${url.searchParams.toString()}` : ''}`, { scroll: false });
  }, [filter, q, paramName, pathname, router]);

  // Apply filter to DOM cards
  useEffect(() => {
    const grid = document.querySelector('[data-filter-grid]');
    const empty = document.querySelector('[data-filter-empty]');
    if (!grid) return;

    const qLower = q.trim().toLowerCase();
    const cards = grid.querySelectorAll<HTMLElement>('[data-card]');
    let visible = 0;

    cards.forEach((card) => {
      const cardVal = card.getAttribute(dataAttr) ?? '';
      const cardSearch = (card.getAttribute('data-search') ?? '').toLowerCase();
      const matchFilter = !filter || cardVal === filter;
      const matchQ = !qLower || cardSearch.includes(qLower);
      const show = matchFilter && matchQ;
      card.hidden = !show;
      if (show) visible++;
    });

    if (empty) (empty as HTMLElement).hidden = visible > 0;
    (grid as HTMLElement).hidden = visible === 0;
  }, [filter, q, dataAttr]);

  function onQInput(v: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setQ(v), 120);
  }

  function clear() {
    setFilter('');
    setQ('');
    const input = document.getElementById('filter-search-input') as HTMLInputElement | null;
    if (input) input.value = '';
  }

  return (
    <>
      <div className="research-toolbar" role="region" aria-label={dict.filterLabel}>
        <div className="filter-chips" role="tablist" aria-label={dict.filterLabel}>
          {allChips.map((chip) => (
            <button
              key={chip.id || 'all'}
              type="button"
              className={`filter-chip${filter === chip.id ? ' is-active' : ''}`}
              data-tone={chip.tone ?? 'neutral'}
              aria-selected={filter === chip.id}
              onClick={() => setFilter(chip.id)}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div className="research-search">
          <i data-lucide="search" className="icon-sm research-search__icon" aria-hidden="true" />
          <input
            id="filter-search-input"
            type="search"
            placeholder={dict.searchPlaceholder}
            aria-label={dict.searchLabel}
            autoComplete="off"
            defaultValue={initialQ}
            onChange={(e) => onQInput(e.target.value)}
          />
        </div>
      </div>

      <div className="research-empty" data-filter-empty hidden>
        <i data-lucide="search-x" className="icon-2xl" aria-hidden="true" />
        <p>{dict.noResults}</p>
        <button type="button" className="btn btn-outline" onClick={clear}>
          {dict.clearFilters}
        </button>
      </div>
    </>
  );
}
