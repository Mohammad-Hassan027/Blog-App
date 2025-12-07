import { Link } from "react-router-dom";
import BlogCard from "./BlogCard";
import { usePosts } from "../../hooks/blogHooks";

function Home() {
  const { data, isLoading, error } = usePosts(1, 6);
  const blogs = data?.blogs || [];

  return (
    <main className="grow">
      <section className="relative py-12 sm:py-24 lg:py-32">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1600&q=60')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container relative px-4 mx-auto text-center text-white sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Explore the Future of Technology
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-300">
            Dive into the latest trends, insights, and innovations shaping our
            digital world. From AI to cybersecurity, we've got you covered.
          </p>
          <div className="mt-10">
            <Link
              className="inline-block px-8 py-3 text-base font-medium text-white transition-transform transform bg-amber-500 rounded-lg hover:bg-amber-500/90 hover:scale-105 active:scale-95"
              to={"/all-posts"}
            >
              Browse All Posts
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16 sm:py-24">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold tracking-tight text-gray-900">
            Featured Post
          </h2>
          <div className="@container">
            <div className="grid grid-cols-1 @[640px]:grid-cols-2 gap-8 items-center bg-stone-50/45 p-8 rounded-xl shadow-lg overflow-hidden">
              <div className="order-2 @[640px]:order-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  The Rise of Quantum Computing
                </h3>
                <p className="mt-4 text-gray-600">
                  Explore the revolutionary potential of quantum computing and
                  its impact on various industries. Discover how it's poised to
                  solve some of the world's most complex problems.
                </p>
                <div className="mt-6">
                  <Link
                    className="inline-flex items-center gap-2 text-sm font-medium text-amber-500 hover:underline"
                    to={"/post/68d62e54ce51c6eec9bc3608"}
                  >
                    Read More
                    <svg
                      className="lucide lucide-arrow-right"
                      fill="none"
                      height="16"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="order-1 @[640px]:order-2 aspect-w-16 aspect-h-9">
                <img
                  loading="lazy"
                  alt="Abstract image representing quantum computing"
                  className="object-cover w-full h-full rounded-lg"
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=60"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 sm:py-24">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between mb-12 md:flex-row md:items-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Latest Posts
            </h2>
            <Link
              className="flex items-center gap-1 mt-2 text-sm font-medium text-amber-500 md:mt-0 hover:underline"
              to={"/all-posts"}
            >
              View all posts
              <svg
                className="lucide lucide-arrow-right"
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div
                  className="flex flex-col p-8 transition-shadow duration-300 shadow-md bg-stone-50/45 rounded-xl animate-pulse h-full"
                  key={i}
                >
                  <div className="w-1/4 h-4 bg-gray-200 rounded"></div>

                  <div className="mt-4 w-3/4 h-6 bg-gray-200 rounded"></div>

                  <div className="mt-4 w-full h-4 bg-gray-200 rounded grow"></div>
                  <div className="mt-4 w-full h-4 bg-gray-200 rounded grow"></div>
                  <div className="mt-2 w-11/12 h-4 bg-gray-200 rounded"></div>
                  <div className="mt-2 w-11/12 h-4 bg-gray-200 rounded"></div>
                  <div className="mt-2 w-5/6 h-4 bg-gray-200 rounded"></div>

                  <div className="mt-4 w-1/5 h-3 bg-amber-100 rounded"></div>
                </div>
              ))
            ) : error ? (
              <div className="col-span-full text-center text-red-500">
                Error loading posts: {error.message}
              </div>
            ) : blogs.length > 0 ? (
              blogs.map((blog) => (
                <BlogCard blog={blog} key={blog._id || blog.id} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No posts available yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
