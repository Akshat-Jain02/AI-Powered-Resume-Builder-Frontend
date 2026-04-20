import ExpBlock from '../preview/blocks/ExpBlock';
import EduBlock from '../preview/blocks/EduBlock';
import CertsBlock from '../preview/blocks/CertsBlock';
import SkillsBlock from '../preview/blocks/SkillsBlock';
import ProjsBlock from '../preview/blocks/ProjsBlock';
import { SF } from '../../../../constants/builder.constants';

export default function T4({ d }) {
  const acc = '#7c3aed';
  return (
    <div style={{ fontFamily: SF, background: '#fff', fontSize: 9, minHeight: '100%' }}>
      <div style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        {d.photoBase64 && (
          <img 
            src={`data:image/jpeg;base64,${d.photoBase64}`} 
            alt="" 
            style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', border: '2px solid rgba(255,255,255,0.5)', flexShrink: 0 }} 
          />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{d.fullName || 'Your Name'}</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{d.targetJobTitle || 'Professional Title'}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6, fontSize: 7.5, color: 'rgba(255,255,255,0.7)' }}>
            {d.email && <span>{d.email}</span>}
            {d.phone && <span>{d.phone}</span>}
            {d.address && <span>{d.address}</span>}
          </div>
        </div>
      </div>
      <div style={{ padding: '14px 20px' }}>
        {d.summary && (
          <div style={{ marginBottom: 12, background: '#f8f7ff', borderLeft: `3px solid ${acc}`, padding: '8px 12px', borderRadius: '0 4px 4px 0' }}>
            <div style={{ fontSize: 6.5, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: acc, marginBottom: 3 }}>Professional Summary</div>
            <div style={{ fontSize: 8.5, lineHeight: 1.65, color: '#444' }}>{d.summary}</div>
          </div>
        )}
        <ExpBlock exps={d.experience} accent={acc} card={true} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 10 }}>
          <div>
            <EduBlock edus={d.education} accent={acc} />
            <CertsBlock certs={d.certifications} accent={acc} />
          </div>
          <div>
            <SkillsBlock skills={d.skills} accent={acc} layout="pill" />
            <ProjsBlock projs={d.projects} accent={acc} />
          </div>
        </div>
      </div>
    </div>
  );
}
