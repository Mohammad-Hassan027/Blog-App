
function buildPostDataPayload(postData) {
  // If caller passed a FormData instance directly, return it
  if (postData instanceof FormData) {
    return { body: postData, headers: {} };
  }

  // If we have a file property on the object, build FormData
  if (postData && postData.file) {
    const formData = new FormData();
    formData.append("image", postData.file); // 'image' matches multer field name

    // Append other fields
    Object.keys(postData).forEach((key) => {
      if (key !== "file") {
        if (Array.isArray(postData[key])) {
          formData.append(key, JSON.stringify(postData[key]));
        } else {
          formData.append(key, postData[key]);
        }
      }
    });

    // Don't set Content-Type for FormData - browser will set it with boundary
    return { body: formData, headers: {} };
  }

  // No file, use JSON
  const { file: _file, ...dataWithoutFile } = postData || {};
  return {
    body: JSON.stringify(dataWithoutFile),
    // Explicitly set Content-Type for JSON payloads
    headers: { "Content-Type": "application/json" },
  };
}

export { buildPostDataPayload };