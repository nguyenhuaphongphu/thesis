import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import callApi from "../../apicaller";
import * as React from "react";
import Rating from "@mui/material/Rating";
import moment from "moment";
import { Fragment } from "react";
import _ from "lodash";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Tag } from "antd";
import { Carousel } from "primereact/carousel";

const navigation = [{ name: "Trang chủ", href: "/", current: false }];

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DetailProduct() {
  const navigate = useNavigate();
  const customer = JSON.parse(localStorage.getItem("user")) || [];

  const [openCart, setOpenCart] = useState(false);
  const location = useLocation();
  const { idBranch } = location.state || {};

  const { id } = useParams();
  const [idByType, setIdByType] = useState(id);
  const [data, setData] = useState("");
  const [valueRating, setValueRating] = useState(5);
  const [commentCustomer, setCommentCustomer] = useState("");
  const [dataComment, setDataComment] = useState([]);
  const [dataCustomer, setDataCustomer] = useState([]);
  const [dataBranch, setDataBranch] = useState([]);

  const [dataCheck, setDataCheck] = useState([]);

  const dataStorage = JSON.parse(localStorage.getItem(idBranch.id)) || [];

  const [pageByType, setPageByType] = useState(0);
  const [dataProductByType, setDataProductByType] = useState([]);

  const hasWindow = typeof window !== "undefined";

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);

  useEffect(() => {
    callApi(`review/product/${idByType}`, "get", null).then((res) => {
      setDataComment(res.data);
    });
    callApi(`product/${idByType}`, "get", null).then((res) => {
      setData(res.data);
    });
    callApi(`branch/${idBranch.id}`, "get", null).then((res) => {
      setDataBranch(res.data);
    });
    callApi(`auth/id/${customer.id}`, "get", null).then((res) => {
      setDataCustomer(res.data);
    });
    callApi(`product/branch/type/${idBranch.id}/${idByType}`, "get", null).then(
      (res) => {
        setDataProductByType(res.data);
      }
    );
    callApi(`bill/bought/${idBranch.id}/${id}/${customer.id}`, "get", null).then((res) => {
      setDataCheck(res.data);
    });
  }, [idByType]);

  const handleAddComment = () => {
    if (customer) {
      if(dataCheck.length > 0){
        const dataAddComment = {
          productId: data.id,
          star: valueRating,
          customer: dataCustomer,
          comment: commentCustomer,
        };
        const dataTranspose = {
          productId: data.id,
          rating: valueRating,
          userId: customer.id,
          branchId: idBranch.id,
        };
        callApi("review", "post", dataAddComment);
        callApi("transpose", "post", dataTranspose).then((res) => {
          window.location.reload();
        });
      }else{
        Swal.fire({
          icon: "info",
          text: "Mua hàng để được bình luận bạn nhé!",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        text: "Vui lòng đăng nhập!",
      });
    }
  };

  function logOut() {
    localStorage.clear();
    navigate("/");
  }

  const numberFormat = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const clearAllItem = () => {
    localStorage.removeItem(idBranch.id);
    window.location.reload();
  };

  const removeItem = (el) => {
    const newItems = dataStorage.filter((item) => item.id !== el);
    localStorage.setItem(idBranch.id, JSON.stringify(newItems));
    window.location.reload();
  };

  const [totalPrice, setTotalPrice] = useState(0);

  const onlyUnique = (value) => {
    const result = dataStorage.some((el) => {
      return el.id === value;
    });
    return result;
  };

  const addDataStorage = (product) => {
    if (onlyUnique(product.id)) {
      Swal.fire({
        icon: "warning",
        text: "Sản phẩm đã tồn tại trong giỏ hàng!",
      });
    } else {
      dataStorage.push(product);
      localStorage.setItem(idBranch.id, JSON.stringify(dataStorage));
      Swal.fire({
        icon: "success",
        text: "Thêm sản phẩm thành công",
      });
      setTotalPrice(dataStorage.reduce((a, b) => a + b.price, 0));
    }
  };

  const onChangeQty = () => {
    let totalVal = 0;
    for (let i = 0; i < dataStorage.length; i++) {
      totalVal =
        totalVal +
        dataStorage[i].price *
          window.document.getElementById(dataStorage[i].id).value;
    }
    setTotalPrice(totalVal);
  };

  const [detailBill, setDetailBill] = useState("");

  const handleAdd = async () => {
    const _items = dataStorage.map((item) => {
      return {
        ...item,
        amount: document.getElementById(item.id).value,
      };
    });

    const dataAdd = {
      totalPrice: totalPrice,
      products: _items,
      customerId: customer.id,
      customer: dataCustomer,
      branchId: idBranch.id,
      branch: dataBranch,
      description: detailBill,
    };

    callApi("bill", "post", dataAdd);

    const _itemsAdd = dataStorage.map((item) => {
      return {
        ...item,
        amount: item.amount - document.getElementById(item.id).value,
      };
    });

    const promises = [];

    _itemsAdd.map((item) => {
      const result = callApi(`product/${item.id}`, "put", item);
      promises.push(result);
    });

    const results = await Promise.all(promises);
    const actualDatas = results.map((result) => result.data);
    localStorage.removeItem(idBranch.id);
    navigate("/historyBought");
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: "Mua hàng tại P&P SHOP",
          amount: {
            currency_code: "USD",
            value: Math.round(totalPrice / 1000 / 24),
          },
        },
      ],
    });
  };

  // check Approval
  const onApprove = async (data, actions) => {
    const _items = dataStorage.map((item) => {
      return {
        ...item,
        amount: document.getElementById(item.id).value,
      };
    });

    const dataAdd = {
      totalPrice: totalPrice,
      products: _items,
      customerId: customer.id,
      customer: dataCustomer,
      branchId: idBranch.id,
      branch: dataBranch,
      description: detailBill,
      paid: true,
    };

    callApi("bill", "post", dataAdd);

    const _itemsAdd = dataStorage.map((item) => {
      return {
        ...item,
        amount: item.amount - document.getElementById(item.id).value,
      };
    });

    const promises = [];

    _itemsAdd.map((item) => {
      const result = callApi(`product/${item.id}`, "put", item);
      promises.push(result);
    });

    const results = await Promise.all(promises);
    const actualDatas = results.map((result) => result.data);
    localStorage.removeItem(idBranch.id);

    return actions.order.capture().then(function (details) {
      const { payer } = details;
      navigate("/historyBought");
    });
  };

  //capture likely error
  const onError = (data, actions) => {
    Swal.fire({
      title: "Lỗi!",
      text: "Xảy ra lỗi trong quá trình thanh toán!",
      icon: "error",
    });
  };

  const numberProduct = () => {
    if (windowDimensions.width < 1280) {
      return 2;
    } else {
      return 4;
    }
  };

  const isDisabled = (direction) => {
    if (direction === "prev") {
      return pageByType <= 0;
    }

    if (direction === "next") {
      return (
        pageByType === _.chunk(dataProductByType, numberProduct()).length - 1
      );
    }
  };

  const responsiveOptions = [
    {
      breakpoint: "1199px",
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: "991px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  const productTemplate = (image) => {
    return (
      <div className="border-1 surface-border border-round text-center py-5 px-3">
        <div className="relative">
          <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-md bg-gray-200 aspect-none lg:aspect-none lg:h-80">
            <img
              src={image}
              className="w-full h-full object-cover object-center lg:h-full lg:w-full"
            />
          </div>
        </div>
      </div>
    );
  };

  const handleShowImage = () => {
    if (windowDimensions.width < 1280) {
      return (
        <>
          <Carousel
            autoplayInterval={4000}
            value={data.image}
            numVisible={1}
            numScroll={1}
            responsiveOptions={responsiveOptions}
            itemTemplate={productTemplate}
          />
        </>
      );
    } else {
      return (
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            <img
              src={
                data && data.image[3]
                  ? data.image[3]
                  : "http://localhost:8888/images/empty.image.png"
              }
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={
                  data && data.image[1]
                    ? data.image[1]
                    : "http://localhost:8888/images/empty.image.png"
                }
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={
                  data && data.image[0]
                    ? data.image[0]
                    : "http://localhost:8888/images/empty.image.png"
                }
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
          <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
            <img
              src={
                data && data.image[2]
                  ? data.image[2]
                  : "http://localhost:8888/images/empty.image.png"
              }
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      );
    }
  };

  function login() {
    if (localStorage.getItem("user")) {
      return (
        <>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.imageUrl}
                      alt=""
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/detailUser"
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          Cá nhân
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item onClick={() => setOpenCart(true)}>
                      {({ active }) => (
                        <a
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          Giỏ hàng
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/historyBought"
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          Đơn hàng
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item onClick={logOut}>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          Đăng xuất
                        </a>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            {/* Mobile menu button */}
            <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              {open ? (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </Disclosure.Button>
          </div>
        </>
      );
    } else
      return (
        <>
          <div className="justify-center space-x-4">
            <a
              href="/login"
              class="relative px-3 py-1.5 font-medium text-white group"
            >
              <span class="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-sky-500 group-hover:bg-sky-700 group-hover:skew-x-12"></span>
              <span class="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform skew-x-12 bg-sky-700 group-hover:bg-sky-500 group-hover:-skew-x-12"></span>
              <span class="absolute bottom-0 left-0 hidden w-10 h-20 transition-all duration-100 ease-out transform -translate-x-8 translate-y-10 bg-sky-600 -rotate-12"></span>
              <span class="absolute bottom-0 right-0 hidden w-10 h-20 transition-all duration-100 ease-out transform translate-x-10 translate-y-8 bg-sky-600 -rotate-12"></span>
              <span class="relative text-sm">Đăng nhập</span>
            </a>
            <a
              href="/register"
              class="relative px-3 py-1.5 font-medium text-white group"
            >
              <span class="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-sky-500 group-hover:bg-sky-700 group-hover:skew-x-12"></span>
              <span class="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform skew-x-12 bg-sky-700 group-hover:bg-sky-500 group-hover:-skew-x-12"></span>
              <span class="absolute bottom-0 left-0 hidden w-10 h-20 transition-all duration-100 ease-out transform -translate-x-8 translate-y-10 bg-sky-600 -rotate-12"></span>
              <span class="absolute bottom-0 right-0 hidden w-10 h-20 transition-all duration-100 ease-out transform translate-x-10 translate-y-8 bg-sky-600 -rotate-12"></span>
              <span class="relative text-sm">Đăng ký</span>
            </a>
          </div>
        </>
      );
  }

  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10"
                      src="http://localhost:8888/images/logoPP.png"
                      alt="Your Company"
                    />
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                {login()}
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-gray-700 pb-3 pt-4">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.imageUrl}
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">
                      {dataCustomer.fullName}
                    </div>
                    <div className="text-sm font-medium leading-none text-gray-400">
                      {dataCustomer.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <Disclosure.Button className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">
                    <Link to="/detailUser">Cá nhân</Link>
                  </Disclosure.Button>
                  <Disclosure.Button
                    onClick={() => setOpenCart(true)}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    Giỏ hàng
                  </Disclosure.Button>
                  <Disclosure.Button className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">
                    <Link to="/historyBought">Đơn hàng</Link>
                  </Disclosure.Button>
                  <Disclosure.Button
                    onClick={logOut}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    Đăng xuất
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <div className="bg-white">
        <div className="pt-6">
          {/* Image gallery */}
          {handleShowImage()}

          {/* Product info */}
          <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {data.name}
              </h1>
            </div>

            {/* Options */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                {numberFormat.format(data.price)}
              </p>

              {/* Reviews */}
              <div className="mt-6">
                {data &&
                  data.tag?.map((tag) => {
                    return <Tag color="cyan">{tag}</Tag>;
                  })}
              </div>

              <div className="mt-6">
                {/* Colors */}
                <div>
                  <div class="overflow-y-auto h-52">
                    {dataComment &&
                      dataComment
                        .slice(0)
                        .reverse()
                        .map((comment, index) => {
                          return (
                            <article key={index}>
                              <p class="space-y-1 font-medium dark:text-white mb-1">
                                {comment.customer.fullName}
                              </p>
                              <Rating name="half-rating" value={comment.star} />
                              <footer class="mb-3 text-sm text-gray-500 dark:text-gray-400">
                                <p>
                                  Bình luận ngày{" "}
                                  {moment
                                    .utc(comment.time)
                                    .format("DD/MM/YYYY")}
                                </p>
                              </footer>
                              <p class="mb-2 text-gray-500 dark:text-gray-400">
                                {comment.comment}
                              </p>
                            </article>
                          );
                        })}
                  </div>
                </div>

                {/* Sizes */}
                <div className="mt-10">
                  <label htmlFor="chat" className="sr-only">
                    Your message
                  </label>
                  <div className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <Rating
                      name="half-rating"
                      defaultValue={5}
                      onChange={(e) => setValueRating(e.target.value)}
                    />
                    <div className="flex items-center">
                      <textarea
                        onChange={(e) => setCommentCustomer(e.target.value)}
                        id="chat"
                        rows="1"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Bình luận của bạn..."
                      ></textarea>
                      <button
                        onClick={() => handleAddComment()}
                        className="ml-2 inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
                      >
                        <svg
                          className="w-5 h-5 rotate-90"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 18 20"
                        >
                          <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                        </svg>
                        <span className="sr-only">Gửi</span>
                      </button>
                    </div>
                  </div>
                  <p className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    Nên nhớ, những bình luận khiếm nhã sẽ không được chấp nhận.
                  </p>
                </div>

                <button
                  onClick={() => addDataStorage(data)}
                  type="button"
                  className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>

            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
              {/* Description and details */}
              <div>
                <h3 className="sr-only">Description</h3>

                <div className="space-y-6">
                  <p className="text-base text-gray-900">{data.description}</p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">
                  Thương hiệu
                </h3>

                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                    <li className="text-gray-400">
                      <span className="text-gray-600">{data.brand}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">
                  Loại sản phẩm
                </h3>

                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                    <li className="text-gray-400">
                      <span className="text-gray-600">{data.type}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-10">
                <div className="carousel">
                  <div className="relative overflow-hidden">
                    <div className="flex justify-between absolute top left w-full h-full">
                      <button
                        onClick={() => setPageByType(pageByType - 1)}
                        disabled={isDisabled("prev")}
                        className="text-black w-10 h-full text-center opacity-75 hover:opacity-100 disabled:opacity-25 disabled:cursor-not-allowed z-10 p-0 m-0 transition-all ease-in-out duration-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-20 -ml-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        <span className="sr-only">Prev</span>
                      </button>
                      <button
                        onClick={() => setPageByType(pageByType + 1)}
                        disabled={isDisabled("next")}
                        className=" text-black w-10 h-full text-center opacity-75 hover:opacity-100 disabled:opacity-25 disabled:cursor-not-allowed z-10 p-0 m-0 transition-all ease-in-out duration-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-20 -ml-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        <span className="sr-only">Next</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 carousel-container relative flex gap-1 overflow-hidden scroll-smooth snap-x snap-mandatory touch-pan-x z-0">
                      {_.chunk(dataProductByType, numberProduct())[
                        pageByType
                      ] &&
                        _.chunk(dataProductByType, numberProduct())[
                          pageByType
                        ].map((product, index) => {
                          return (
                            <div
                              key={index}
                              className="carousel-item text-center relative w-full h-full snap-start"
                              onClick={() => setIdByType(product.id)}
                            >
                              <img
                                src={product.image.slice(-1) || ""}
                                alt={product.name}
                                className="w-full aspect-square transition duration-300 ease-in-out hover:scale-110"
                              />
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Transition.Root show={openCart} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenCart}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            Giỏ hàng của tôi
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                              onClick={() => setOpenCart(false)}
                            >
                              <span className="absolute -inset-0.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="mt-8">
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500 mb-2"
                            onClick={clearAllItem}
                          >
                            Xóa tất cả
                          </button>
                          <div className="flow-root">
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-200"
                            >
                              {dataStorage &&
                                dataStorage.map((product) => (
                                  <li key={product.id} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      <img
                                        src={product.image.slice(-1)}
                                        className="h-full w-full object-cover object-center"
                                      />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                          <h3>
                                            <a href={product.href}>
                                              {product.name}
                                            </a>
                                          </h3>
                                          <p className="ml-4">
                                            {numberFormat.format(product.price)}
                                          </p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                          {product.color}
                                        </p>
                                      </div>
                                      <div className="flex flex-1 items-end justify-between text-sm">
                                        <input
                                          defaultValue={1}
                                          type="number"
                                          id={product.id}
                                          max={product.amount}
                                          min={1}
                                          className="w-14 block w-auto p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                          onChange={() => onChangeQty()}
                                        />

                                        <div className="flex">
                                          <button
                                            type="button"
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                            onClick={() =>
                                              removeItem(product.id)
                                            }
                                          >
                                            Xóa
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <textarea
                          onChange={(e) => setDetailBill(e.target.value)}
                          className="mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Ghi chú cho đơn hàng..."
                        ></textarea>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Tổng giá tiền</p>
                          <p>{numberFormat.format(totalPrice)}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Khách hàng được hoàn toàn miễn phí giao hàng.
                        </p>
                        <div className="mt-2 mb-4">
                          <button
                            onClick={handleAdd}
                            className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                          >
                            Thanh toán khi nhận hàng
                          </button>
                        </div>
                        <PayPalScriptProvider
                          options={{
                            "client-id":
                              "AXs9-WxsbhI7HPjZhAsMrzyniF7vLtbQ2NviUm7k2uEvrk-qmDQXQftsObxkvmVFbBU0XCaH36Q_wtEO",
                          }}
                        >
                          <PayPalButtons
                            style={{ layout: "vertical" }}
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                            forceReRender={[Math.round(totalPrice / 1000 / 24)]}
                          />
                        </PayPalScriptProvider>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
