const handleCopy = async (syntax) => {
  try {
    await navigator.clipboard.writeText(syntax);
    
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};
export { handleCopy };
