export const parseError = (err: unknown) => {
  return err instanceof Error ? err.message : 'Unexpected operation.';
};
