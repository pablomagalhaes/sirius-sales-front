import { SetStorage, GetStorage } from '@/data/protocols/cache'
import { PREFIX_LOCALSTORAGE } from '@/utils/constants'

export class LocalStorageAdapter implements SetStorage, GetStorage {
  set (key: string, value: object): void {
    if (value) {
      localStorage.setItem(`${process.env.REACT_APP_PREFIX_LOCALSTORAGE}${key}`, JSON.stringify(value))
    } else {
      localStorage.removeItem(`${process.env.REACT_APP_PREFIX_LOCALSTORAGE}${key}`)
    }
  }

  get (key: string): any {
    return localStorage.getItem(`${process.env.REACT_APP_PREFIX_LOCALSTORAGE}${key}`)
  }

  clear (): void {
    Object.keys(localStorage)
      .filter(x => x.startsWith(PREFIX_LOCALSTORAGE))
      .forEach(x => localStorage.removeItem(x))
  }
}
