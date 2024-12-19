import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./banner.css";

const images = [
  "/img1.jpg",
  "/img2.jpg",
  "/img3.jpg",
  "/img4.jpg",
  "/img5.jpg",
  "/img6.jpg",
];

const MagicBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isNext, setIsNext] = useState(false);
  const [isPrev, setIsPrev] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === images.length - 1 ? 0 : prevSlide + 1
    );
    setIsNext(true);
    setIsPrev(false);
    setTimeout(() => setIsNext(false), 500); 
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? images.length - 1 : prevSlide - 1
    );
    setIsPrev(true);
    setIsNext(false);
    setTimeout(() => setIsPrev(false), 500); 
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 3500);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  return (
    <div className="mt-12 lg:mt-10">
      <div className={`carousel ${isNext ? "next" : ""} ${isPrev ? "prev" : ""}`}>
        <div className="list">
          {images.map((img, index) => (
            <div
              className="item"
              key={index}
              style={{ display: currentSlide === index ? "block" : "none" }}
            >
              <img
                className="brightness-[0.60]"
                src={img}
                alt={`Slide ${index + 1}`}
              />
              <div className="content">
                <div>
                  <div className="my-5">
                    <h1 className="text-3xl lg:text-6xl font-bold text-slate-200">
                      Premium UI
                    </h1>
                  </div>
                  <div className="my-5">
                    <h1 className="drop-shadow-2xl text-slate-200 text-5xl lg:text-7xl font-bold">
                      Get Now!
                    </h1>
                  </div>
                </div>
                <Link to="/events">
                  <button
                    type="button"
                    className="mt-14 text-white bg-gradient-to-r bg-primary radient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-lg px-7 py-2 text-center mb-2"
                  >
                    See More
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="thumbnail">
          {images.map((img, index) => (
            <div
              key={index}
              className={`item ${
                currentSlide === index
                  ? "border-4 rounded-3xl border-rose-500"
                  : ""
              }`}
              onClick={() => setCurrentSlide(index)}
            >
              <img src={img} alt={`Thumbnail ${index + 1}`} />
            </div>
          ))}
        </div>

        <div className="arrows">
          <button id="prev" onClick={prevSlide}>
            {"<"}
          </button>
          <button id="next" onClick={nextSlide}>
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MagicBanner;
