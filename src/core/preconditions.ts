export const withSchema = (s: Record<string, any>) => {
  return {
    schema: {
      body: s,
    },
  };
};
