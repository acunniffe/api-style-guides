import { StandardDefinition } from '../standards/lib/standard-definition';
import { useStandardSetting } from './hooks/update-config';
import WrapOption from './wrap-option';
import { PropsWithChildren } from 'react';

export default function BooleanInput(
  props: PropsWithChildren<{
    standard: StandardDefinition<any>;
    attribute: string;
    name: string;
  }>
) {
  const setting = useStandardSetting<boolean>(props.standard, props.attribute);

  const realBoolValue = setting ? setting[0] : false;

  const disabled = typeof setting === 'undefined';

  return (
    <WrapOption>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <input
          disabled={disabled}
          type="checkbox"
          checked={realBoolValue}
          onChange={setting && ((e) => setting[1](e.target.checked))}
        />
        <div style={{ marginLeft: 8 }}>
          <label style={{ fontWeight: 600 }}>{props.name}</label>
        </div>
      </div>
      {props.children && (
        <div style={{ paddingLeft: 20 }}>{props.children}</div>
      )}
    </WrapOption>
  );
}
