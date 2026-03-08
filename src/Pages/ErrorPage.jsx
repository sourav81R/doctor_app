import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div>
      <div className="flex h-[350px] w-full items-center justify-center overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 pt-30">
        <div className="text-center transition-all duration-700 ease-out">
          <h1 className="text-4xl font-bold text-blue-600 md:text-5xl">
            Page Not Found
          </h1>

          <p className="mt-4 text-lg">
            <span className="font-semibold">Home</span> - Services
          </p>
        </div>
      </div>

      <section className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
        <div className="w-full max-w-2xl rounded-xl bg-white p-10 text-center shadow-xl transition-all duration-700">
          <img
            src="https://cdn-icons-png.flaticon.com/512/6195/6195678.png"
            alt="404"
            decoding="async"
            loading="lazy"
            className="mx-auto mb-6 w-72 animate-pulse"
          />

          <h1 className="mb-4 text-3xl font-bold md:text-4xl">
            Oops! This Page Not Found
          </h1>

          <p className="mb-6 text-gray-500">
            We are really sorry but the page you requested is missing :(
          </p>

          <Link
            to="/"
            className="inline-flex rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition duration-300 hover:scale-105 hover:bg-blue-700"
          >
            Go Back To Home
          </Link>
        </div>
      </section>
    </div>
  );
}

export default ErrorPage;
