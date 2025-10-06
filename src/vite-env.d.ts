/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
  readonly VITE_API_URL?: string  // optional if needed

  readonly VITE_AWS_REGION: string
  readonly VITE_AWS_ACCESS_KEY_ID: string
  readonly VITE_AWS_SECRET_ACCESS_KEY: string
    readonly VITE_AWS_BUCKET_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
