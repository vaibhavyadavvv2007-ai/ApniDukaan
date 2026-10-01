import React from 'react';
import { 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Award, 
  ChevronRight,
  Flame,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuestLog({ 
  quests, 
  level, 
  xp, 
  streak, 
  onCompleteQuest 
}) {
  const completedCount = quests.filter(q => q.completed).length;

  const handleClaim = (quest) => {
    if (quest.completed) return;
    onCompleteQuest(quest.id, quest.xp);
    confetti({
      particleCount: 60,
      spread: 75,
      origin: { y: 0.7 },
      colors: ['#F59E0B', '#6366F1', '#10B981']
    });
  };

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
            <Trophy size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Digital Vyapari Quest Engine</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Completed {completedCount}/{quests.length} Business Milestones
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '4px 12px', borderRadius: 'var(--radius-full)', color: '#FDA4AF', fontSize: '0.8rem', fontWeight: 700 }}>
            <Flame size={16} color="#F43F5E" /> {streak} Day Streak
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '4px 12px', borderRadius: 'var(--radius-full)', color: '#A5B4FC', fontSize: '0.8rem', fontWeight: 700 }}>
            <Star size={16} color="#6366F1" /> Level {level} Merchant
          </div>
        </div>
      </div>

      {/* Quests List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {quests.map((quest) => (
          <div
            key={quest.id}
            style={{
              background: quest.completed ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.02)',
              border: quest.completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
              <div style={{ paddingTop: '2px', color: quest.completed ? '#10B981' : 'var(--text-muted)' }}>
                {quest.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: quest.completed ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: quest.completed ? 'line-through' : 'none' }}>
                    {quest.title}
                  </span>
                  <span className="badge badge-brand" style={{ fontSize: '0.65rem' }}>
                    {quest.category}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                  {quest.desc}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#FCD34D', fontSize: '0.85rem', fontWeight: 700 }}>
                +{quest.xp} XP
              </span>
              <button
                onClick={() => handleClaim(quest)}
                disabled={quest.completed}
                className={quest.completed ? "btn btn-ghost" : "btn btn-primary"}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                {quest.completed ? 'Completed ✓' : 'Complete Quest'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
