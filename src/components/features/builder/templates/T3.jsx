import EduBlock from '../preview/blocks/EduBlock';
import ExpBlock from '../preview/blocks/ExpBlock';
import ProjsBlock from '../preview/blocks/ProjsBlock';
import CertsBlock from '../preview/blocks/CertsBlock';
import { SF } from '../../../../constants/builder.constants';

export default function T3({ d }) {
  const acc = '#2ecc71';
  const dark = '#1e2d3d';
  return (
    <div style={{ fontFamily: SF, display: 'flex', background: '#fff', fontSize: 9, minHeight: '100%' }}>
      <div style={{ width: '32%', background: dark, color: '#fff', padding: '14px 10px', flexShrink: 0 }}>
        {d.photoBase64 && (
          <div style={{ textAlign: 'center', marginBottom: 10 }}>
            <img 
              src={`data:image/jpeg;base64,${d.photoBase64}`} 
              alt="" 
              style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${acc}` }} 
            />
          </div>
        )}
        <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.2, marginBottom: 2 }}>{d.fullName || 'Your Name'}</div>
        <div style={{ fontSize: 7.5, color: acc, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>{d.targetJobTitle}</div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 6.5, fontWeight: 700, color: acc, textTransform: 'uppercase', letterSpacing: '1px' }}>Contact</div>
          <div style={{ height: 0.5, background: `${acc}60`, marginTop: 2, marginBottom: 4 }} />
          {d.email && <div style={{ fontSize: 7.5, color: '#ccc', marginBottom: 2, wordBreak: 'break-all' }}>{d.email}</div>}
          {d.phone && <div style={{ fontSize: 7.5, color: '#ccc', marginBottom: 2 }}>{d.phone}</div>}
          {d.address && <div style={{ fontSize: 7.5, color: '#ccc' }}>{d.address}</div>}
        </div>
        {d.skills?.filter(s => s).length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 6.5, fontWeight: 700, color: acc, textTransform: 'uppercase', letterSpacing: '1px' }}>Skills</div>
            <div style={{ height: 0.5, background: `${acc}60`, marginTop: 2, marginBottom: 4 }} />
            {d.skills.filter(s => s).map((s, i) => (
              <div key={i} style={{ fontSize: 8, color: '#e8e8e8', marginBottom: 3 }}>{s}</div>
            ))}
          </div>
        )}
        <EduBlock edus={d.education} accent={acc} dark={true} />
      </div>
      <div style={{ flex: 1, padding: '14px 16px' }}>
        {d.summary && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: dark, marginBottom: 4 }}>About Me</div>
            <div style={{ width: 20, height: 2, background: acc, marginBottom: 6 }} />
            <div style={{ fontSize: 8.5, lineHeight: 1.65, color: '#444' }}>{d.summary}</div>
          </div>
        )}
        <ExpBlock exps={d.experience} accent={acc} />
        <ProjsBlock projs={d.projects} accent={acc} />
        <CertsBlock certs={d.certifications} accent={acc} />
      </div>
    </div>
  );
}
