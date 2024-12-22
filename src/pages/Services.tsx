import { FC } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import { AiOutlineFieldTime } from "react-icons/ai";
import { IoTicket } from "react-icons/io5";
import { FaPeopleGroup, FaShop } from "react-icons/fa6";
import { FaShoppingBag } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { FaPeopleLine } from "react-icons/fa6";
import { BsShop } from "react-icons/bs";

const creativewebtemplate = "/CWT1.jpg";
const advanceui = "/AUI2.jpg";
const premiumpass = "/pass1.jpg";
const prodesigner = "/Designer2.jpg";


const AllServices: FC = () => {
  return (
    <Container>
      <h3 className="mt-8 mb-5 text-center uppercase text-second font-extrabold text-3xl">
        {/* Book Your Events */}
        Our Services
      </h3>
      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-24 m-3 lg:m-12">
        {/* Card 1 */}
        <ServiceCard
          imgSrc={creativewebtemplate}
          title="Creative Website Templates"
          description="Choose from a variety of fully functional and attractive templates designed to fit any business style."
          buttonText="Explore Templates"
          cardButtonText="Order Now"
          buttonLink="/create-your-event"
          gradientClass="bg-gradient-to-r bg-ternary hover:bg-gradient-to-br"
          icon={<AiOutlineFieldTime />}
          licon ={<FaCartShopping/>}
          ricon = {<FaShop/>}
          ltext = "Buy Now"
          rtext = "Discover"
        />

        {/* Card 2 */}
        <ServiceCard
          imgSrc={premiumpass}
          title="Get Premium Pass"
          description="Unlock exclusive features, premium templates, and priority support with our Premium Pass."
          buttonText="Get Premium Access"
          cardButtonText="Pro Access"
          buttonLink="/events"
          gradientClass="bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl"
          icon={<IoTicket />}
          licon ={<FaCalendarAlt/>}
          ricon = {<FaPeopleGroup/>}
          ltext = "Mark Your Calender"
          rtext = "Exclusive Membership"
        />

        {/* Card 3 */}
        <ServiceCard
          imgSrc={prodesigner}
          title="Request for a StyleShelf Designer"
          description="Connect with top-tier designers to bring your vision to life and create unique, high-quality designs."
          buttonText="Become a Professional"
          cardButtonText="Design Guru"
          buttonLink="/request-organizer"
          gradientClass="bg-gradient-to-br bg-orange hover:bg-gradient-to-bl"
          icon={<FaPeopleGroup />}
          licon ={<FaPeopleLine/>}
          ricon = {<CiLocationOn/>}
          ltext = "Join the team"
          rtext = "Work from anywhere"
        />

        {/* Card 4 */}
        <ServiceCard
          imgSrc={advanceui}
          title="Advanced UI Components"
          description="Enhance your site’s functionality with easy-to-integrate UI components built for performance."
          buttonText="Craft Stunning Website with Ease"
          cardButtonText="Shop"
          buttonLink="/shop"
          gradientClass="bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l"
          icon={<FaShoppingBag />}
          licon ={<FaCartShopping/>}
          ricon = {<BsShop/>}
          ltext = "Buy Now"
          rtext = "Explore Our Shop"
        />
      </div>
    </Container>
  );
};

interface ServiceCardProps {
  imgSrc: string;
  title: string;
  description: string;
  buttonText: string;
  cardButtonText: string;
  buttonLink: string;
  gradientClass: string;
  icon: JSX.Element;
  licon: JSX.Element;
  ricon: JSX.Element;
  ltext:String;
  rtext:String;
}

const ServiceCard: FC<ServiceCardProps> = ({
  imgSrc,
  title,
  description,
  buttonText,
  cardButtonText,
  buttonLink,
  gradientClass,
  icon,
  licon,
  ricon,
  ltext,
  rtext
}) => {
  return (
    <div className="rounded-md shadow-lg transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-lg bg-white hover:bg-gray-100">
      <div className="rounded-t-md shadow-lg h-60 relative overflow-hidden">
        <img
          src={imgSrc}
          alt={title}
          className="rounded-t-md h-full w-full object-cover transform transition-transform duration-500 hover:scale-110"
        />
        <div
          className={`absolute ${gradientClass} bottom-0 left-0 px-6 py-3 text-white font-semibold rounded-tr-md flex items-center gap-3`}
        >
          {icon}
          {cardButtonText}
        </div>
      </div>
      <div className="px-4 py-6">
        <div className="flex justify-between">
          <p className="text-sm text-black font-medium flex gap-2">
            {licon}
            {ltext}
          </p>
          <p className="text-sm text-black font-medium flex gap-1">
            {ricon}
            {rtext}
          </p>
        </div>
        <h2 className="p-1 text-center text-2xl mt-2 font-semibold text-black capitalize">
          {title}
        </h2>
        <p className="my-3 text-center text-sm text-black font-medium gap-2">
          {description}
        </p>
        <div className="flex justify-center">
          <Link to={buttonLink}>
            <button
              type="button"
              className={`text-white ${gradientClass} focus:ring-4 focus:outline-none font-medium rounded-lg lg:text-lg px-5 py-2.5 text-center mb-2`}
            >
              {buttonText}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AllServices;
