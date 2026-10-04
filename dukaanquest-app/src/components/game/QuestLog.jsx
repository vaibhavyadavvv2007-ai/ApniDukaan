import React from 'react';
import { CheckCircle2, Circle, Flame, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTranslation } from '../../i18n/TranslationProvider';

const CONFETTI_COLORS = ['#E8A33D', '#F2C179', '#7BB88F'];

export default function QuestLog({ 
  quests, 
  level, 
  xp, 
  streak, 
  onCompleteQuest 
}) {
   const { tx } = useTranslation();
  const completedCount = quests.filter(q => q.completed).length;
  const nextQuest = quests.find(q => !q.completed);

  const handleClaim = (quest) => {
    if (quest.completed) return;
    onCompleteQuest(quest.id, quest.xp);
    confetti({
      particleCount: 60,
      spread: 75,
      origin: { y: 0.7 },
      colors: CONFETTI_COLORS
    });
  };

  return (
    <section>
      <div className="section-head">
        <div>
          <h2>{tx('Milestones')}</h2>
          <p className="meta" style={{ marginTop: 2 }}>
            {nextQuest
              ? `Next: ${nextQuest.title}`
              : 'Every milestone complete'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="meta" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Flame size={13} color="var(--text-3)" /> {streak} day streak
          </span>
          <span className="meta mono">{completedCount}/{quests.length}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {quests.map((quest) => (
          <div
            key={quest.id}
            className="row"
            style={{
              opacity: quest.completed ? 0.62 : 1,
              paddingTop: 14,
              paddingBottom: 14
            }}
          >
            <span style={{ color: quest.completed ? 'var(--ok)' : 'var(--text-3)', flexShrink: 0 }}>
              {quest.completed ? <CheckCircle2 size={17} /> : <Circle size={17} />}
            </span>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: quest.completed ? 'var(--text-3)' : 'var(--text)',
                textDecoration: quest.completed ? 'line-through' : 'none'
              }}>
                {quest.title}
              </p>
              <p className="meta" style={{ marginTop: 2 }}>{quest.desc}</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
              <span className="mono meta" style={{ color: 'var(--text-3)' }}>
                +{quest.xp} XP
              </span>
              <button
                onClick={() => handleClaim(quest)}
                disabled={quest.completed}
                className={quest.completed ? 'btn btn-quiet btn-sm' : 'btn btn-secondary btn-sm'}
              >
                {quest.completed ? 'Done' : 'Complete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}