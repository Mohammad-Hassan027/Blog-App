import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";

function BlogPostCard({ blog }) {
  const { title, description, imageUrl, tag = [], createdAt } = blog;
  const postId = blog._id || blog.id;

  return (
    <div className="group">
      <div className="grid items-start gap-6 md:grid-cols-5 md:gap-8">
        <div className="md:col-span-2">
          <Link
            className="flex overflow-hidden rounded-lg place-content-center aspect-w-16 aspect-h-9"
            to={`/post/${postId}`}
          >
            <picture className="">
              <img
                loading="lazy"
                alt={title || "Blog post thumbnail"}
                className="object-cover transition-transform duration-300 transform group-hover:scale-105"
                src={
                  imageUrl ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuCSW3fpuQHfzZWNJ5CzRLVotfQdAFNw9QRX6pKfba9VMeTJp4SaNq6q5UAJiZc9DNDATzW4TcMEkuTQgVRDOxiBbwAVAiOIqyCOBOsmBBzw1cgKvla1Akjh4ZC24LJj3jTR8EVPq5eWsPEMM-d9HB3PRTYtRcBVnsCk-xLZyAF_IWMo3-TPxCnYUEB9anmchrry-KT-El2ZMSbeyVMcl_nM4uBrp1YOdv-n4LA20-7LPwb9LuUzDl7ukunGAt_-jEHJWw4Z--Ckk9ZN"
                }
              />
            </picture>
          </Link>
        </div>
        <div className="md:col-span-3">
          <div className="flex items-center mb-2 space-x-2  text-xs font-medium [&>span]:px-2.5 [&>span]:py-[0.2rem] [&>span]:rounded-full">
            <span className="inline-block bg-stone-500/10 text-amber-700">
              {tag[0] || "Lifestyle"}
            </span>
            <span className="inline-block bg-slate-200 text-slate-700">
              {tag[1] || "Sustainable"}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            <Link
              className="transition-colors hover:text-amber-500"
              to={`/post/${postId}`}
            >
              {title || "The Future of Sustainable Living"}
            </Link>
          </h3>
          <p className="mt-2 text-slate-600">
            {description ||
              " Explore innovative approaches to sustainable living, from eco-friendly homes to renewable energy solutions. Learn how to reduce your environmental impact and create Link greener future."}
          </p>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-slate-500">
              {createdAt ? new Date(createdAt).toLocaleDateString() : ""}
            </div>
            <Link
              className="inline-flex items-center text-sm font-medium text-amber-500 transition-colors hover:text-amber-500/80"
              to={`/post/${postId}`}
            >
              View Post
              <span
                className="ml-1 text-base material-symbols-outlined"
                aria-hidden="true"
              >
                <IoIosArrowRoundForward />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPostCard;
