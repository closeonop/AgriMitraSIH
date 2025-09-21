/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AGROMONITORING_API_KEY: string
  readonly VITE_AMBEE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}