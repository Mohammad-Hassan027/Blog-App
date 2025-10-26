const isValidUrl = (url) => {
  try {
    const u = new URL(url);
    // Only allow http, https, or data URLs for image sources
    return (
      u.protocol === "http:" ||
      u.protocol === "https:" ||
      u.protocol === "data:"
    );
  } catch (e) {
    // If new URL(url) throws an error, it's not a valid URL
    return false;
  }
};

export { isValidUrl };
