import { SimpleGrid } from '@mantine/core';
import type { Upload } from '@prisma/client';
import { SelectableImage } from './SelectableImage';

interface ImageGridProps {
  uploads: Upload[];
}

export function ImageGrid({ uploads }: ImageGridProps) {
  return (
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
        <SelectableImage key={item.id} upload={item} />
      ))}
    </SimpleGrid>
  );
}
