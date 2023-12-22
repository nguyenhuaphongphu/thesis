import { useState, useRef, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import validator from "validator";
import Swal from "sweetalert2";
import {
  CalendarDaysIcon,
  HandRaisedIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";
import callApi from "./apicaller";

const stats = [
  { id: 1, name: "Giao dịch 24/24 giờ", value: "44.453 +" },
  { id: 2, name: "Hơn ngàn sản phẩm chất lượng", value: "1.034 +" },
  { id: 3, name: "Hàng ngàn khách hàng uy tín", value: "6,000 +" },
];
const products = [
  {
    id: 1,
    name: "Earthen Bottle",
    href: "#",
    price: "$48",
    imageSrc:
      "http://localhost:8888/images/Áo Polo Nam Tay Bo Raglan Phối Màu.jpg",
    imageAlt:
      "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
  },
  {
    id: 2,
    name: "Nomad Tumbler",
    href: "#",
    price: "$35",
    imageSrc:
      "http://localhost:8888/images/Áo Polo Nam Tay Ngắn Họa Tiết In Form Regular.jpg",
    imageAlt:
      "Olive drab green insulated bottle with flared screw lid and flat top.",
  },
  {
    id: 3,
    name: "Focus Paper Refill",
    href: "#",
    price: "$89",
    imageSrc:
      "http://localhost:8888/images/Áo Thun Nam Tay Ngắn Cổ Tròn Họa Tiết.jpg",
    imageAlt:
      "Person using a pen to cross a task off a productivity paper card.",
  },
  {
    id: 4,
    name: "Machined Mechanical Pencil",
    href: "#",
    price: "$35",
    imageSrc:
      "http://localhost:8888/images/Áo Sơ Mi Nam Tay Dài Flannel Kẻ Caro Nhãn Trang Trí Form Loose.jpg",
    imageAlt:
      "Hand holding black machined steel mechanical pencil with brass tip and top.",
  },
  {
    id: 5,
    name: "Earthen Bottle",
    href: "#",
    price: "$48",
    imageSrc:
      "http://localhost:8888/images/Áo Sơ Mi Nam Tay Dài Cổ V Túi Đắp Trơn Form Boxy.jpg",
    imageAlt:
      "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
  },
  {
    id: 6,
    name: "Nomad Tumbler",
    href: "#",
    price: "$35",
    imageSrc:
      "http://localhost:8888/images/Áo Sơ Mi Nam Tay Dài Sợi Coffee Cổ Gài Nút Trơn.jpg",
    imageAlt:
      "Olive drab green insulated bottle with flared screw lid and flat top.",
  },
  {
    id: 7,
    name: "Focus Paper Refill",
    href: "#",
    price: "$89",
    imageSrc:
      "http://localhost:8888/images/Áo Polo Nam Vải Gân Phối Bo Nẹp Trang Trí.jpg",
    imageAlt:
      "Person using a pen to cross a task off a productivity paper card.",
  },
  {
    id: 8,
    name: "Machined Mechanical Pencil",
    href: "#",
    price: "$35",
    imageSrc: "http://localhost:8888/images/Áo polo vải gân phối viền.jpg",
    imageAlt:
      "Hand holding black machined steel mechanical pencil with brass tip and top.",
  },
  {
    id: 9,
    name: "Focus Paper Refill",
    href: "#",
    price: "$89",
    imageSrc:
      "http://localhost:8888/images/Áo Len Nam Dệt Kim Tay Dài Acrylic Cổ Cao Form Fitted.jpg",
    imageAlt:
      "Person using a pen to cross a task off a productivity paper card.",
  },
  {
    id: 10,
    name: "Machined Mechanical Pencil",
    href: "#",
    price: "$35",
    imageSrc:
      "http://localhost:8888/images/Áo Gile Len Nam Dệt Kim Sát Nách.jpg",
    imageAlt:
      "Hand holding black machined steel mechanical pencil with brass tip and top.",
  },
];

const comments = [
  {
    name: "Trương Minh Trung",
    comment:
      "Một chuỗi cửa hàng ứng ý từ trước đến nay. Sản phẩm chất lượng trong từng đường kim, mũi chỉ. Hy vọng shop sẽ giữ vững được trạng thái này.",
    role: "Lập trình viên",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Trần Gia Lạc",
    comment:
      "Cửa hàng phục vụ tận tình, chuyên nghiệp. Nhân viên bán hàng dễ thương, sẽ ghé lại thêm nhiều lần nữa.",
    role: "Nhân viên bán hàng",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Lê Trường vũ",
    comment:
      "Cảm thấy rất hài lòng trong việc shop chuẩn bị hàng và giao hàng cực kỳ nhanh. Sản phẩm lại chất lượng, đóng gói cẩn thận.",
    role: "Phục vụ",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

export default function LandingPage() {
  const [latitudeUser, setLatitudeUser] = useState(0);
  const [longitudeUser, setLongitudeUser] = useState(0);

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitudeUser(position.coords.latitude);
      setLongitudeUser(position.coords.longitude);
    });
  }

  const scrollHlProduct = useRef(null);
  const scrollUs = useRef(null);
  const scrollBranch = useRef(null);
  const scrollFirstPage = useRef(null);

  const [dataBranch, setDataBranch] = useState([]);

  const [pageComment, setPageComment] = useState(0);

  useEffect(() => {
    callApi(`branch`, "get", null).then((res) => {
      setDataBranch(res.data);
    });
    const interval = setInterval(() => {
      if (pageComment === 2) {
        setPageComment(0);
      } else {
        setPageComment(pageComment + 1);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [pageComment]);

  function computeDistance(prevLat, prevLong, lat, long) {
    const prevLatInRad = toRad(prevLat);
    const prevLongInRad = toRad(prevLong);
    const latInRad = toRad(lat);
    const longInRad = toRad(long);

    return (
      6377.830272 *
      Math.acos(
        Math.sin(prevLatInRad) * Math.sin(latInRad) +
          Math.cos(prevLatInRad) *
            Math.cos(latInRad) *
            Math.cos(longInRad - prevLongInRad)
      )
    );
  }

  function toRad(angle) {
    return (angle * Math.PI) / 180;
  }

  const proposeBranch = () => {
    var newBranch = dataBranch.map((value) => {
      return Object.assign(value, { distance: 0 });
    });
    const _newBranch = newBranch.map((item) => {
      return {
        ...item,
        distance: computeDistance(
          item.latitude,
          item.longitude,
          latitudeUser,
          longitudeUser
        ),
      };
    });
    return _newBranch.reduce(
      (prev, curr) => (prev.distance < curr.distance ? prev : curr),
      0
    );
  };

  const handleClickHlProduct = () => {
    setMobileMenuOpen(false);
    scrollHlProduct.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleClickUs = () => {
    setMobileMenuOpen(false);
    scrollUs.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleClickBranch = () => {
    setMobileMenuOpen(false);
    scrollBranch.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleClickFirstPage = () => {
    setMobileMenuOpen(false);
    scrollFirstPage.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function logOut() {
    localStorage.clear();
    window.location.reload();
  }

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleInfoUser = (e) => {
    e.preventDefault();
    if (firstName === "" || lastName === "" || phone === "" || email === "") {
      Swal.fire({
        title: "Lỗi!",
        text: "Vui lòng điền đầy đủ thông tin!",
        icon: "warning",
      });
    } else if (!validator.isEmail(email)) {
      Swal.fire({
        title: "Lỗi!",
        text: "Email không hợp lệ!",
        icon: "warning",
      });
    } else {
      const data = {
        lastName: lastName,
        firstName: firstName,
        phone: phone,
        email: email,
      };
      callApi("infoCustomer", "post", data).then((res) => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        Swal.fire({
          title: "Thành công!",
          text: "Cám ơn bạn đã quan tâm!",
          icon: "success",
        });
      });
    }
  };

  function login() {
    if (localStorage.getItem("user")) {
      return (
        <>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <button
              onClick={logOut}
              class="text-sm bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-3 border border-blue-500 hover:border-transparent rounded"
            >
              Đăng xuất
            </button>
          </div>
        </>
      );
    } else
      return (
        <>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <button class="text-sm bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-3 border border-blue-500 hover:border-transparent rounded mr-3">
              <Link to="/login">Đăng nhập</Link>
            </button>
            <button class="text-sm bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-3 border border-blue-500 hover:border-transparent rounded">
              <Link to="/register">Đăng ký</Link>
            </button>
          </div>
        </>
      );
  }

  function loginMobile() {
    if (localStorage.getItem("user")) {
      return (
        <>
          <a
            onClick={logOut}
            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
          >
            Đăng xuất
          </a>
        </>
      );
    } else
      return (
        <>
          <a
            href="/login"
            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
          >
            Đăng nhập
          </a>
          <a
            href="/register"
            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
          >
            Đăng ký
          </a>
        </>
      );
  }

  function nearestBranch() {
    if (latitudeUser !== 0) {
      return (
        <>
          {/*neastest branch */}
          <div className="bg-white">
            <div className="mx-auto max-w-7xl py-4 sm:px-6 sm:py-16 lg:px-8">
              <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-8 md:pt-24 lg:flex lg:gap-x-20 lg:px-12 lg:pt-0">
                <svg
                  viewBox="0 0 1024 1024"
                  className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
                  aria-hidden="true"
                >
                  <circle
                    cx={512}
                    cy={512}
                    r={512}
                    fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                    fillOpacity="0.7"
                  />
                  <defs>
                    <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                      <stop stopColor="#7775D6" />
                      <stop offset={1} stopColor="#E935C1" />
                    </radialGradient>
                  </defs>
                </svg>
                <div className="mx-auto max-w-md text-center lg:flex-auto lg:py-32 lg:text-left">
                  <div className="flex justify-start">
                    <img
                      src="http://localhost:8888/images/map.png"
                      className="h-10 mr-2"
                    ></img>
                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      {proposeBranch().name}
                    </h1>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    đang ở gần bạn nhất
                  </h2>
                  <div className="mt-6 text-lg leading-8 text-gray-300">
                    <ul className="list-disc ml-6">
                      <li>{proposeBranch().phone}</li>
                      <li>{proposeBranch().email}</li>
                      <li>{proposeBranch().address}</li>
                    </ul>
                  </div>
                  <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                    <Link
                      to={`/productList/${proposeBranch().id}`}
                      className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Mua ngay
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-4 sm:gap-6 lg:gap-8 py-12">
                  <img
                    src="http://localhost:8888/images/Áo Sơ Mi Nam Tay Dài Flannel Túi Đắp Kẻ Caro Form Oversize.jpg"
                    className="rounded-lg bg-gray-100 h-64 transition duration-300 ease-in-out hover:scale-110"
                  />
                  <img
                    src="http://localhost:8888/images/Áo Polo Nam Interlock Pique Sọc Ngang Nhãn Trang Trí Form Boxy.jpg"
                    alt="Top down view of walnut card tray with embedded magnets and card groove."
                    className="rounded-lg bg-gray-100 h-64 transition duration-300 ease-in-out hover:scale-110"
                  />
                  <img
                    src="http://localhost:8888/images/Áo Khoác Nam Flannel Tay Dài Khóa Kéo Kẻ Caro.jpg"
                    alt="Side of walnut card tray with card groove and recessed card area."
                    className="rounded-lg bg-gray-100 h-64 transition duration-300 ease-in-out hover:scale-110"
                  />
                  <img
                    src="http://localhost:8888/images/Áo Thun Nam Tay Ngắn Cổ Tròn Họa Tiết.jpg"
                    alt="Walnut card tray filled with cards and card angled in dedicated groove."
                    className="rounded-lg bg-gray-100 h-64 transition duration-300 ease-in-out hover:scale-110"
                  />
                  <img
                    src="http://localhost:8888/images/Quần Jean Nam Ống Ôm Phối Dây Kéo Lai Form Skinny Crop.jpg"
                    alt="Side of walnut card tray with card groove and recessed card area."
                    className="rounded-lg bg-gray-100 h-64 transition duration-300 ease-in-out hover:scale-110"
                  />
                  <img
                    src="http://localhost:8888/images/Áo Khoác Chần Bông Nam Cổ Trụ.jpg"
                    alt="Walnut card tray filled with cards and card angled in dedicated groove."
                    className="rounded-lg bg-gray-100 h-64 transition duration-300 ease-in-out hover:scale-110"
                  />
                </div>
                {/* <div className="-mt-2 p-2 lg:mt-0 py-12 lg:w-full lg:max-w-md lg:flex-shrink-0">
                  <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center relative h-full">
                    <div className="mx-auto max-w-xs px-8">
                      <p className="text-base font-semibold text-gray-600">
                        Tổng giá trị đơn hàng
                      </p>
                      <p className="mt-6 flex items-baseline justify-center gap-x-2">
                        <span className="text-5xl font-bold tracking-tight text-gray-900">
                          ưert
                        </span>
                      </p>
                      <Link className="mt-10 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Xem chi tiết
                      </Link>
                      <p className="mt-6 text-xs leading-5 text-gray-600">
                        Invoices and receipts available for easy company
                        reimbursement
                      </p>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </>
      );
    }
  }

  return (
    <>
      {/* header */}
      <div
        ref={scrollFirstPage}
        className="relative isolate flex items-center gap-x-6 bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1"
      >
        <div
          className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
          aria-hidden="true"
        >
          <div
            className="aspect-[577/310] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
            style={{
              clipPath:
                "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
            }}
          />
        </div>
        <div
          className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
          aria-hidden="true"
        >
          <div
            className="aspect-[577/310] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
            style={{
              clipPath:
                "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
            }}
          />
        </div>
        <marquee behavior="scroll" direction="left" className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-sm leading-6 text-gray-900">
            <strong className="font-semibold">Thời trang nam 2023</strong>
            <svg
              viewBox="0 0 2 2"
              className="mx-2 inline h-0.5 w-0.5 fill-current"
              aria-hidden="true"
            >
              <circle cx={1} cy={1} r={1} />
            </svg>
            Đăng ký thành viên để nhận được những ưu đãi và thông báo mới nhất.
          </p>
        </marquee>
        <div className="flex flex-1 justify-end">
          <button
            type="button"
            className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
          >
            <span className="sr-only">Dismiss</span>
          </button>
        </div>
      </div>
      {/*Hero Sections*/}
      <div className="bg-white">
        <header className="absolute inset-x-0 z-50">
          <nav
            className="flex items-center justify-between p-6 lg:px-8"
            aria-label="Global"
          >
            <div className="flex lg:flex-1">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-12 w-auto"
                  src="http://localhost:8888/images/logoPP.png"
                  alt=""
                />
              </a>
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              <button
                className="text-sm font-semibold leading-6 text-gray-900"
                onClick={handleClickUs}
              >
                Về chúng tôi
              </button>
              <button
                className="text-sm font-semibold leading-6 text-gray-900"
                onClick={handleClickHlProduct}
              >
                Sản phẩm nổi bật
              </button>
              <button
                className="text-sm font-semibold leading-6 text-gray-900"
                onClick={handleClickBranch}
              >
                Mua ngay
              </button>
              <button
                className="text-sm font-semibold leading-6 text-gray-900"
                onClick={handleClickBranch}
              >
                Liên hệ
              </button>
            </div>
            {login()}
          </nav>
          <Dialog
            as="div"
            className="lg:hidden"
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
          >
            <div className="fixed inset-0 z-50" />
            <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">Về chúng tôi</span>
                  <img
                    className="h-8 w-auto"
                    src="http://localhost:8888/images/logoPP.png"
                    alt=""
                  />
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Đóng</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    <button
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={handleClickUs}
                    >
                      Về chúng tôi
                    </button>
                    <button
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={handleClickHlProduct}
                    >
                      Sản phẩm nổi bật
                    </button>
                    <button
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={handleClickBranch}
                    >
                      Mua ngay
                    </button>
                  </div>
                  <div className="py-6">{loginMobile()}</div>
                </div>
              </div>
            </Dialog.Panel>
          </Dialog>
        </header>

        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-10">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Thời trang – cách bạn diễn tả bản thân.{" "}
                <Link to="/articles" className="font-semibold text-indigo-600">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Đọc thêm <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Người đàn ông <span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">mặc đẹp</span>
              </h1>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                vì họ biết <span class="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">họ là ai</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Cách chúng ta ăn mặc ảnh hưởng đến cách chúng ta nghĩ, cách
                chúng ta cảm nhận, cách chúng ta hành động, và cách những người
                khác hành xử với chúng ta
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <button
                  onClick={handleClickBranch}
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
      </div>
      {/*stats */}

      <div className="bg-white py-24 sm:py-15">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="mx-auto flex max-w-xs flex-col gap-y-4"
              >
                <dt className="text-base leading-7 text-gray-600 ">
                  {stat.name}
                </dt>
                <dd className="animate-rotate-x animate-infinite animate-duration-[5000ms] order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      {/*nearestBranch */}
      {nearestBranch()}
      {/*comment */}
      <section className="relative isolate overflow-hidden bg-white py-6 px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <img
            className="mx-auto h-12 mt-4 lg:mt-0 animate-wiggle-more animate-infinite"
            src="http://localhost:8888/images/comments.png"
            alt=""
          />
          <figure className="mt-10 ">
            <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
              <p>{" “ " + comments[pageComment].comment + " ” "}</p>
            </blockquote>
            <figcaption className="mt-10">
              <img
                className="mx-auto h-10 w-10 rounded-full"
                src={comments[pageComment].imageUrl}
                alt=""
              />
              <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                <div className="font-semibold text-gray-900">
                  {comments[pageComment].name}
                </div>
                <svg
                  viewBox="0 0 2 2"
                  width={3}
                  height={3}
                  aria-hidden="true"
                  className="fill-gray-900"
                >
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <div className="text-gray-600">
                  {comments[pageComment].role}
                </div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>
      {/*why us */}
      <div class="bg-white sm:pb-10" ref={scrollUs}>
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-6xl">
            <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              <div class="relative pl-16">
                <dt class="text-base font-semibold leading-7 text-gray-900">
                  <div class="absolute left-1 top-0 flex h-12 w-12 items-center justify-center rounded-lg">
                    <img src="http://localhost:8888/images/free-shipping.png" />
                  </div>
                  Giao hàng nhanh chóng
                </dt>
                <dd class="mt-2 text-base leading-7 text-gray-600">
                  Giao hàng nhanh chóng từ 3 đến 5 ngày phụ thuộc vào vị trí
                  khách đặt.
                </dd>
              </div>
              <div class="relative pl-16">
                <dt class="text-base font-semibold leading-7 text-gray-900">
                  <div class="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg">
                    <img src="http://localhost:8888/images/cyber-security.png" />
                  </div>
                  An toàn bảo mật
                </dt>
                <dd class="mt-2 text-base leading-7 text-gray-600">
                  Đảm bảo an toàn bảo mật thông tin của khách hàng vì khách hàng
                  là thượng đế.
                </dd>
              </div>
              <div class="relative pl-16">
                <dt class="text-base font-semibold leading-7 text-gray-900">
                  <div class="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg">
                    <img src="http://localhost:8888/images/high-quality.png" />
                  </div>
                  Sản phẩm chất lượng
                </dt>
                <dd class="mt-2 text-base leading-7 text-gray-600">
                  Sản phẩm chất lượng từ nhiều nguồn nhiều thương hiệu uy tín.
                </dd>
              </div>
              <div class="relative pl-16">
                <dt class="text-base font-semibold leading-7 text-gray-900">
                  <div class="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg">
                    <img src="http://localhost:8888/images/prize.png" />
                  </div>
                  Miễn phí vận chuyển
                </dt>
                <dd class="mt-2 text-base leading-7 text-gray-600">
                  Luôn luôn miễn phí vận chuyển trên một hoặc nhiều sản phẩm.
                </dd>
              </div>
              <div class="relative pl-16">
                <dt class="text-base font-semibold leading-7 text-gray-900">
                  <div class="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg">
                    <img src="http://localhost:8888/images/working-hours.png" />
                  </div>
                  Đổi trả linh hoạt
                </dt>
                <dd class="mt-2 text-base leading-7 text-gray-600">
                  Đổi trả sản phẩm số lượng nhiều một cách nhanh chóng ở bất kỳ
                  lỗi nào.
                </dd>
              </div>
              <div class="relative pl-16">
                <dt class="text-base font-semibold leading-7 text-gray-900">
                  <div class="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg">
                    <img src="http://localhost:8888/images/cashless-payment.png" />
                  </div>
                  Thanh toán dễ dàng
                </dt>
                <dd class="mt-2 text-base leading-7 text-gray-600">
                  Thanh toán dễ dàng, uy tín bằng nhiều hình thức , dù ở đâu và
                  bằng thiết bị nào.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      {/*highlight product */}
      <div className="bg-white" ref={scrollHlProduct}>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-5 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-8 ">
            {products.map((product) => (
              <a
                key={product.id}
                className="group"
                onClick={() => handleZoomInImage(product.imageSrc)}
              >
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="h-full w-full object-cover object-center transition duration-300 ease-in-out hover:scale-110"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      {/*brands */}
      <div className="bg-white py-24 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            <img
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 transition duration-300 ease-in-out hover:scale-125"
              src="https://tailwindui.com/img/logos/158x48/transistor-logo-gray-900.svg"
              alt="Transistor"
              width={158}
              height={48}
            />
            <img
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 transition duration-300 ease-in-out hover:scale-125"
              src="https://tailwindui.com/img/logos/158x48/reform-logo-gray-900.svg"
              alt="Reform"
              width={158}
              height={48}
            />
            <img
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 transition duration-300 ease-in-out hover:scale-125"
              src="https://tailwindui.com/img/logos/158x48/tuple-logo-gray-900.svg"
              alt="Tuple"
              width={158}
              height={48}
            />
            <img
              className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1 transition duration-300 ease-in-out hover:scale-125"
              src="https://tailwindui.com/img/logos/158x48/savvycal-logo-gray-900.svg"
              alt="SavvyCal"
              width={158}
              height={48}
            />
            <img
              className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1 transition duration-300 ease-in-out hover:scale-125"
              src="https://tailwindui.com/img/logos/158x48/statamic-logo-gray-900.svg"
              alt="Statamic"
              width={158}
              height={48}
            />
          </div>
        </div>
      </div>
      {/*branch */}
      <div
        className="relative isolate overflow-hidden bg-gray-900 py-12 sm:py-12 grid grid-cols-1 lg:grid-cols-2"
        ref={scrollBranch}
      >
        <div>
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center"
          />
          <div
            className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div
            className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
            aria-hidden="true"
          >
            <div
              className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div>
            <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-10">
              <div className="mx-auto max-w-2xl lg:mx-0">
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                  Mua hàng ngay
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  Hãy chọn lựa một chi nhánh gần gần gũi với bạn để nhận được
                  hàng trong thời gian ngắn nhất nhé!
                </p>
              </div>
              <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-white lg:grid-cols-3 md:flex lg:gap-x-10">
                  {dataBranch.map((branch, index) => (
                    <Link key={index} to={`/productList/${branch.id}`}>
                      {branch.name} <span aria-hidden="true">&rarr;</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto grid max-w-2xl grid-cols-2 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                <div className="flex flex-col items-start">
                  <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                    <CalendarDaysIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <dt className="mt-4 font-semibold text-white">
                    Phản hồi liên tục
                  </dt>
                  <dd className="mt-2 leading-7 text-gray-400">
                    Luôn luôn có đội ngũ phản hồi tin nhắn 24/24 giúp khách hàng
                    có những trải nghiệm tốt nhất.
                  </dd>
                </div>
                <div className="flex flex-col items-start">
                  <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                    <HandRaisedIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <dt className="mt-4 font-semibold text-white">Không spam</dt>
                  <dd className="mt-2 leading-7 text-gray-400">
                    Để tránh những rủi ro không mong muốn như bỏ sót Email vui
                    lòng khách không gửi nhiều lần.
                  </dd>
                </div>
              </div>
            </div>
          </div>
          <div
            className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
            aria-hidden="true"
          >
            <div
              className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>

        <form onSubmit={handleInfoUser} className="mx-auto">
          <p className="mb-4 text-white leading-8 text-gray-600">
            Điền thông tin cá nhân để được tư vấn về các sản phẩm miễn phí.
          </p>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-semibold leading-6 text-gray-900 text-white"
              >
                Họ ( * )
              </label>
              <div className="mt-2.5">
                <input
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  name="last-name"
                  id="last-name"
                  value={lastName}
                  autoComplete="family-name"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="last-name"
                className="block text-sm font-semibold leading-6 text-gray-900 text-white"
              >
                Tên ( * )
              </label>
              <div className="mt-2.5">
                <input
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="phone-number"
                className="block text-sm font-semibold leading-6 text-gray-900 text-white"
              >
                Số điện thoại ( * )
              </label>
              <div className="relative mt-2.5">
                <input
                value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold leading-6 text-gray-900 text-white"
              >
                Email ( * )
              </label>
              <div className="mt-2.5">
                <input
                value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          <p className="mt-4 block text-sm font-semibold leading-6 text-gray-900 text-white">
            ( * ) yêu cầu
          </p>
          <div className="mt-4">
            <button
              type="submit"
              className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Nhận tư vấn
            </button>
          </div>
        </form>
      </div>
      <div
        className="fixed bottom-3 right-3 w-auto"
        onClick={handleClickFirstPage}
      >
        <div class="float-right px-5 py-2 animate-bounce">
          <ArrowUpCircleIcon
            className="h-6 w-6 lg:h-12 lg:w-12 text-cyan-600"
            aria-hidden="true"
          />
        </div>
      </div>
    </>
  );
}
