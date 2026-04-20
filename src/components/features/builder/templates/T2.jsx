import SHead from '../preview/SHead';
import ExpBlock from '../preview/blocks/ExpBlock';
import EduBlock from '../preview/blocks/EduBlock';
import CertsBlock from '../preview/blocks/CertsBlock';
import SkillsBlock from '../preview/blocks/SkillsBlock';
import ProjsBlock from '../preview/blocks/ProjsBlock';
import { SF } from '../../../../constants/builder.constants';

export default function T2({ d }) {
  const acc = '#1a1a1a';
  return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#fff', fontSize: 9, lineHeight: 1.6, padding: '20px 24px', minHeight: '100%' }}>
      <div style={{ borderTop: '1.5px solid #1a1a1a', paddingTop: 10, marginBottom: 4 }}>
        <div style={{ fontSize: 20, fontWeight: 400, letterSpacing: '2px', textTransform: 'uppercase' }}>{d.fullName || 'Your Name'}</div>
        <div style={{ fontSize: 10, fontStyle: 'italic', color: '#555', margin: '3px 0' }}>{d.targetJobTitle || 'Professional Title'}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 7.5, color: '#777', fontFamily: SF }}>
          {d.email && <span>{d.email}</span>}
          {d.phone && <span>{d.phone}</span>}
          {d.address && <span>{d.address}</span>}
        </div>
      </div>
      <div style={{ borderBottom: '1.5px solid #1a1a1a', marginBottom: 10 }} />
      {d.summary && (
        <div style={{ marginBottom: 10 }}>
          <SHead title="Summary" accent={acc} />
          <div style={{ fontSize: 8.5, lineHeight: 1.7, color: '#444' }}>{d.summary}</div>
        </div>
      )}
      <ExpBlock exps={d.experience} accent={acc} />
      <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
        <div style={{ flex: 1 }}>
          <EduBlock edus={d.education} accent={acc} />
          <CertsBlock certs={d.certifications} accent={acc} />
        </div>
        <div style={{ flex: 1 }}>
          <SkillsBlock skills={d.skills} accent={acc} layout="text" />
          <ProjsBlock projs={d.projects} accent={acc} />
        </div>
      </div>
    </div>
  );
}
