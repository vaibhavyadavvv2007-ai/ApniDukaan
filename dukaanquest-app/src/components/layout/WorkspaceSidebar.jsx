import {
  Store,
  Package,
  Sparkles,
  Globe,
  MessageSquare,
  Calculator,
  CreditCard,
  Languages,
  Camera,
  X,
  Layers,
  ChevronRight
} from 'lucide-react';
import { NAV, navLabel } from '../../data/workspace';
import { useTranslation } from '../../i18n/TranslationProvider';

const ICONS = {
  store: Store,
  sparkles: Sparkles,
  camera: Camera,
  globe: Globe,
  message: MessageSquare,
  calculator: Calculator,
  package: Package,
  card: CreditCard
};

export default function WorkspaceSidebar({
  navOpen,
  activeTab,
  onNavigate,
  onClose,
  profile,
  level,
  xp,
  nextQuest,
  currentLang,
  onLanguageChange,
  backendOnline,
  healthCounts,
  integrations,
  t
}) {
   const { tx } = useTranslation();
  return (
    <aside className={`sidebar${navOpen ? ' sidebar-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-mark" aria-hidden="true"><Store size={20} /></div>
        <div>
          <span className="brand-name">apni<span className="brand-accent">dukaan</span></span>
          <span className="brand-sub">{profile.location}</span>
        </div>
        <button className="mobile-close btn btn-quiet" aria-label={tx('Close navigation')} onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="shop-identity">
        <span className="shop-avatar" aria-hidden="true">SG</span>
        <div>
          <strong>{profile.shopName.split(' ').slice(0, 2).join(' ')}</strong>
          <span>{profile.category}</span>
        </div>
        <ChevronRight size={15} />
      </div>

      <p className="nav-caption">WORKSPACE</p>

      <nav className="sidebar-nav" aria-label={tx('Primary')}>
        {NAV.map(item => {
          const Icon = ICONS[item.icon];
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-item${active ? ' nav-item-active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={16} />
              <span>{navLabel(item, t)}</span>
              {active && <span className="nav-active-dot" />}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-foot">
        <div className="level-block">
          <div className="level-row">
            <span className="level-name">
              {level === 3 ? 'Digital Vyapari' : 'Mohalla Merchant'}
            </span>
            <span className="level-xp mono">{xp}/600</span>
          </div>
          <div
            className="track level-track"
            role="progressbar"
            aria-valuenow={Math.min(xp, 600)}
            aria-valuemin={0}
            aria-valuemax={600}
            aria-label={tx('Experience toward the next level')}
          >
            <div className="track-fill" style={{ transform: `scaleX(${Math.min(1, xp / 600)})` }} />
          </div>
          <p className="meta level-sub">
            {level === 3 ? 'Top level reached' : `${600 - xp} XP to Digital Vyapari`}
          </p>
          {nextQuest && (
            <div className="level-next">
              <span className="level-next-label">{tx('Next milestone')}</span>
              <span className="level-next-title">{nextQuest.title}</span>
              <span className="level-next-xp mono">+{nextQuest.xp} XP</span>
            </div>
          )}
        </div>

        <div className="lang-field">
          <Languages size={15} />
          <select
            value={currentLang}
            onChange={(e) => onLanguageChange(e.target.value)}
            aria-label={tx('Interface language')}
          >
            <option value="en">{tx('English')}</option>
            <option value="hi">हिंदी</option>
            <option value="kn">ಕನ್ನಡ</option>
            <option value="ta">தமிழ்</option>
          </select>
        </div>

        <details className="integrations">
          <summary>
            <span className={`conn-dot${backendOnline ? ' conn-live' : ''}`} />
            {backendOnline ? 'Systems connected' : 'Local data'}
          </summary>
          {healthCounts && (
            <p className="meta integration-counts">
              {healthCounts.LIVE} live, {healthCounts.SANDBOX} sandbox,{' '}
              {healthCounts.STAGED} staged, {healthCounts.FALLBACK} fallback
            </p>
          )}
          <ul>
            {integrations.map(i => (
              <li key={i.name}>
                <span>{i.name}</span>
                <span className={`mono meta conn-state conn-state-${i.state.toLowerCase()}`}>{i.state}</span>
              </li>
            ))}
          </ul>
        </details>

        <p className="meta"><Layers size={13} />ApniDukaan · HackSprint prototype</p>
      </div>
    </aside>
  );
}