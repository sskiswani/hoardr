import { Avatar, Button, Center, Group, Header, Text, Title, createStyles } from '@mantine/core';
import Link from 'next/link';
import useSWR from 'swr';
import { logoFont } from '~/fonts';

const useStyles = createStyles({
  avatar: {
    img: { objectFit: 'fill' }
  }
});

export function Navbar() {
  const { classes } = useStyles();
  const count = useSWR('/api/count');

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
        <Text color="dimmed">
          A hoard of
          {count.data > 0 && (
            <>
              {' '}
              <Text
                color="pink.1"
                display="inline"
                fw={count.data < 50 ? 500 : 800}
                opacity={0.8}
                sx={theme => ({
                  textShadow: count.data < 100 ? 'unset' : `0 0 18px ${theme.colors.grape[5]}`
                })}>
                {count.data}
              </Text>
            </>
          )}
          {' images'}
        </Text>
      </Group>
    </Header>
  );
}
