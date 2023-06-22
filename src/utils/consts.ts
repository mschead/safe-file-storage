const VARIABLES = {
  PORT: '',
  BASE_URL: '',
  DATABASE_HOST: '',
  DATABASE_USER: '',
  DATABASE_PASSWORD: '',
  DATABASE_NAME: '',
};

type VariableKey = keyof typeof VARIABLES;

const buildEnvVariables = () => {
  Object.keys(VARIABLES).forEach((variable) => {
    const value = process.env[variable];
    if (value === undefined) {
      throw new Error(`Missing ${variable} env variable.`);
    }
    VARIABLES[variable as VariableKey] = value;
  });
  return VARIABLES;
};

export const APP_CONSTS = buildEnvVariables();
