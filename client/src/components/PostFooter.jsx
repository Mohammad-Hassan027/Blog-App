import { useCallback, useState } from "react";

function PostFooter() {
  const [postData, setPostData] = useState({
    likes: 23,
    bookmarks: 5,
    isLiked: true,
    isBookmarked: false,
  });

  const handleLike = useCallback(() => {
    setPostData((prevData) => ({
      ...prevData,
      isLiked: !prevData.isLiked,
      likes: prevData.isLiked ? prevData.likes - 1 : prevData.likes + 1,
    }));
  }, []); // postData.isLiked

  const handleBookmark = useCallback(() => {
    setPostData((prevData) => ({
      ...prevData,
      isBookmarked: !prevData.isBookmarked,
      bookmarks: prevData.isBookmarked
        ? prevData.bookmarks - 1
        : prevData.bookmarks + 1,
    }));
  }, []); // postData.isBookmarked

  const likeButtonClasses = postData.isLiked
    ? "bg-stone-500/10 text-amber-700 hover:bg-stone-500/20"
    : "bg-gray-100 text-gray-600 hover:bg-gray-200";

  const bookmarkButtonClasses = postData.isBookmarked
    ? "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20"
    : "bg-gray-100 text-gray-600 hover:bg-gray-200";

  return (
    <footer className="flex items-center gap-4 pt-6 mt-6 border-t border-gray-200">
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition duration-150 ${likeButtonClasses}`}
        aria-label={
          postData.isLiked
            ? `Unlike post, ${postData.likes} likes`
            : `Like post, ${postData.likes} likes`
        }
      >
        <svg
          aria-hidden="true"
          fill="currentColor"
          height="18"
          viewBox="0 0 256 256"
          width="18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M128,216S28,160,28,92A52,52,0,0,1,80,40a52,52,0,0,1,48,42.42A52,52,0,0,1,176,40a52,52,0,0,1,52,52C228,160,128,216,128,216Z"></path>
        </svg>
        <span>{postData.likes}</span>
      </button>
      <button
        onClick={handleBookmark}
        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition duration-150 ${bookmarkButtonClasses}`}
        aria-label={
          postData.isBookmarked
            ? `Remove bookmark, ${postData.bookmarks} bookmarks`
            : `Bookmark post, ${postData.bookmarks} bookmarks`
        }
      >
        <svg
          aria-hidden="true"
          fill="currentColor"
          height="18"
          viewBox="0 0 256 256"
          width="18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Z"></path>
        </svg>
        <span>{postData.bookmarks}</span>
      </button>
    </footer>
  );
}

export default PostFooter;
