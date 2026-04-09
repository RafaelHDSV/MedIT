type keyType = Record<string, unknown>

export function sorterFunctionById<T = unknown>(a: T, b: T): number {
  const idA = (a as keyType)._id ? String((a as keyType)._id) : ''
  const idB = (b as keyType)._id ? String((b as keyType)._id) : ''
  return idA.localeCompare(idB)
}

export const sorterFunctionByDate =
  <T = unknown>(field: string) =>
  (a: T, b: T): number => {
    const dateA = (a as keyType)[field]
      ? new Date((a as keyType)[field] as string | number | Date).getTime()
      : 0
    const dateB = (b as keyType)[field]
      ? new Date((b as keyType)[field] as string | number | Date).getTime()
      : 0
    return dateA - dateB
  }

export const sorterFunctionByNumber =
  <T = unknown>(field: string) =>
  (a: T, b: T): number => {
    const valueA = (a as keyType)[field] as number | undefined
    const valueB = (b as keyType)[field] as number | undefined
    return (valueA ?? 0) - (valueB ?? 0)
  }
