import { Link } from "react-router-dom";
import Container from "./Container";

const Organizer = () => {
    return (
        <div className='bg-gray-200 py-16'>
            <Container>
                <div className='flex flex-col md:flex-row md:gap-10 items-center'>
                    <div className='flex-1'>
                        <img className='rounded-md' src="ab1.gif" alt="Creative Template" loading="lazy" />
                    </div>
                    <div className='flex-1 bg-white md:-ml-20 p-12 rounded-md'>
                        <h2 className='text-2xl text-gray-800 md:text-5xl font-semibold'>
                            Unlock Creative Potential with StyleShelf Templates
                        </h2>
                        <p className='text-gray-600 my-4 text-justify'>
                            StyleShelf offers a sleek and intuitive website template with modern UI components, perfect for creating stylish and functional online stores. Our customizable components are designed to enhance user experience, offering smooth navigation and seamless interactions. Build your dream site effortlessly with responsive, cutting-edge designs for any business.
                        </p>
                        <Link to='request-organizer'>
                            <button className="bg-blue-600 px-6 py-3 rounded-md text-white uppercase hover:bg-blue-700 transition">
                                Explore Templates
                            </button>
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Organizer;
