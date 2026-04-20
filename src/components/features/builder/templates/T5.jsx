import SHead from '../preview/SHead';
import ExpBlock from '../preview/blocks/ExpBlock';
import ProjsBlock from '../preview/blocks/ProjsBlock';
import EduBlock from '../preview/blocks/EduBlock';
import CertsBlock from '../preview/blocks/CertsBlock';
import { SF } from '../../../../constants/builder.constants';

export default function T5({ d }) {
  const acc = '#e63946';
  return (
    <div style={{ fontFamily: SF, background: '#fff', fontSize: 9, minHeight: '100%' }}>
      <div style={{ padding: '16px 20px 12px', borderTop: `3px solid ${acc}` }}>
        <div style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.3px' }}>{d.fullName || 'YOUR NAME'}</div>
        <div style={{ fontSize: 9, fontWeight: 600, color: acc, textTransform: 'uppercase', letterSpacing: '1.5px', margin: '3px 0' }}>{d.targetJobTitle}</div>
        <div style={{ fontSize: 8, color: '#666' }}>{[d.email, d.phone, d.address].filter(Boolean).join(' | ')}</div>
      </div>
      {d.skills?.filter(s => s).length > 0 && (
        <div style={{ background: '#1a1a1a', padding: '6px 20px', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {d.skills.filter(s => s).map((s, i) => (
            <span key={i} style={{ color: acc, fontSize: 7.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{s}</span>
          ))}
        </div>
      )}
      <div style={{ padding: '12px 20px' }}>
        {d.summary && (
          <div style={{ marginBottom: 12 }}>
            <SHead title="Profile" accent={acc} />
            <div style={{ fontSize: 8.5, lineHeight: 1.65, color: '#444' }}>{d.summary}</div>
          </div>
        )}
        <ExpBlock exps={d.experience} accent={acc} />
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          <div style={{ flex: 1 }}>
            <ProjsBlock projs={d.projects} accent={acc} />
          </div>
          <div style={{ flex: 1 }}>
            <EduBlock edus={d.education} accent={acc} />
            <CertsBlock certs={d.certifications} accent={acc} />
          </div>
        </div>
      </div>
    </div>
  );
}
