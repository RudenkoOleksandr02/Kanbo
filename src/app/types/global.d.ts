declare const __IS_DEV__: boolean
declare const __PROJECT__: 'storybook' | 'frontend' | 'vitest'

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T
