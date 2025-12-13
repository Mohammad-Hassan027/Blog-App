import { CiMail } from "react-icons/ci";
import { MdOutlineGroup } from "react-icons/md";

function ContactPage() {
  return (
    <main className="container px-4 py-12 mx-auto grow sm:px-6 lg:px-8 md:py-20">
      <div className="grid gap-16 md:grid-cols-2">
        {/* Text Section */}
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl font-bold leading-tight text-stone-900 md:text-5xl">
            Get in Touch
          </h2>
          <p className="mt-4 text-lg text-stone-600">
            We'd love to hear from you! Whether you have a question, feedback,
            or just want to say hello, please reach out to us using the form or
            through our contact information.
          </p>

          <div className="mt-12 space-y-6">
            {/* Email Block */}
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <span className="text-2xl text-orange-600">
                  <CiMail />
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">Email</h3>
                <a
                  className="text-stone-600 transition-colors hover:text-orange-600"
                  href="mailto:support@techblog.com"
                >
                  support@techblog.com
                </a>
              </div>
            </div>

            {/* Social Block */}
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <span className="text-2xl text-orange-600">
                  <MdOutlineGroup />
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">Social Media</h3>
                <div className="flex items-center gap-4 mt-1">
                  {["Twitter", "LinkedIn", "Instagram"].map((social) => (
                    <a
                      key={social}
                      className="text-stone-600 transition-colors hover:text-orange-600"
                      href="#"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8 bg-white border shadow-xl rounded-2xl border-stone-100 shadow-stone-200/50">
          <form action="#" className="space-y-6" method="POST">
            <div>
              <label className="sr-only" htmlFor="name">
                Your Name
              </label>
              <input
                className="w-full px-4 py-3 transition-all border rounded-lg outline-none bg-stone-50 border-stone-200 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                id="name"
                name="name"
                placeholder="Your Name"
                type="text"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="email">
                Your Email
              </label>
              <input
                className="w-full px-4 py-3 transition-all border rounded-lg outline-none bg-stone-50 border-stone-200 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                id="email"
                name="email"
                placeholder="Your Email"
                type="email"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="subject">
                Subject
              </label>
              <input
                className="w-full px-4 py-3 transition-all border rounded-lg outline-none bg-stone-50 border-stone-200 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                id="subject"
                name="subject"
                placeholder="Subject"
                type="text"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="message">
                Your Message
              </label>
              <textarea
                className="w-full px-4 py-3 transition-all border rounded-lg outline-none bg-stone-50 border-stone-200 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                id="message"
                name="message"
                placeholder="Your Message"
                rows="5"
              ></textarea>
            </div>
            <div>
              <button
                className="w-full px-6 py-3 font-bold text-white transition-all transform rounded-lg shadow-lg bg-orange-600 hover:bg-orange-700 hover:-translate-y-0.5 hover:shadow-orange-500/30 active:scale-95"
                type="submit"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ContactPage;
