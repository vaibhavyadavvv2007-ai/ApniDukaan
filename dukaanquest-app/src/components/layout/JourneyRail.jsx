import { Check } from 'lucide-react';
import { JOURNEY } from '../../data/workspace';

export default function JourneyRail({ stepDone, activeTab, onNavigate, doneCount }) {
  const journeyIndex = JOURNEY.findIndex(s => s.id === activeTab);

  return (
    <section className="journey" aria-label="Golden journey">
      <div className="journey-head">
        <div className="journey-head-text">
          <h2 className="journey-title">From photo to profit</h2>
          <p className="meta">{doneCount} of {JOURNEY.length} engines running</p>
        </div>
        <div className="journey-score">
          <span className="journey-score-value">
            {doneCount}<span className="journey-score-of">/{JOURNEY.length}</span>
          </span>
          <span className="journey-score-label">steps done</span>
        </div>
      </div>

      <div className="journey-rail" aria-hidden="true">
        <div className="journey-rail-fill" style={{ transform: `scaleX(${doneCount / JOURNEY.length})` }} />
      </div>

      <ol className="journey-track">
        {JOURNEY.map((step, i) => {
          const done = stepDone(step);
          const current = i === journeyIndex;
          return (
            <li key={step.id} className="journey-step">
              <button
                onClick={() => onNavigate(step.id)}
                className={`journey-node${current ? ' is-current' : ''}${done ? ' is-done' : ''}`}
                aria-current={current ? 'step' : undefined}
              >
                <span className="journey-mark">
                  {done ? <Check size={13} strokeWidth={2.5} /> : <span className="mono">{i + 1}</span>}
                </span>
                <span className="journey-text">
                  <span className="journey-label">{step.label}</span>
                  <span className="journey-detail">{done ? step.gain : step.detail}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}