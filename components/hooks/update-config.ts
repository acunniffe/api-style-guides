import { useLocalStorage } from 'usehooks-ts';
import { useCallback, useEffect } from 'react';
import { StandardDefinition } from '../../standards/lib/standard-definition';
import { setCookie } from 'cookies-next';
import { localStorageKey } from '../../constants';

const defaultValues = {};

export function useCookieSync(value: any) {
  useEffect(() => {
    setCookie(localStorageKey, JSON.stringify(value));
  }, [value]);
}

export function useUserSelections() {
  const [value] = useLocalStorage(localStorageKey, defaultValues);
  return value;
}

export function useToggleStandard({
  slug,
  defaultConfiguration,
}: StandardDefinition<any>) {
  const [value, setValue] = useLocalStorage(localStorageKey, defaultValues);
  useCookieSync(value);

  return {
    isActive: value.hasOwnProperty(slug),
    toggle: useCallback(() => {
      if (value.hasOwnProperty(slug)) {
        const shallowCopy = { ...value };
        delete shallowCopy[slug];
        setValue(shallowCopy);
      } else {
        setValue({ ...value, [slug]: defaultConfiguration });
      }
    }, [value, setValue]),
  };
}

export function useStandardSetting<T>(
  standard: StandardDefinition<any>,
  key: string
): [T, (T) => void] | undefined {
  const [value, setValue] = useLocalStorage(localStorageKey, defaultValues);

  const updateCallback = useCallback(
    (newValue: T) => {
      setValue({
        ...value,
        [standard.slug]: { ...value[standard.slug], [key]: newValue },
      });
    },
    [value, setValue]
  );

  useCookieSync(value);

  if (value.hasOwnProperty(standard.slug)) {
    const propValue = value[standard.slug][key];

    return [propValue, updateCallback];
  } else {
    return undefined;
  }
}

export function useParentIsDisabled(slug: string) {
  const [value] = useLocalStorage(localStorageKey, defaultValues);
  return !value.hasOwnProperty(slug);
}
