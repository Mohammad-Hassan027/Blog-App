const MarkdownEditor = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  id = "markdown-content",
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700" htmlFor={id}>
        Content (Markdown supported) 📝
      </label>

      <textarea
        className={`mt-2 form-textarea min-h-[200px] sm:min-h-48 w-full p-3 text-sm rounded-lg transition-all duration-200 bg-gray-100 text-gray-900 placeholder:text-gray-500 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      ></textarea>
    </div>
  );
};

export default MarkdownEditor;
