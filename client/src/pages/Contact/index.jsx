import { CiMail } from "react-icons/ci";
import { MdOutlineGroup } from "react-icons/md";

function ContactPage() {
  return (
    <main className="container px-4 py-12 mx-auto grow sm:px-6 lg:px-8 md:py-20">
      <div className="grid gap-16 md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            Get in Touch
          </h2>
          <p className="mt-4 text-lg text-black/60">
            We'd love to hear from you! Whether you have a question, feedback,
            or just want to say hello, please reach out to us using the form or
            through our contact information.
          </p>
          <div className="mt-12 space-y-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <span className="text-2xl text-blue-500 material-symbols-outlined">
                  <CiMail />
                </span>
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <a
                  className="text-black/60 hover:text-blue-500"
                  href="mailto:support@techblog.com"
                >
                  support@techblog.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <span className="text-2xl text-blue-500 material-symbols-outlined">
                  <MdOutlineGroup />
                </span>
              </div>
              <div>
                <h3 className="font-semibold">Social Media</h3>
                <div className="flex items-center gap-4 mt-1">
                  <a className="text-black/60 hover:text-blue-500" href="#">
                    Twitter
                  </a>
                  <a className="text-black/60 hover:text-blue-500" href="#">
                    LinkedIn
                  </a>
                  <a className="text-black/60 hover:text-blue-500" href="#">
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-8 bg-white rounded-lg shadow-lg dark:shadow-2xl">
          <form action="#" className="space-y-6" method="POST">
            <div>
              <label className="sr-only" htmlFor="name">
                Your Name
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg form-input bg-blue-50border-black/20 dark:border-white/20 focus:border-blue-500 focus:ring-blue-500"
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
                className="w-full px-4 py-3 rounded-lg form-input bg-blue-50border-black/20 dark:border-white/20 focus:border-blue-500 focus:ring-blue-500"
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
                className="w-full px-4 py-3 rounded-lg form-input bg-blue-50border-black/20 dark:border-white/20 focus:border-blue-500 focus:ring-blue-500"
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
                className="w-full px-4 py-3 rounded-lg form-input bg-blue-50border-black/20 dark:border-white/20 focus:border-blue-500 focus:ring-blue-500"
                id="message"
                name="message"
                placeholder="Your Message"
                rows="5"
              ></textarea>
            </div>
            <div>
              <button
                className="w-full px-6 py-3 font-bold text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-500/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-background-light"
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
