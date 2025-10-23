const generateDescription = (markdownContent) => {
  return (
    markdownContent
      .trim()
      .replace(/(\*|_|`|#)+/g, "") // Remove *, _, #, `
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Replace [text](url) with just text
      .replace(/\n/g, " ") // Replace newlines with spaces
      .replace(/\s+/g, " ", "g") // Replace multiple spaces with single space
      .substring(0, 200) + "..."
  );
};

export default generateDescription;
