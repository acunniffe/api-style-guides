import { useUserSelections } from './hooks/update-config';
import Link from 'next/link';

import styles from './styles.module.css';
import { useCallback, useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';

export default function DownloadButton() {
  const selection = useUserSelections();
  const count = Object.keys(selection).length;

  const text =
    count === 0
      ? '(0) standards'
      : count === 1
      ? '(1) standard'
      : `(${count}) standards`;

  const [key, setKey] = useState(new Date());

  useEffect(() => {
    if (key.getMilliseconds() - new Date().getMilliseconds() < 1000) {
      setKey(new Date());
    }
  }, [selection]);

  return (
    <Link key={key.toString()} href="/download" className={styles.download}>
      <button>Download {text}</button>
    </Link>
  );
}

export  function CopyButton(props: {text: string, content: string}) {

  const [clicked, setClicked] = useState(false)

  const copyIt = useCallback(() => {
    copy(props.content)
    setClicked(true)
  }, [setClicked])

  return (
    <>
    <button className={styles.download} onClick={copyIt}>{props.text}</button>
    {clicked && <span style={{marginLeft: 10, color: 'green'}}>Copied to clipboard</span>}
    </>
  );
}
