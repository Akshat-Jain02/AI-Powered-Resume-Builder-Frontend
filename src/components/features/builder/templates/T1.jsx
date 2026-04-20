import SHead from '../preview/SHead';
import ExpBlock from '../preview/blocks/ExpBlock';
import ProjsBlock from '../preview/blocks/ProjsBlock';
import SkillsBlock from '../preview/blocks/SkillsBlock';
import EduBlock from '../preview/blocks/EduBlock';
import CertsBlock from '../preview/blocks/CertsBlock';
import { SF } from '../../../../constants/builder.constants';

export default function T1({ d }) {
  const acc = '#1a3a5c';
  return (
    <div style={{ fontFamily: SF, background: '#fff', fontSize: 9, lineHeight: 1.5, minHeight: '100%' }}>
      <div style={{ background: acc, color: '#fff', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
        {d.photoBase64 && (
          <img 
            src={`data:image/jpeg;base64,${d.photoBase64}`} 
            alt="" 
            style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.4)', flexShrink: 0 }} 
          />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{d.fullName || 'Your Name'}</div>
          <div style={{ fontSize: 9, color: '#7fb3d3', fontWeight: 500, marginTop: 2 }}>{d.targetJobTitle || 'Professional Title'}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 5, fontSize: 7.5, color: '#b8d4ea' }}>
            {d.email && <span>{d.email}</span>}
            {d.phone && <span>{d.phone}</span>}
            {d.address && <span>{d.address}</span>}
            {d.linkedinUrl && <span>{d.linkedinUrl}</span>}
            {d.githubUrl && <span>{d.githubUrl}</span>}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '0 0 62%', padding: '12px 14px 12px 16px' }}>
          {d.summary && (
            <div style={{ marginBottom: 10 }}>
              <SHead title="Professional Summary" accent={acc} />
              <div style={{ fontSize: 8.5, lineHeight: 1.65, color: '#444' }}>{d.summary}</div>
            </div>
          )}
          <ExpBlock exps={d.experience} accent={acc} />
          <ProjsBlock projs={d.projects} accent={acc} />
        </div>
        <div style={{ flex: '0 0 38%', background: '#f0f4f9', padding: '12px 10px' }}>
          <SkillsBlock skills={d.skills} accent={acc} layout="chip" />
          <EduBlock edus={d.education} accent={acc} />
          <CertsBlock certs={d.certifications} accent={acc} />
        </div>
      </div>
    </div>
  );
}
