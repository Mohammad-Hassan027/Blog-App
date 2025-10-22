function PostFooter() {
  return (
    <footer className="flex items-center gap-4 pt-6 mt-6 border-t border-gray-200">
      <button className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-500/20 ">
        <svg
          fill="currentColor"
          height="18"
          viewBox="0 0 256 256"
          width="18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M128,216S28,160,28,92A52,52,0,0,1,80,40a52,52,0,0,1,48,42.42A52,52,0,0,1,176,40a52,52,0,0,1,52,52C228,160,128,216,128,216Z"></path>
        </svg>
        <span>23</span>
      </button>
      <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 ">
        <svg
          fill="currentColor"
          height="18"
          viewBox="0 0 256 256"
          width="18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,211a12,12,0,0,0,15.09,15.09l34.1-11.35A104,104,0,1,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-40-88a12,12,0,1,1,12,12A12,12,0,0,1,88,128Zm40,0a12,12,0,1,1,12,12A12,12,0,0,1,128,128Zm40,0a12,12,0,1,1,12,12A12,12,0,0,1,168,128Z"></path>
        </svg>
        <span>12</span>
      </button>
      <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 ">
        <svg
          fill="currentColor"
          height="18"
          viewBox="0 0 256 256"
          width="18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Z"></path>
        </svg>
        <span>5</span>
      </button>
    </footer>
  );
}

export default PostFooter;
