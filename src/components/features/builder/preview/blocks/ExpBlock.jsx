import SHead from '../SHead';
import { SF } from '../../../../../constants/builder.constants';

export default function ExpBlock({ exps = [], accent, card = false }) {
  const valid = exps.filter(e => e.position || e.company);
  if (!valid.length) return null;
  return (
    <div style={{ marginBottom: 10 }}>
      <SHead title="Work Experience" accent={accent} />
      {valid.map((e, i) => {
        const dl = [e.startDate, e.current ? 'Present' : e.endDate].filter(Boolean).join('–');
        const bullets = e.description ? e.description.split('\n').filter(b => b.trim()) : [];
        return (
          <div key={i} style={{ marginBottom: 7, ...(card ? { background: '#f8f8f8', border: '0.5px solid #ddd', borderRadius: 3, padding: '5px 7px' } : {}) }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div style={{ fontSize:9, fontWeight:700, fontFamily:SF }}>{e.position}</div>
              <div style={{ fontSize:7.5, color:'#888', fontStyle:'italic', whiteSpace:'nowrap', marginLeft:6 }}>{dl}</div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <div style={{ fontSize:8, fontWeight:700, color:accent }}>{e.company}</div>
              {e.location && <div style={{ fontSize:7.5, color:'#888', fontStyle:'italic' }}>{e.location}</div>}
            </div>
            {bullets.length > 0 && (
              <ul style={{ margin:'3px 0 0', paddingLeft:12, listStyle:'disc' }}>
                {bullets.map((b,j) => <li key={j} style={{ fontSize:8, color:'#555', lineHeight:1.55, marginBottom:1 }}>{b.replace(/^[•\-\*]\s*/,'')}</li>)}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
