import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import {
  useComments,
  useAddComment,
  useDeleteComment,
} from "../hooks/commentHooks";
import Swal from "sweetalert2";

function CommentSection({ id, author }) {
  // Use TanStack Query hooks for comments
  const { data: comments = [] } = useComments(id);
  const addCommentMutation = useAddComment(id);
  const deleteCommentMutation = useDeleteComment(id);

  const [commentText, setCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      setCommentAuthor(user.displayName || user.email || "");
    }
  }, [user]);

  const displayedComments = comments && comments.length > 0 ? comments : [];

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
      <div className="flex flex-col gap-6 mt-6">
        {displayedComments.length === 0 ? (
          <p className="text-sm text-gray-500">
            No comments yet. Be the first to comment.
          </p>
        ) : (
          displayedComments.map((c) => (
            <div
              key={c._id}
              className={`flex items-start gap-4 ${c.parentId ? "pl-14" : ""}`}
            >
              <div
                className="w-10 h-10 bg-center bg-no-repeat bg-cover rounded-full shrink-0"
                style={{
                  backgroundImage: c.avatar
                    ? `url("${c.avatar}")`
                    : 'url("https://www.gravatar.com/avatar/?d=mp")',
                }}
              ></div>
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {c.author}
                  </p>
                  <p className="text-xs text-gray-500">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleString()
                      : c.date || ""}
                  </p>
                </div>
                <p className="mt-1 text-base text-gray-700">{c.text}</p>
                {(user?.email === c.author ||
                  user?.email === author ||
                  user?.displayName === c.author ||
                  user?.displayName === author) && (
                  <button
                    onClick={() => {
                      const swalWithBootstrapButtons = Swal.mixin({
                        customClass: {
                          confirmButton:
                            "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors mx-3",
                          cancelButton:
                            "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors mx-3",
                        },
                        buttonsStyling: false,
                      });
                      swalWithBootstrapButtons
                        .fire({
                          title: "Are you sure?",
                          text: "You won't be able to revert this!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes, delete it!",
                          cancelButtonText: "No, cancel!",
                          reverseButtons: true,
                        })
                        .then((result) => {
                          if (result.isConfirmed) {
                            deleteCommentMutation.mutate(c._id);
                            Swal.fire({
                              width: 370,
                              toast: true,
                              position: "bottom-end",
                              icon: "success",
                              title: "Your comment has been deleted.",
                              showConfirmButton: false,
                              timer: 1600,
                              timerProgressBar: true,
                            });
                          } else if (
                            /* Read more about handling dismissals below */
                            result.dismiss === Swal.DismissReason.cancel
                          ) {
                            swalWithBootstrapButtons.fire({
                              title: "Cancelled",
                              text: "Your comment is safe :)",
                              icon: "error",
                            });
                          }
                        });
                    }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex items-start gap-3 mt-8">
        <div
          className="w-10 h-10 bg-center bg-no-repeat bg-cover rounded-full shrink-0"
          style={{
            backgroundImage:
              user && user.photoURL
                ? `url("${user.photoURL}")`
                : 'url("https://www.gravatar.com/avatar/?d=mp")',
          }}
        ></div>
        <div className="flex w-full flex-col @container">
          <input
            value={commentAuthor}
            onChange={(e) => {
              if (!user) setCommentAuthor(e.target.value);
            }}
            className="p-2 mb-2 text-sm border-gray-300 rounded-md"
            placeholder={user ? "Signed in user" : "Your name (optional)"}
            readOnly={!!user}
          />
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full p-3 text-base text-gray-900 placeholder-gray-500 bg-white border-gray-300 rounded-lg shadow-sm resize-none form-textarea focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
            placeholder="Add a comment..."
            rows="3"
          ></textarea>
          <div className="flex justify-end mt-2">
            <button
              onClick={() => {
                const text = commentText.trim();
                if (!text) return;
                addCommentMutation.mutate({ text });
                setCommentText("");
                if (!user) setCommentAuthor("");
                Swal.fire({
                  width: 370,
                  toast: true,
                  position: "bottom-end",
                  icon: "success",
                  title: "Your comment has been saved.",
                  showConfirmButton: false,
                  timer: 1600,
                  timerProgressBar: true,
                });
              }}
              className="items-center justify-center px-4 overflow-hidden text-sm font-semibold text-white transition-transform bg-blue-500 rounded-lg shadow-sm cursor-pointer h-9 hover:scale-105 active:scale-95"
            >
              Post Comment
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CommentSection;
