import { Button, Container, Divider, Group, Paper, SimpleGrid } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import type { Upload } from '@prisma/client';
import { IconDeselect, IconSelectAll, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { Searchbar } from './Searchbar';
import { SelectableImage } from './SelectableImage';

interface ImageGridProps {
  uploads: Upload[];
  onDelete?: (ids?: string[]) => void;
  onSearch?: (value: string) => void;
}

export function ImageGrid({ uploads, onSearch, onDelete }: ImageGridProps) {
  const [selected, handlers] = useListState<string>([]);
  const [search, setSearch] = useState('');

  return (
    <Container>
      <Paper withBorder m="sm">
        <Group grow align="center" p="sm" position="apart">
          <Searchbar value={search} onChange={ev => setSearch(ev.currentTarget.value)} onSubmit={() => onSearch?.(search)} />
          <Group position="right">
            <Button.Group>
              <Button leftIcon={<IconSelectAll />} variant="subtle" onClick={() => handlers.setState(uploads.map(x => x.id))}>
                All
              </Button>
              <Button color="gray" leftIcon={<IconDeselect />} variant="subtle" onClick={() => handlers.setState([])}>
                None
              </Button>
            </Button.Group>
            <Button
              color="red.5"
              leftIcon={<IconTrash />}
              onClick={() => onDelete?.(selected.length > 0 ? selected : uploads.map(x => x.id))}>
              Delete {`${selected.length ? `selected` : 'all'}`}
            </Button>
          </Group>
        </Group>
        <Divider />
        <SimpleGrid
          breakpoints={[
            { minWidth: 'md', cols: 4, spacing: 'md' },
            { minWidth: 'sm', cols: 3, spacing: 'sm' },
            { minWidth: 'xs', cols: 2, spacing: 'sm' },
            { maxWidth: 'xs', cols: 1, spacing: 'sm' }
          ]}
          m="xs"
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
      </Paper>
    </Container>
  );
}
