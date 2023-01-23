import { PropsWithChildren } from 'react';

export default function WrapOption(props: PropsWithChildren<{}>) {
  return (
    <div
      style={{
        marginTop: 8,

        borderLeft: '2px solid #e2e2e2',
        paddingLeft: 9,
        paddingTop: 3,
        paddingBottom: 3,
        backgroundColor: 'rgba(226,226,226,0.26)',
      }}
    >
      {props.children}
    </div>
  );
}
