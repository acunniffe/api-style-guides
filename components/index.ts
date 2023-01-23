import dynamic from 'next/dynamic';

export const Toggle = dynamic(() => import('./toggle-checkbox'), {
  ssr: false,
});

export const DownloadButton = dynamic(() => import('./download-button'), {
  ssr: false,
});

export const AlwaysAdded = dynamic(() => import('./always-added'), {
  ssr: false,
});

export const BooleanInput = dynamic(() => import('./boolean'), {
  ssr: false,
});
export const TextInput = dynamic(() => import('./input'), {
  ssr: false,
});

export const SelectInput = dynamic(() => import('./select'), {
  ssr: false,
});
