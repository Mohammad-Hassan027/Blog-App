const generateDescription = (markdownContent) => {
  return (
    markdownContent
      .trim()
      .replace(/(\*|_|`|#)+/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ", "g")
      .substring(0, 200) + "..."
  );
};

export default generateDescription;
