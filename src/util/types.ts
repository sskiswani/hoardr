export type OverrideProps<TProps extends {}, TBase extends {}> = Omit<TBase, keyof TProps> & TProps;
