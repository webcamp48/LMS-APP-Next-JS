import Image from "next/image";

const Hero = () => {
  return (
    <section className="dark:bg-gradient-to-b from-gray-900 to-black text-white min-h-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
        {/* Left side - Image */}
        <div className="mb-10 md:mb-0 md:w-1/2 flex justify-center">
          <div className="relative w-[70vw] h-[70vw] sm:w-[50vh] sm:h-[50vh] lg:w-[70vh] lg:h-[70vh] hero_animation rounded-full">
            <Image
              src={require("./../../../public/assets/hero.svg")}
              alt="Hero Image"
              fill
              priority 
              sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="w-[90%] h-[auto]"
            />
          </div>
        </div>

        {/* Right side - Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-[#374151] dark:text-white">
            Improve Your <span className="text-[#F05A7E]">Online Learning</span> Experience Better Instantly
          </h1>
          <p className="text-md sm:text-lg lg:text-xl mb-6 text-[#374151] dark:text-white">
            We have 30k+ Online courses & 400K+ Online registered students. Find your desired Courses from them.
          </p>

          {/* Search bar */}
          <div className="flex justify-center md:justify-start mb-6">
            <input
              type="text"
              placeholder="Search Courses..."
              className="py-2 px-4 rounded-l-lg w-full md:w-72 lg:w-96 text-black dark:bg-white bg-gray-300 focus:outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg">
              Search
            </button>
          </div>

          {/* Additional Information */}
          <div className="flex items-center justify-center md:justify-start space-x-3">
            {/* Avatar Images */}
            <div className="flex space-x-2">
              {["client-1.png", "client-2.png", "client-3.png"].map((image, index) => (
                <div key={index} className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
                  <Image
                    src={require(`./../../../public/assets/${image}`)}
                    alt={`Client Image ${index + 1}`}
                    fill
                    priority 
                    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>

            <span className="text-xs sm:text-sm dark:text-white text-[#374151]">
              400K+ People already trusted us.{" "}
              <a href="#" className="underline text-blue-400">
                View Courses
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
