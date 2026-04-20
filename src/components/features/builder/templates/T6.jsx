import SHead from '../preview/SHead';
import ExpBlock from '../preview/blocks/ExpBlock';
import ProjsBlock from '../preview/blocks/ProjsBlock';
import EduBlock from '../preview/blocks/EduBlock';
import CertsBlock from '../preview/blocks/CertsBlock';
import { SF } from '../../../../constants/builder.constants';

export default function T6({ d }) {
  const acc = '#0070f3';
  return (
    <div style={{ fontFamily: SF, background: '#fff', fontSize: 9, minHeight: '100%' }}>
      <div style={{ padding: '16px 20px 12px' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#0d1117' }}>{d.fullName || 'Your Name'}</div>
        <div style={{ fontSize: 9, color: acc, fontWeight: 600, margin: '2px 0 8px' }}>{d.targetJobTitle}</div>
        <div style={{ height: '1.5px', background: acc, marginBottom: 6 }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 8, color: '#555' }}>
          {d.email && <span>{d.email}</span>}
          {d.phone && <span>{d.phone}</span>}
          {d.address && <span>{d.address}</span>}
          {d.linkedinUrl && <span>{d.linkedinUrl}</span>}
        </div>
      </div>
      <div style={{ padding: '0 20px 20px' }}>
        {d.summary && (
          <div style={{ marginBottom: 10, background: '#f0f7ff', borderLeft: `2.5px solid ${acc}`, padding: '8px 12px', borderRadius: '0 4px 4px 0' }}>
            <div style={{ fontSize: 6.5, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: acc, marginBottom: 3 }}>Summary</div>
            <div style={{ fontSize: 8.5, lineHeight: 1.65, color: '#444' }}>{d.summary}</div>
          </div>
        )}
        {d.skills?.filter(s => s).length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <SHead title="Core Skills" accent={acc} />
            <div style={{ background: '#f8fafc', border: '0.5px solid #e2e8f0', borderRadius: 4, padding: '8px 10px', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {d.skills.filter(s => s).map((s, i) => (
                <span key={i} style={{ background: '#fff', border: `0.5px solid ${acc}`, color: acc, padding: '2px 8px', borderRadius: 3, fontSize: 8 }}>{s}</span>
              ))}
            </div>
          </div>
        )}
        <ExpBlock exps={d.experience} accent={acc} card={true} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 10 }}>
          <EduBlock edus={d.education} accent={acc} />
          <div>
            <ProjsBlock projs={d.projects} accent={acc} />
            <CertsBlock certs={d.certifications} accent={acc} />
          </div>
        </div>
      </div>
    </div>
  );
}
