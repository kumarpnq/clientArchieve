export const isEmpty = obj => Object.keys(obj).length === 0

export function getLocalTimeISOString(date) {
  let localDate = new Date(date)

  let offsetHours = localDate.getTimezoneOffset() / 60 // Get offset in hours

  let localDateWithOffset = new Date(localDate.getTime() - offsetHours * 60 * 60 * 1000) // Adjust for local timezone

  return localDateWithOffset.toISOString()
}

// * Function to get value from object using string path
export const getValueFromPath = (obj, path) =>
  !!path ? path.split('.').reduce((acc, key) => acc && acc[key], obj) : obj

// * Function to set value to object using string path
export function setValueFromPath(obj, path, value) {
  const keys = path.split('.')
  const lastKey = keys.pop() // Get the last key
  const target = keys.reduce((acc, key) => acc && acc[key], obj) // Traverse the object
  if (target && lastKey) {
    target[lastKey] = value // Set the value
  }
}
