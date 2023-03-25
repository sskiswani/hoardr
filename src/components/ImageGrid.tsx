import { Button, Container, Divider, Group, Paper, SimpleGrid } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import type { Upload } from '@prisma/client';
import { IconDeselect, IconSelectAll, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { Searchbar } from './Searchbar';
import { SelectableImage } from './SelectableImage';

interface ImageGridProps {
  uploads: Upload[];
  onDelete: (ids?: string[]) => void;
  onSearch: (value: string) => void;
}

interface ToolbarProps {
  onSelectAll: () => void;
  onSelectNone: () => void;
  onDelete: () => void;
  onSearch: (value: string) => void;
  selectCount?: number;
  resetOnDelete?: boolean;
}

function Toolbar({ onSearch, ...props }: ToolbarProps) {
  const [search, setSearch] = useState('');

  return (
    <Group grow align="center" p="sm" position="apart">
      <Searchbar value={search} onChange={ev => setSearch(ev.currentTarget.value)} onSubmit={() => onSearch(search)} />
      <Group position="right">
        <Button.Group>
          <Button leftIcon={<IconSelectAll />} variant="subtle" onClick={props.onSelectAll}>
            All
          </Button>
          <Button color="gray" leftIcon={<IconDeselect />} variant="subtle" onClick={props.onSelectNone}>
            None
          </Button>
        </Button.Group>
        <Button
          color="red.5"
          leftIcon={<IconTrash />}
          onClick={() => {
            props.onDelete();
            if (props.resetOnDelete) {
              setSearch('');
              onSearch('');
            }
          }}>
          Delete {`${props.selectCount ? `selected` : 'all'}`}
        </Button>
      </Group>
    </Group>
  );
}

export function ImageGrid({ uploads, onSearch, onDelete }: ImageGridProps) {
  const [selected, handlers] = useListState<string>([]);
  const deselect = () => handlers.setState([]);

  return (
    <Container>
      <Paper withBorder m="sm">
        <Toolbar
          selectCount={selected.length}
          onDelete={() => {
            if (selected.length > 0) {
              onDelete(selected);
              deselect();
            } else {
              onDelete(uploads.map(x => x.id));
            }
          }}
          onSearch={onSearch}
          onSelectAll={() => handlers.setState(uploads.map(x => x.id))}
          onSelectNone={deselect}
        />
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
