import { Button, Container, Group, SimpleGrid, Space } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import type { Upload } from '@prisma/client';
import { IconDeselect, IconSelectAll, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import logger from '~/util/logger';
import { Searchbar } from './Searchbar';
import { SelectableImage } from './SelectableImage';

interface ImageGridProps {
  uploads: Upload[];
  onSearch?: (value: string) => void;
}

export function ImageGrid({ uploads, onSearch }: ImageGridProps) {
  const [selected, handlers] = useListState<string>([]);
  const [search, setSearch] = useState('');

  return (
    <Container>
      <Group mb="md" position="apart">
        <Searchbar value={search} onChange={ev => setSearch(ev.currentTarget.value)} onSubmit={() => logger.info('yo')} />
        <Space />
        <Group position="apart">
          <Button.Group>
            <Button leftIcon={<IconSelectAll />} variant="subtle" onClick={() => handlers.setState(uploads.map(x => x.id))}>
              All
            </Button>
            <Button color="gray" leftIcon={<IconDeselect />} variant="subtle" onClick={() => handlers.setState([])}>
              None
            </Button>
          </Button.Group>
          <Button color="red.5" leftIcon={<IconTrash />} onClick={() => void 0}>
            Delete {`${selected.length > 0 ? `${selected.length} images` : 'all'}`}
          </Button>
        </Group>
      </Group>
      <SimpleGrid
        breakpoints={[
          { minWidth: 'md', cols: 4, spacing: 'md' },
          { minWidth: 'sm', cols: 3, spacing: 'sm' },
          { minWidth: 'xs', cols: 2, spacing: 'sm' },
          { maxWidth: 'xs', cols: 1, spacing: 'sm' }
        ]}
        miw={50}
        verticalSpacing="xl">
        {uploads.map(item => (
          <SelectableImage
            checked={selected.includes(item.id)}
            key={item.id}
            upload={item}
            onChange={checked => {
              if (checked) {
                handlers.append(item.id);
              } else {
                handlers.filter(id => id !== item.id);
              }
            }}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
}
