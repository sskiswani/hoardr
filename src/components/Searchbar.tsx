interface SearchbarProps {
  children?: React.ReactNode;
}

export function Searchbar(props: SearchbarProps) {
  return <div>{props.children}</div>;
}
