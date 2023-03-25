import { Center, Checkbox, Stack, Text, UnstyledButton, createStyles, rem } from '@mantine/core';
import { useUncontrolled } from '@mantine/hooks';
import type { Upload } from '@prisma/client';
import type { OverrideProps } from '~/util/types';
import { UploadItem } from './UploadItem';

const useStyles = createStyles((theme, { checked }: { checked: boolean }) => ({
  button: {
    position: 'relative',
    display: 'flex',
    transition: 'background-color 150ms ease, border-color 150ms ease',
    border: `${rem(1)} solid ${
      (checked ? theme.fn.variant({ variant: 'outline', color: theme.primaryColor }).border : theme.colors.dark[8]) ?? ''
    }`,
    borderRadius: theme.radius.sm,
    padding: 5,
    backgroundColor: checked
      ? theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background
      : theme.colorScheme === 'dark'
      ? theme.colors.dark[8]
      : theme.white
  },
  checkbox: {
    position: 'absolute',
    zIndex: 5,
    input: {
      cursor: 'pointer'
    }
  }
}));

interface BaseProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?(checked: boolean): void;
  upload: Upload;
}

type SelectableImageProps = OverrideProps<BaseProps, React.ComponentPropsWithoutRef<'button'>>;

export function SelectableImage({ checked, defaultChecked, onChange, upload, className, ...others }: SelectableImageProps) {
  const [value, handleChange] = useUncontrolled({
    value: checked,
    defaultValue: defaultChecked,
    finalValue: false,
    onChange
  });

  const { classes, cx } = useStyles({ checked: value });

  return (
    <UnstyledButton {...others} className={cx(classes.button, className)} miw="sm" onClick={() => handleChange(!value)}>
      <Checkbox checked={value} className={classes.checkbox} mr="sm" tabIndex={-1} onChange={() => void 0} />
      <Stack align="center" h="100%" justify="center" w="100%">
        <Center>
          <UploadItem sx={{ pointerEvents: 'none' }} upload={upload} />
        </Center>
        <Text truncate fw={500} maw="100%" mb={7} ta="center">
          {upload.name}
        </Text>
      </Stack>
    </UnstyledButton>
  );
}
