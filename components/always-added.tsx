import { StandardDefinition } from '../standards/lib/standard-definition';
import { useParentIsDisabled, useStandardSetting } from './hooks/update-config';
import WrapOption from './wrap-option';

export default function AlwaysAdded(props: {
  standard: StandardDefinition<any>;
  attribute: string;
  part?: string;
}) {
  const setting = useStandardSetting<'added' | 'always'>(
    props.standard,
    props.attribute
  );

  const disabled = typeof setting === 'undefined';

  return (
    <WrapOption>
      <label>When does this rule apply?</label>
      <p></p>
      <fieldset style={{ paddingLeft: 5 }}>
        <div>
          <div>
            <input
              disabled={disabled}
              name="notification-method"
              type="radio"
              checked={setting && setting[0] === 'always'}
              onChange={() => setting && setting[1]('always')}
              // defaultChecked={notificationMethod.id === 'email'}
            />
            <label style={{ marginLeft: 10 }}>
              <span style={{ fontWeight: 700 }}>Always</span> to all{' '}
              {props.part}
            </label>
          </div>
          <div>
            <input
              disabled={disabled}
              name="notification-method"
              type="radio"
              onChange={() => setting && setting[1]('added')}
              checked={setting && setting[0] === 'added'}
              // defaultChecked={notificationMethod.id === 'email'}
            />
            <label style={{ marginLeft: 10 }}>
              <span style={{ fontWeight: 700 }}>Additions</span> to added{' '}
              {props.part}
            </label>
          </div>
        </div>
      </fieldset>
    </WrapOption>
  );
}
