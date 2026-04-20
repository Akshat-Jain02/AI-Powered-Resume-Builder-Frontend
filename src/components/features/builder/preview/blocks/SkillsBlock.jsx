import SHead from '../SHead';

export default function SkillsBlock({ skills = [], accent, layout = 'chip' }) {
  const valid = skills.filter(s => s);
  if (!valid.length) return null;
  return (
    <div style={{ marginBottom: 10 }}>
      <SHead title="Skills" accent={accent} />
      <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
        {valid.map((s,i) => {
          if (layout === 'pill') return <span key={i} style={{ background:accent+'18', color:accent, border:`0.5px solid ${accent}`, padding:'2px 7px', borderRadius:20, fontSize:7.5 }}>{s}</span>;
          if (layout === 'outline') return <span key={i} style={{ background:'#fff', color:accent, border:`0.5px solid ${accent}`, padding:'2px 7px', borderRadius:3, fontSize:7.5 }}>{s}</span>;
          if (layout === 'text') return <span key={i} style={{ fontSize:8, color:'#555' }}>{s}{i<valid.length-1?', ':''}</span>;
          if (layout === 'upper') return <span key={i} style={{ fontSize:7.5, fontWeight:700, color:accent, textTransform:'uppercase', letterSpacing:'0.5px', marginRight:8 }}>{s}</span>;
          return <span key={i} style={{ background:accent, color:'#fff', padding:'2px 7px', borderRadius:2, fontSize:7.5, fontWeight:500 }}>{s}</span>;
        })}
      </div>
    </div>
  );
}
