import { StandardDefinition } from '../standards/lib/standard-definition';
import { useStandardSetting } from './hooks/update-config';
import WrapOption from './wrap-option';
import { PropsWithChildren } from 'react';

export default function SelectInput(
  props: PropsWithChildren<{
    standard: StandardDefinition<any>;
    attribute: string;
    name: string;
    options: { name: string; value: string }[];
  }>
) {
  const setting = useStandardSetting<string>(props.standard, props.attribute);

  const disabled = !setting;

  return (
    <WrapOption>
      <div style={{ padding: 6, paddingLeft: 2 }}>
        <div style={{ fontSize: 11 }}>{props.name}:</div>
        <select
          style={{
            maxWidth: 400,
            width: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '1px solid #e2e2e2',
          }}
          disabled={disabled}
          value={(setting && setting[0]) || ''}
          onChange={setting && ((e: any) => setting[1](e.target.value))}
        >
          {props.options.map((op) => {
            return (
              <option value={op.value} key={op.value}>
                {op.name}
              </option>
            );
          })}
        </select>
      </div>
    </WrapOption>
  );
}
