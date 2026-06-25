// import React from 'react'
import Rooms from "../../components/Rooms/Rooms";
import BookForm from "../../components/BookForm/BookForm";
import HeroSlider from "../../components/HeroSlider/HeroSlider";

import img1 from "../../assets/img/Rooms/room1.jpg";
import img2 from "../../assets/img/Rooms/room3.jpg";
import img3 from "../../assets/img/Rooms/room14.jpg";
import food from "../../assets/img/HomePage/food.jpg";
import spa from "../../assets/img/HomePage/spa.jpg";
import party from "../../assets/img/HomePage/partyImg.jpg";
import pool from "../../assets/img/HomePage/pool3.jpg";
import fitness from "../../assets/img/HomePage/fitness.jpg";
import img9 from "../../assets/img/Rooms/room13.jpg";
import Sidebar from "../../components/Sidebar/Sidebar";
import Rating from "../../components/Rating/Rating";
import { RiDoubleQuotesR } from "react-icons/ri";
import User1 from "../../assets/img/user1.png";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import introImg from "../../assets/img/Rooms/room6.jpg";
import introImg1 from "../../assets/img/Rooms/room2.jpg";
import { getLatestPromotions } from "../../services/PromotionService";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
const ScrollAnimation = ({ children, direction }) => {
  const [isMobile, setIsMobile] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 1,
  });

  useEffect(() => {
    // Kiểm tra kích thước màn hình và cập nhật isMobile
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Kiểm tra lần đầu khi render
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isMobile) {
    // Nếu là thiết bị di động, không áp dụng hiệu ứng, chỉ hiển thị nội dung
    return <div>{children}</div>;
  }

  // Nếu không phải là thiết bị di động, áp dụng hiệu ứng cuộn
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: direction === "left" ? -100 : 100 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 2 }}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [promotions, setPromotions] = useState([]);
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const result = await getLatestPromotions(page);

        setPromotions(result.data.promotionList);
        setTotalPages(result.data.totalPages); // Giả sử API trả về totalPages
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };

    fetchPromotions();
  }, [page]);

  const handlePageClick = (event) => {
    setPage(event.selected);
  };

  return (
    <>
      <HeroSlider />
      {/* <div className="container mx-auto relative">
        <div className="bg-accent/20 mt-4 p-4 lg:shadow-xl lg:absolute
        lg:left-0 lg:right-0 lg:p-0 lg:z-30 lg:-top-12">
          <BookForm />
        </div>
      </div> */}
      {/* <Rooms /> */}

      <section className="py-20 bg-white">
        <div className="container mx-auto lg:px-0">
          <div className="text-center mb-16">
            <h2 className="font-primary text-5xl lg:text-[72px] text-slate-900 tracking-wide mb-3 leading-tight">Aurora Grand</h2>
            <div className="font-tertiary uppercase text-xs lg:text-sm text-accent font-semibold tracking-[8px]">
              - Welcome to Aurora Grand Hotel -
            </div>
          </div>

          {/* intro  */}
          <div className="flex flex-col lg:flex-row gap-10 items-center mt-12 px-6">
            {/* left  */}
            <div className="w-full lg:w-[60%] lg:pr-10">
              <div className="py-4">
                <h3 className="font-primary text-3xl lg:text-4xl text-slate-800 mb-6 leading-snug">
                  Experience Elegance at Aurora Grand
                </h3>

                <p className="text-slate-500 font-secondary leading-relaxed text-base mb-8">
                  At Aurora Grand, we offer more than just a place to stay; we
                  provide an unforgettable experience. With modern architecture,
                  attentive service, and luxurious surroundings, our hotel is
                  the perfect choice for both leisure travelers and business
                  professionals. Ideally located near popular attractions and
                  bustling shopping districts, Aurora Grand makes it easy for
                  you to explore the beauty of the city. Let us pamper you with
                  top-notch services and warm hospitality, creating cherished
                  memories that will last a lifetime.
                </p>
              </div>

              <Link
                to="/rooms"
                className="inline-flex justify-center items-center h-[54px] px-8 bg-accent hover:bg-accent-hover text-white font-tertiary uppercase text-sm tracking-[3px] rounded-xl shadow-md transition-all active:scale-95"
              >
                See our rooms
              </Link>
            </div>

            {/* right  */}
            <div className="w-full lg:w-[40%]">
              <img
                src={introImg}
                alt="Aurora Grand Lobby"
                className="object-cover h-[380px] w-full rounded-3xl shadow-lg border border-slate-100/50 hover:scale-[1.01] transition-all duration-300"
              />
            </div>
          </div>

          {/* intro continue */}
          <div className="h-[400px] lg:h-[650px] overflow-hidden mt-16 mx-6 rounded-3xl shadow-xl relative border border-slate-100">
            <img
              src={introImg1}
              alt="Aurora Grand Pool Area"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-[6s]"
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* services */}
          <section className="pt-24 pb-10">
            <div className="text-center mb-16">
              <span className="font-tertiary uppercase text-xs text-accent tracking-[6px] font-semibold">Luxury Services</span>
              <h3 className="font-primary text-4xl text-slate-900 mt-2 relative inline-block pb-4">
                Our Services
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-accent/60"></span>
              </h3>
            </div>

            <div className="container mx-auto lg:px-0">
              <div className="space-y-20 px-6">
                {/* Room service */}
                <ScrollAnimation direction="left">
                  <div className="flex flex-col lg:flex-row items-center gap-10">
                    <div className="w-full lg:w-1/2">
                      <img
                        src={img9}
                        alt="Rooms"
                        className="w-full h-80 object-cover rounded-3xl shadow-md border border-slate-100 hover:scale-[1.01] transition-transform duration-300"
                      />
                    </div>
                    <div className="w-full lg:w-1/2 lg:pl-6">
                      <span className="font-tertiary uppercase text-xs text-accent tracking-[3px] font-semibold mb-2 block">Accommodation</span>
                      <h3 className="font-primary text-3xl text-slate-800 mb-4">Rooms & Suites</h3>
                      <p className="text-slate-500 font-secondary leading-relaxed text-base">
                        Aurora Grand’s rooms offer comfort and luxury, featuring
                        elegant designs, premium amenities, and breathtaking
                        views for a perfect stay.
                      </p>
                    </div>
                  </div>
                </ScrollAnimation>

                {/* Pool service */}
                <ScrollAnimation direction="right">
                  <div className="flex flex-col lg:flex-row-reverse items-center gap-10">
                    <div className="w-full lg:w-1/2">
                      <img
                        src={pool}
                        alt="Pool"
                        className="w-full h-80 object-cover rounded-3xl shadow-md border border-slate-100 hover:scale-[1.01] transition-transform duration-300"
                      />
                    </div>
                    <div className="w-full lg:w-1/2 lg:pr-6">
                      <span className="font-tertiary uppercase text-xs text-accent tracking-[3px] font-semibold mb-2 block">Recreation</span>
                      <h3 className="font-primary text-3xl text-slate-800 mb-4">Infinity Pool</h3>
                      <p className="text-slate-500 font-secondary leading-relaxed text-base">
                        Our expansive, crystal-clear pool is the ideal place to
                        unwind, have fun, and enjoy relaxing moments under the
                        sun.
                      </p>
                    </div>
                  </div>
                </ScrollAnimation>

                {/* Dining service */}
                <ScrollAnimation direction="left">
                  <div className="flex flex-col lg:flex-row items-center gap-10">
                    <div className="w-full lg:w-1/2">
                      <img
                        src={food}
                        alt="Dining"
                        className="w-full h-80 object-cover rounded-3xl shadow-md border border-slate-100 hover:scale-[1.01] transition-transform duration-300"
                      />
                    </div>
                    <div className="w-full lg:w-1/2 lg:pl-6">
                      <span className="font-tertiary uppercase text-xs text-accent tracking-[3px] font-semibold mb-2 block">Gastronomy</span>
                      <h3 className="font-primary text-3xl text-slate-800 mb-4">Fine Dining</h3>
                      <p className="text-slate-500 font-secondary leading-relaxed text-base">
                        Enjoy exquisite dining at Aurora Grand with a diverse
                        menu that blends local flavors and international
                        cuisine, served in an elegant setting.
                      </p>
                    </div>
                  </div>
                </ScrollAnimation>

                {/* Events and party service */}
                <ScrollAnimation direction="right">
                  <div className="flex flex-col lg:flex-row-reverse items-center gap-10">
                    <div className="w-full lg:w-1/2">
                      <img
                        src={party}
                        alt="Events & party"
                        className="w-full h-80 object-cover rounded-3xl shadow-md border border-slate-100 hover:scale-[1.01] transition-transform duration-300"
                      />
                    </div>
                    <div className="w-full lg:w-1/2 lg:pr-6">
                      <span className="font-tertiary uppercase text-xs text-accent tracking-[3px] font-semibold mb-2 block">Celebrations</span>
                      <h3 className="font-primary text-3xl text-slate-800 mb-4">Events & Banquets</h3>
                      <p className="text-slate-500 font-secondary leading-relaxed text-base">
                        Aurora Grand is the perfect venue for hosting events and
                        parties. With flexible spaces and a professional team,
                        every event is crafted to be truly special.
                      </p>
                    </div>
                  </div>
                </ScrollAnimation>

                {/* Spa service */}
                <ScrollAnimation direction="left">
                  <div className="flex flex-col lg:flex-row items-center gap-10">
                    <div className="w-full lg:w-1/2">
                      <img
                        src={spa}
                        alt="Spa"
                        className="w-full h-80 object-cover rounded-3xl shadow-md border border-slate-100 hover:scale-[1.01] transition-transform duration-300"
                      />
                    </div>
                    <div className="w-full lg:w-1/2 lg:pl-6">
                      <span className="font-tertiary uppercase text-xs text-accent tracking-[3px] font-semibold mb-2 block">Wellness</span>
                      <h3 className="font-primary text-3xl text-slate-800 mb-4">Luxury Spa</h3>
                      <p className="text-slate-500 font-secondary leading-relaxed text-base">
                        Indulge in ultimate relaxation at Aurora Grand’s spa,
                        offering rejuvenating treatments and therapies designed
                        to revitalize your body and mind in a tranquil
                        atmosphere.
                      </p>
                    </div>
                  </div>
                </ScrollAnimation>

                {/* Fitness service */}
                <ScrollAnimation direction="right">
                  <div className="flex flex-col lg:flex-row-reverse items-center gap-10">
                    <div className="w-full lg:w-1/2">
                      <img
                        src={fitness}
                        alt="Fitness"
                        className="w-full h-80 object-cover rounded-3xl shadow-md border border-slate-100 hover:scale-[1.01] transition-transform duration-300"
                      />
                    </div>
                    <div className="w-full lg:w-1/2 lg:pr-6">
                      <span className="font-tertiary uppercase text-xs text-accent tracking-[3px] font-semibold mb-2 block">Activity</span>
                      <h3 className="font-primary text-3xl text-slate-800 mb-4">Fitness Center</h3>
                      <p className="text-slate-500 font-secondary leading-relaxed text-base">
                        Stay fit and healthy in our well-equipped fitness
                        center, offering a variety of machines and workout
                        spaces to cater to your fitness routine.
                      </p>
                    </div>
                  </div>
                </ScrollAnimation>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Discount Events Section */}
      <section className="bg-slate-950 py-20 relative overflow-hidden">
        <div className="container mx-auto lg:px-0">
          <div className="text-center mb-16">
            <span className="font-tertiary uppercase text-xs text-accent tracking-[6px] font-semibold">Special Offers</span>
            <h3 className="font-primary text-4xl text-white mt-2 relative inline-block pb-4">
              Promotions
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-accent/60"></span>
            </h3>
          </div>

          {/* Promotion List */}
          <div className="px-6">
            {promotions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {promotions.map((promotion) => (
                  <div
                    key={promotion.id}
                    className="relative border border-white/5 rounded-2xl bg-white shadow-xl overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    {/* Promotion Image & Percent Badge */}
                    <div className="w-full h-48 relative overflow-hidden bg-slate-900">
                      <img
                        src={promotion.promotionPhotoUrl}
                        alt={promotion.description}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-rose-500 text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm">
                        {promotion.percentOfDiscount}% OFF
                      </div>
                    </div>

                    {/* Promotion Details */}
                    <div className="p-6 flex flex-col flex-1 bg-white">
                      <h3 className="font-primary text-xl text-slate-800 mb-2 font-semibold">
                        {promotion.promotionTitle}
                      </h3>
                      <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[40px]">
                        {promotion.description}
                      </p>
                      
                      <div className="mt-auto space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-450">
                        <div className="flex items-center justify-between">
                          <span>Room Types:</span>
                          <span className="font-semibold text-slate-700 text-right capitalize truncate max-w-[150px]">
                            {promotion.listRoomTypes.join(", ")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Validity:</span>
                          <span className="font-medium text-slate-600">
                            {promotion.startDate} to {promotion.endDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dashed divider line for tear-off ticket look */}
                    <div className="relative flex items-center px-5 bg-white py-1">
                      <div className="w-full border-t border-dashed border-slate-200"></div>
                      {/* Left Circle cutout - blends with dark slate-950 */}
                      <div className="absolute -left-2.5 w-5 h-5 bg-slate-950 border-r border-slate-950/20 rounded-full"></div>
                      {/* Right Circle cutout - blends with dark slate-950 */}
                      <div className="absolute -right-2.5 w-5 h-5 bg-slate-950 border-l border-slate-950/20 rounded-full"></div>
                    </div>

                    {/* Action Button */}
                    <div className="p-4 bg-slate-50/50 flex justify-center border-t border-slate-50">
                      <Link
                        to="/rooms"
                        className="text-xs font-semibold text-accent hover:text-accent-hover tracking-wider uppercase transition-colors"
                      >
                        Book Rooms Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-12">
                No promotions available.
              </p>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <ReactPaginate
            breakLabel="..."
            nextLabel="NEXT →"
            onPageChange={handlePageClick}
            forcePage={page}
            pageRangeDisplayed={5}
            pageCount={totalPages}
            previousLabel="← PREVIOUS"
            className="flex space-x-1.5 items-center justify-center"
            pageClassName="page-item"
            pageLinkClassName="px-3.5 py-2 border border-white/10 hover:bg-white/10 rounded-xl text-slate-350 text-sm font-medium transition-all"
            activeLinkClassName="active bg-accent text-white border-accent hover:bg-accent-hover"
            previousClassName="page-item"
            previousLinkClassName="px-3.5 py-2 border border-white/10 hover:bg-white/10 rounded-xl text-slate-350 text-sm font-medium transition-all"
            nextClassName="page-item"
            nextLinkClassName="px-3.5 py-2 border border-white/10 hover:bg-white/10 rounded-xl text-slate-355 text-sm font-medium transition-all"
            breakClassName="page-item"
            breakLinkClassName="px-3.5 py-2 text-slate-600"
            disabledLinkClassName="opacity-40 cursor-not-allowed hover:bg-transparent"
            containerClassName="pagination"
          />
        </div>
      </section>

      {/* Ratings Section */}
      {/* <section className="py-14">
        <div className="container mx-auto lg:px-0">
          <h3 className="h3 text-[45px] text-center mb-12">
            What Our Guests Say
          </h3>
          <div className="flex flex-col space-y-8">
            Sample Review 1
            <div className="flex items-start bg-white rounded-lg shadow-md p-6">
              <img
                src={User1}
                alt="User 1"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h4 className="text-lg font-semibold">John Doe</h4>
                <div className="flex space-x-1">
                  <Rating rating={5} />
                </div>
                <p className="text-gray-600 mt-2">
                  <RiDoubleQuotesR className="inline-block text-gray-400" />
                  An unforgettable stay! The service was exceptional, and the
                  facilities were top-notch.
                </p>
              </div>
            </div>

            Sample Review 2
            <div className="flex items-start bg-white rounded-lg shadow-md p-6">
              <img
                src={User1}
                alt="User 2"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h4 className="text-lg font-semibold">Jane Smith</h4>
                <div className="flex space-x-1">
                  <Rating rating={4} />
                </div>
                <p className="text-gray-600 mt-2">
                  <RiDoubleQuotesR className="inline-block text-gray-400" />
                  Great experience! The room was clean and cozy, but I wish the
                  pool was open longer.
                </p>
              </div>
            </div>

            Sample Review 3
            <div className="flex items-start bg-white rounded-lg shadow-md p-6">
              <img
                src={User1}
                alt="User 3"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h4 className="text-lg font-semibold">Michael Lee</h4>
                <div className="flex space-x-1">
                  <Rating rating={5} />
                </div>
                <p className="text-gray-600 mt-2">
                  <RiDoubleQuotesR className="inline-block text-gray-400" />I
                  had a wonderful time! Highly recommend the spa and dining
                  options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
};

export default Home;
