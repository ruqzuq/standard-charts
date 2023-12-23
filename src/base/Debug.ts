const color = () => {
  return '#000000'.replace(/0/g, () => (~~(Math.random() * 16)).toString(16));
};

export const Debug = { color };
