import { SF } from '../../../../constants/builder.constants';

export default function SHead({ title, accent = '#1a3a5c' }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ 
        fontSize: 7, 
        fontWeight: 700, 
        letterSpacing: '2px', 
        textTransform: 'uppercase', 
        color: accent, 
        fontFamily: SF 
      }}>{title}</div>
      <div style={{ height: 0.8, background: accent, marginTop: 2 }} />
    </div>
  );
}
