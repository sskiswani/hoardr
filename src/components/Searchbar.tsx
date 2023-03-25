import type { TextInputProps } from '@mantine/core';
import { ActionIcon, TextInput, useMantineTheme } from '@mantine/core';
import { IconArrowRight, IconSearch } from '@tabler/icons-react';
import { useRef } from 'react';
import type { OverrideProps } from '~/util/types';

interface BaseSearchbarProps {
  onSubmit?: () => void;
}

type SearchbarProps = OverrideProps<BaseSearchbarProps, Omit<TextInputProps, 'onKeyDown'>>;

export function Searchbar(props: SearchbarProps) {
  const theme = useMantineTheme();
  const actionRef = useRef<HTMLButtonElement>(null);

  return (
    <TextInput
      icon={<IconSearch size="1.1rem" stroke={1.5} />}
      placeholder="Search..."
      radius="xl"
      rightSection={
        <ActionIcon color={theme.primaryColor} radius="xl" ref={actionRef} size={32} variant="filled" onClick={props.onSubmit}>
          <IconArrowRight size="1.1rem" stroke={1.5} />
        </ActionIcon>
      }
      rightSectionWidth={42}
      size="md"
      {...props}
      onKeyDown={ev => {
        if (ev.key === 'Enter') {
          actionRef.current?.click();
        }
      }}
    />
  );
}
