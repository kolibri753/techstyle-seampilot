function requireEnv(name: string): string {
  const v = import.meta.env[name as keyof ImportMetaEnv] as unknown as string | undefined
  if (!v) throw new Error(`Missing ${name}`)
  return v
}

export const env = {
  API_KEY: requireEnv('VITE_FIREBASE_API_KEY'),
  AUTH_DOMAIN: requireEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  PROJECT_ID: requireEnv('VITE_FIREBASE_PROJECT_ID'),
  STORAGE_BUCKET: requireEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  MSG_SENDER_ID: requireEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  APP_ID: requireEnv('VITE_FIREBASE_APP_ID'),
  MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}
