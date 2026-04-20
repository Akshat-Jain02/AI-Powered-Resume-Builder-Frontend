import SHead from '../SHead';

export default function CertsBlock({ certs = [], accent }) {
  const valid = certs.filter(c => c.name);
  if (!valid.length) return null;
  return (
    <div style={{ marginBottom: 10 }}>
      <SHead title="Certifications" accent={accent} />
      {valid.map((c,i) => (
        <div key={i} style={{ marginBottom:5 }}>
          <div style={{ fontSize:8.5, fontWeight:700 }}>{c.name}</div>
          <div style={{ fontSize:7.5, color:'#777' }}>{[c.issuer, c.date].filter(Boolean).join(' · ')}</div>
        </div>
      ))}
    </div>
  );
}
