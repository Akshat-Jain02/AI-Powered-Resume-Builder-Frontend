import SHead from '../SHead';

export default function EduBlock({ edus = [], accent, dark = false }) {
  const valid = edus.filter(e => e.degree || e.institution);
  if (!valid.length) return null;
  return (
    <div style={{ marginBottom: 10 }}>
      <SHead title="Education" accent={accent} />
      {valid.map((e,i) => (
        <div key={i} style={{ marginBottom:6 }}>
          <div style={{ fontSize:8.5, fontWeight:700, color: dark ? '#fff' : '#111' }}>{e.degree}</div>
          {e.field && <div style={{ fontSize:7.5, color: dark ? '#aaa' : '#555' }}>{e.field}</div>}
          <div style={{ fontSize:8, fontWeight:700, color:accent }}>{e.institution}</div>
          <div style={{ fontSize:7.5, color: dark ? '#aaa' : '#888' }}>{[e.startDate, e.endDate].filter(Boolean).join('–')}</div>
          {e.grade && <div style={{ fontSize:7.5, color: dark ? '#aaa' : '#888', marginTop: 1 }}>GPA/Grade: {e.grade}</div>}
        </div>
      ))}
    </div>
  );
}
