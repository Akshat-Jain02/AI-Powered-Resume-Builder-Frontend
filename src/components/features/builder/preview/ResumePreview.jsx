import T1 from '../templates/T1';
import T2 from '../templates/T2';
import T3 from '../templates/T3';
import T4 from '../templates/T4';
import T5 from '../templates/T5';
import T6 from '../templates/T6';

export default function ResumePreview({ form, templateId }) {
  const id = Number(templateId) || 1;
  const comps = { 1: T1, 2: T2, 3: T3, 4: T4, 5: T5, 6: T6 };
  const C = comps[id] || T1;
  return <C d={form} />;
}
