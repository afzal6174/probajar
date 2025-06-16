export function formDataToObject(formData) {
  const obj = {};

  for (const [key, value] of formData.entries()) {
    const element = formData.getAll(key);

    // Handle checkboxes and multi-select (array of values)
    if (element.length > 1) {
      obj[key] = element;
    }

    // Handle files
    else if (value instanceof File) {
      if (value.name === "" && value.size === 0) {
        obj[key] = null; // No file selected
      } else {
        obj[key] = value;
      }
    }

    // Handle radio and normal fields
    else {
      obj[key] = value;
    }
  }

  return obj;
}
