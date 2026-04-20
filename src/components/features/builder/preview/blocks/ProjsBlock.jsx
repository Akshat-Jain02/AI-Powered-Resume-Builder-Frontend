import SHead from '../SHead';

export default function ProjsBlock({ projs = [], accent }) {
  const valid = projs.filter(p => p.name);
  if (!valid.length) return null;
  return (
    <div style={{ marginBottom: 10 }}>
      <SHead title="Projects" accent={accent} />
      {valid.map((p,i) => (
        <div key={i} style={{ marginBottom:6 }}>
          <span style={{ fontSize:8.5, fontWeight:700 }}>{p.name}</span>
          {p.techStack && <span style={{ fontSize:7.5, color:accent, marginLeft:5 }}>— {p.techStack}</span>}
          {p.description && <div style={{ fontSize:7.5, color:'#555', lineHeight:1.5, marginTop:1 }}>{p.description}</div>}
        </div>
      ))}
    </div>
  );
}
