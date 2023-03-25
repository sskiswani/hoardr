import { Avatar, Button, Center, Group, Header, Title, createStyles } from '@mantine/core';
import Link from 'next/link';
import { logoFont } from '~/fonts';

const useStyles = createStyles({
  avatar: {
    img: { objectFit: 'fill' }
  }
});

export function Navbar() {
  const { classes } = useStyles();

  return (
    <Header height={60} mb="md">
      <Group h="100%" px="md">
        <Center>
          <Button color="pink" component={Link} href="/" size="md" variant="subtle">
            <Avatar className={classes.avatar} size="sm" src="flash-drive.png" variant="outline" />
            <Title className={logoFont.className} order={2} px="sm">
              hoardr
            </Title>
          </Button>
        </Center>
      </Group>
    </Header>
  );
}
