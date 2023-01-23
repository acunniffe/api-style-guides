import { StandardDefinition } from '../standards/lib/standard-definition';
import { useToggleStandard } from './hooks/update-config';
import Link from 'next/link';
import WrapOption from './wrap-option';

export default function ToggleCheckbox(props: {
  standard: StandardDefinition<any>;
  name: string;
  description: string;
}) {
  const { isActive, toggle } = useToggleStandard(props.standard);

  const href = `/standards/${props.standard.slug}`;

  const hide = window.location.pathname === href;

  return (
    <WrapOption>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <input
          type="checkbox"
          checked={isActive}
          onChange={toggle}
          style={{ marginRight: 7 }}
        />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <label style={{ fontWeight: 800, marginRight: 6 }}>
            {props.name}
          </label>
          <div style={{ color: '#7a7878', fontWeight: 600 }}>
            {props.description}
          </div>
          {!hide && (
            <a
              style={{ marginLeft: 5 }}
              href={href}
              className="nx-text-primary-600 nx-underline nx-decoration-from-font [text-underline-position:under]"
            >
              (configure)
            </a>
          )}
        </div>
      </div>
    </WrapOption>
  );
}
