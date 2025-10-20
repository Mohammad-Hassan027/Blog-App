import { useState } from "react";
import { handleCopy } from "../utils/copy";

const copyToClipboard = async (text) => {
  // We use the execCommand fallback for maximum compatibility within the environment
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  handleCopy(text);
  // try {
  //   // document.execCommand("copy");
  //   await navigator.clipboard.writeText(text);
  // } catch (err) {
  //   console.error("Failed to copy text", err);
  // }
  document.body.removeChild(textarea);
};

const MarkdownRules = () => {
  const markdownRules = [
    { rule: "Headings", syntax: "# H1\n## H2\n### H3" },
    { rule: "Bold", syntax: "**This is bold text**" },
    { rule: "Italic", syntax: "*This is italic text*" },
    { rule: "Strikethrough", syntax: "~~Strikethrough~~" },
    { rule: "Lists", syntax: "- Item 1\n- Item 2\n- Item 3" },
    { rule: "Numbered Lists", syntax: "1. First\n2. Second\n3. Third" },
    { rule: "Links", syntax: "[OpenAI](https://openai.com)" },
    { rule: "Images", syntax: "![Alt text](https://via.placeholder.com/100)" },
    { rule: "Inline Code", syntax: '`console.log("Hello")`' },
    { rule: "Code Block", syntax: '```js\nconsole.log("Hello");\n```' },
    { rule: "Blockquote", syntax: "> This is a blockquote" },
    { rule: "Horizontal Rule", syntax: "---" },
  ];

  // State to show "Copied!" feedback (by index)
  const [copiedIndex, setCopiedIndex] = useState(null);
  // State to show the tooltip (by index)
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleRuleClick = (syntax, index) => {
    copyToClipboard(syntax);
    setCopiedIndex(index);
    // Reset the copied status after 2 seconds
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen p-4 font-sans md:p-10">
      <h1 className="mb-2 text-2xl font-extrabold text-gray-900 md:text-3xl">
        Markdown Syntax Cheatsheet
      </h1>
      <p className="mb-8 text-sm text-gray-600 md:mb-10 md:text-base">
        Hover over a rule (or long-press on touch screens) to see the syntax
        example, or click the button to copy it instantly.
      </p>

      {/* Container for the buttons (pills) */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 md:justify-start">
        {markdownRules.map(({ rule, syntax }, index) => (
          <div key={index} className="relative">
            {/* The clickable button/pill */}
            <button
              className="relative z-10 px-4 py-2 text-sm font-medium text-blue-700 transition-all duration-300 bg-white border border-blue-200 rounded-full shadow-md md:px-6 md:py-3 md:text-base hover:shadow-lg hover:bg-blue-50 active:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-300 whitespace-nowrap"
              onClick={() => handleRuleClick(syntax, index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              // Title attribute provides a hint for non-hover/touch users
              title={
                copiedIndex === index ? "Copied!" : `Click to copy: ${rule}`
              }
            >
              {rule}
              {copiedIndex === index && (
                <span className="inline-block ml-2 transition-transform duration-300">
                  ✅ Copied!
                </span>
              )}
            </button>

            {/* Tooltip (visible on hover) */}
            {hoveredIndex === index && (
              <div
                className="
                                // Common styles
                                bg-gray-800 text-white p-4 rounded-xl shadow-2xl z-20
                                max-w-xs w-64 md:w-[20rem] text-left text-sm font-mono
                                pointer-events-none opacity-0 animate-fadeIn
                                
                                // MOBILE/DEFAULT POSITION (Below and centered)
                                absolute top-full mt-3 left-1/2 transform -translate-x-1/2
                                
                                // DESKTOP POSITION (To the right)
                                lg:left-full lg:ml-4 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0
                            "
              >
                <span className="block mb-1 text-xs font-bold tracking-wider text-blue-300 uppercase">
                  Syntax Example:
                </span>
                {/* Use pre-wrap to handle the multi-line syntax correctly */}
                <pre className="m-0 text-sm leading-snug whitespace-pre-wrap">
                  {syntax}
                </pre>

                {/* Mobile Arrow (pointing up, visible on small screens) */}
                <div className="absolute top-0 w-0 h-0 transform -translate-x-1/2 -translate-y-full border-b-8 border-l-8 border-r-8 left-1/2 border-l-transparent border-r-transparent border-b-gray-800 lg:hidden"></div>

                {/* Desktop Arrow (pointing left, hidden on small screens) */}
                <div className="absolute hidden w-0 h-0 transform -translate-y-1/2 border-t-8 border-b-8 border-r-8 lg:block top-1/2 -left-2 border-t-transparent border-b-transparent border-r-gray-800"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Simple CSS animation for the tooltip fading in */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(0%, -50%);
          }
          to {
            opacity: 1;
            transform: translate(0, -50%);
          }
        }
        @media (min-width: 1024px) {
          /* Adjust for lg breakpoint */
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
        }
        @media (max-width: 1023px) {
          /* Adjust for mobile/tablet */
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
            /* Re-adjust the translation for the mobile position */
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default MarkdownRules;
