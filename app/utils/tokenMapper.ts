export const tokenMapper = (currentPassphrase: string) => {
  const devPassphrase = process.env.PASSPHRASE_DEV!;
  const bakPassphrase = process.env.PASSPHRASE_BAK!;
  const defaultPassphrase = process.env.PASSPHRASE!;
  const tokenMap = {
    [devPassphrase]: process.env.YT_DATA_API_TOKEN_DEV,
    [bakPassphrase]: process.env.YT_DATA_API_TOKEN_BAK,
    [defaultPassphrase]: process.env.YT_DATA_API_TOKEN,
  };
  return tokenMap[currentPassphrase];
};
