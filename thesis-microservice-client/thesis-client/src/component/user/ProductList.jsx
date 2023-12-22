import { Fragment } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import callApi from "../../apicaller";
import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import _ from "lodash";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Swal from "sweetalert2";
import validator from "validator";
import { Carousel } from "primereact/carousel";
import {
  PhoneIcon,
  AtSymbolIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const navigation = [{ name: "Trang chủ", href: "/", current: false }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductList() {
  const [page, setPage] = useState(0);
  const [openCart, setOpenCart] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const dataStorage = JSON.parse(localStorage.getItem(id)) || [];

  const [dataProduct, setDataProduct] = useState([]);
  const [dataBrand, setDataBrand] = useState([]);
  const [dataType, setDataType] = useState([]);
  const [dataTag, setDataTag] = useState([]);
  const [dataBranch, setDataBranch] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const [dataRecommendationProduct, setDataRecommendationProduct] = useState(
    []
  );
  const [dataAverageRating, setDataAverageRating] = useState([]);

  const user = JSON.parse(localStorage.getItem("user")) || [];

  const [totalPrice, setTotalPrice] = useState(
    dataStorage?.reduce((a, b) => a + b.price, 0)
  );

  useEffect(() => {
    callApi(`product/branch/${id}`, "get", null).then((res) => {
      setDataProduct(res.data);
    });
    callApi(`branch/${id}`, "get", null).then((res) => {
      setDataBranch(res.data);
    });
    callApi(`auth/id/${user.id}`, "get", null).then((res) => {
      setDataUser(res.data);
    });
    callApi("brand", "get", null).then((res) => {
      setDataBrand(res.data);
    });
    callApi("typeOfProduct", "get", null).then((res) => {
      setDataType(res.data);
    });
    callApi("tag", "get", null).then((res) => {
      setDataTag(res.data);
    });
    callApi(`transpose/${id}/${user.id}`, "get", null).then((res) => {
      setDataRecommendationProduct(res.data);
    });
    callApi(`transpose/averageRating/${id}`, "get", null).then((res) => {
      setDataAverageRating(res.data);
    });
  }, []);


  const [search, setSearch] = useState("");
  const [checkedType, setCheckedType] = useState(false);
  const [valueType, setValueType] = useState("");
  const filterFromSidebarType = (e) => {
    setCheckedType(e);
    setValueType(e);
  };

  const [checkedTag, setCheckedTag] = useState(false);
  const [valueTag, setValueTag] = useState("");
  const filterFromSidebarTag = (e) => {
    setCheckedTag(e);
    setValueTag(e);
  };

  const [checkedBrand, setCheckedBrand] = useState(false);
  const [valueBrand, setValueBrand] = useState("");
  const filterFromSidebarBrand = (e) => {
    setCheckedBrand(e);
    setValueBrand(e);
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
    localStorage.removeItem(id);
    window.location.reload();
  };

  const removeItem = (el) => {
    const newItems = dataStorage.filter((item) => item.id !== el);
    localStorage.setItem(id, JSON.stringify(newItems));
    window.location.reload();
  };

  const onChangeQty = () => {
    let totalVal = 0;
    for (let i = 0; i < dataStorage.length; i++) {
      totalVal =
        totalVal +
        dataStorage[i].price * document.getElementById(dataStorage[i].id).value;
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
      customerId: user.id,
      customer: dataUser,
      branchId: id,
      branch: dataBranch,
      description: detailBill,
      paid: false,
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
    localStorage.removeItem(id);
    navigate("/historyBought");
  };

  const handleChangePage = (event, value) => {
    setPage(value - 1);
  };

  const filterArrProduct = () => {
    if (search) {
      return (
        dataProduct &&
        dataProduct.filter((product) =>
          product.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      );
    } else if (valueBrand && valueType && valueTag) {
      return (
        dataProduct &&
        dataProduct.filter(
          (product) =>
            valueBrand === product.brand &&
            valueType === product.type &&
            product.tag.includes(valueTag)
        )
      );
    } else if (valueBrand && valueType) {
      return dataProduct.filter(
        (product) => valueBrand === product.brand && valueType === product.type
      );
    } else if (valueType && valueTag) {
      return dataProduct.filter(
        (product) =>
          valueType === product.type && product.tag.includes(valueTag)
      );
    } else if (valueBrand && valueTag) {
      return dataProduct.filter(
        (product) =>
          valueBrand === product.brand && product.tag.includes(valueTag)
      );
    } else if (valueBrand) {
      return dataProduct.filter((product) => valueBrand === product.brand);
    } else if (valueType) {
      return dataProduct.filter((product) => valueType === product.type);
    } else if (valueTag) {
      return dataProduct.filter((product) => product.tag.includes(valueTag));
    }
    return dataProduct;
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
      customerId: user.id,
      customer: dataUser,
      branchId: id,
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
    localStorage.removeItem(id);

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

  const [valueEmail, setValueEmail] = useState("");
  const handleValueEmail = () => {
    if (valueEmail === "") {
      Swal.fire({
        title: "Lỗi!",
        text: "Email không được trống!",
        icon: "warning",
      });
    } else if (!validator.isEmail(valueEmail)) {
      Swal.fire({
        title: "Lỗi!",
        text: "Email không đúng định dạng!",
        icon: "warning",
      });
    } else {
      callApi("emailByBranch", "post", {
        emailCustomer: valueEmail,
        branchId: id,
      })
        .then((res) => {
          setValueEmail("");
          Swal.fire({
            title: "Thành công!",
            text: "Cám ơn bạn đã quan tâm!",
            icon: "success",
          });
        })
        .catch((err) => {
          console.log(err);
        });
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

  const productTemplate = (product) => {
    return (
      <div
        key={product.id}
        className="border-1 surface-border border-round m-2 mt-4 text-center py-5 px-3"
      >
        <div className="relative">
          <img
            src="http://localhost:8888/images/news.png"
            className="w-16 h-16 absolute -top-6 -left-4 animate-wiggle-more animate-infinite"
          />
          <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-md bg-gray-200 aspect-none lg:aspect-none lg:h-80">
            <Link
              to={`/product/${product.id}`}
              state={{ idBranch: { id } }}
              style={{
                textDecoration: "none",
                color: "black",
              }}
            >
              <img
                src={product.image?.slice(-1)}
                className="w-full h-full object-cover object-center lg:h-full lg:w-full"
              />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  function handleCarousel() {
    if (dataRecommendationProduct.length > 0) {
      return (
        <>
          <Carousel
            autoplayInterval={4000}
            value={dataRecommendationProduct}
            numVisible={1}
            numScroll={1}
            responsiveOptions={responsiveOptions}
            itemTemplate={productTemplate}
          />
        </>
      );
    } else if(dataAverageRating.length > 0){
      return (
        <>
          <Carousel
            autoplayInterval={4000}
            value={dataAverageRating}
            numVisible={1}
            numScroll={1}
            responsiveOptions={responsiveOptions}
            itemTemplate={productTemplate}
          />
        </>
      );
    }else{
      return <></>
    }
  }

  function login() {
    if (localStorage.getItem("user")) {
      return (
        <>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 sm:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <FunnelIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
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
      <div className="bg-white">
        <div>
          {/* Mobile filter dialog */}
          <Transition.Root show={mobileFiltersOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-40 lg:hidden"
              onClose={setMobileFiltersOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 z-40 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                    <div className="flex items-center justify-between px-4">
                      <h2 className="text-lg font-medium text-gray-900">
                        Lọc sản phẩm
                      </h2>
                      <button
                        type="button"
                        className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                        onClick={() => setMobileFiltersOpen(false)}
                      >
                        <span className="sr-only">Đóng</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Filters */}
                    <form className="mt-4 border-t border-gray-200">
                      <h3 className="sr-only">Danh mục</h3>
                      <form>
                        <label
                          for="default-search"
                          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                        >
                          Tìm kiếm
                        </label>
                        <div className="relative mt-3 ml-3 mr-3 ">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                              className="w-4 h-4 text-gray-500 dark:text-gray-400 animate-jump animate-infinite"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 20"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                              />
                            </svg>
                          </div>
                          <input
                            type="search"
                            id="default-search"
                            className="block mb-3 w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Tìm sản phẩm..."
                            required
                            onChange={(event) => {
                              setSearch(event.target.value);
                            }}
                          />
                        </div>
                      </form>
                      <Disclosure
                        as="div"
                        className="border-t border-gray-200 px-4 py-6"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">
                                  Loại sản phẩm
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                {dataType &&
                                  dataType.map((option, optionIdx) => (
                                    <div
                                      key={optionIdx}
                                      className="flex items-center"
                                    >
                                      <input
                                        id={`filter-mobile-${option.id}-${optionIdx}`}
                                        name={option.name}
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={checkedType === option.name}
                                        onChange={(e) =>
                                          filterFromSidebarType(e.target.name)
                                        }
                                      />
                                      <label
                                        htmlFor={`filter-mobile-${option.id}-${optionIdx}`}
                                        className="ml-3 min-w-0 flex-1 text-gray-500"
                                      >
                                        {option.name}
                                      </label>
                                    </div>
                                  ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                      <Disclosure
                        as="div"
                        className="border-t border-gray-200 px-4 py-6"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">
                                  Thương hiệu
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                {dataBrand &&
                                  dataBrand.map((option, optionIdx) => (
                                    <div
                                      key={optionIdx}
                                      className="flex items-center"
                                    >
                                      <input
                                        id={`filter-mobile-${option.id}-${optionIdx}`}
                                        name={option.name}
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={checkedBrand === option.name}
                                        onChange={(e) =>
                                          filterFromSidebarBrand(e.target.name)
                                        }
                                      />
                                      <label
                                        htmlFor={`filter-mobile-${option.id}-${optionIdx}`}
                                        className="ml-3 min-w-0 flex-1 text-gray-500"
                                      >
                                        {option.name}
                                      </label>
                                    </div>
                                  ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                      <Disclosure
                        as="div"
                        className="border-t border-gray-200 px-4 py-6"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">
                                  Nổi bật
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                {dataTag &&
                                  dataTag.map((option, optionIdx) => (
                                    <div
                                      key={optionIdx}
                                      className="flex items-center"
                                    >
                                      <input
                                        id={`filter-mobile-${option.id}-${optionIdx}`}
                                        name={option.name}
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={checkedTag === option.name}
                                        onChange={(e) =>
                                          filterFromSidebarTag(e.target.name)
                                        }
                                      />
                                      <label
                                        htmlFor={`filter-mobile-${option.id}-${optionIdx}`}
                                        className="ml-3 min-w-0 flex-1 text-gray-500"
                                      >
                                        {option.name}
                                      </label>
                                    </div>
                                  ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
          <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
              <>
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                  <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                      {/* Mobile menu button*/}
                      <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XMarkIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <Bars3Icon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                      <div className="flex flex-shrink-0 items-center">
                        <img
                          className="h-8 w-auto"
                          src="http://localhost:8888/images/logoPP.png"
                          alt="Your Company"
                        />
                      </div>
                      <div className="hidden sm:ml-6 sm:block">
                        <div className="flex space-x-4">
                          {navigation.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-gray-900 text-white"
                                  : "text-white hover:bg-gray-700 hover:text-white",
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

                <Disclosure.Panel className="sm:hidden">
                  <div className="space-y-1 px-2 pb-3 pt-2">
                    <Disclosure.Button
                      className="block rounded-md px-3 py-2 text-base font-medium text-white"
                      onClick={() => setMobileFiltersOpen(true)}
                    >
                      Lọc sản phẩm
                    </Disclosure.Button>
                    {navigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-white hover:bg-gray-700 hover:text-white",
                          "block rounded-md px-3 py-2 text-base font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <main className="mx-auto max-w-7xl px-4">
            <section aria-labelledby="products-heading" className="pb-6 pt-6">
              <h2 id="products-heading" className="sr-only">
                Products
              </h2>

              <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                {/* Filters */}
                <form className="hidden lg:block">
                  <h3 className="sr-only">Categories</h3>
                  <div className="mb-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-400 animate-jump animate-infinite"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 20"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                          />
                        </svg>
                      </div>
                      <input
                        type="search"
                        id="default-search"
                        className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Tìm sản phẩm..."
                        required
                        onChange={(event) => {
                          setSearch(event.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <Disclosure
                    as="div"
                    className="border-b border-gray-200 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              Loại sản phẩm
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {dataType &&
                              dataType.map((element, index) => (
                                <div key={index} className="flex items-center">
                                  <input
                                    id={`filter-${element.id}-${index}`}
                                    name={element.name}
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={checkedType === element.name}
                                    onChange={(e) =>
                                      filterFromSidebarType(e.target.name)
                                    }
                                  />
                                  <label
                                    htmlFor={`filter-${element.id}-${index}`}
                                    className="ml-3 text-sm text-gray-600"
                                  >
                                    {element.name}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                  <Disclosure
                    as="div"
                    className="border-b border-gray-200 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              Thương hiệu
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {dataBrand &&
                              dataBrand.map((element, index) => (
                                <div key={index} className="flex items-center">
                                  <input
                                    id={`filter-${element.id}-${index}`}
                                    name={element.name}
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={checkedBrand === element.name}
                                    onChange={(e) =>
                                      filterFromSidebarBrand(e.target.name)
                                    }
                                  />
                                  <label
                                    htmlFor={`filter-${element.id}-${index}`}
                                    className="ml-3 text-sm text-gray-600"
                                  >
                                    {element.name}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                  <Disclosure
                    as="div"
                    className="border-b border-gray-200 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              Nổi bật
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {dataTag &&
                              dataTag.map((element, index) => (
                                <div key={index} className="flex items-center">
                                  <input
                                    id={`filter-${element.id}-${index}`}
                                    name={element.name}
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={checkedTag === element.name}
                                    onChange={(e) =>
                                      filterFromSidebarTag(e.target.name)
                                    }
                                  />
                                  <label
                                    htmlFor={`filter-${element.id}-${index}`}
                                    className="ml-3 text-sm text-gray-600"
                                  >
                                    {element.name}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                  {handleCarousel()}
                </form>

                {/* Product grid */}
                <div className="lg:col-span-3">
                  <div className="bg-white">
                    <div className="lg:hidden">{handleCarousel()}</div>
                    <div className="mx-auto max-w-2xl lg:max-w-5xl">
                      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {_.chunk(filterArrProduct(), 8)[page] &&
                          _.chunk(filterArrProduct(), 8)
                            [page].filter((product) => {
                              return product.amount > 0;
                            })
                            .map((product) => (
                              <div key={product.id} className="group relative">
                                <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-80">
                                  <Link
                                    to={`/product/${product.id}`}
                                    state={{ idBranch: { id } }}
                                    style={{
                                      textDecoration: "none",
                                      color: "black",
                                    }}
                                  >
                                    <img
                                      src={product.image?.slice(-1)}
                                      className="w-full h-full object-cover object-center lg:h-full lg:w-full transition duration-300 ease-in-out hover:scale-110"
                                    />
                                  </Link>
                                </div>
                              </div>
                            ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-8 lg:justify-end">
                    <Pagination
                      onChange={handleChangePage}
                      count={_.chunk(filterArrProduct(), 8).length}
                      color="primary"
                    />
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
      {/*footer*/}
      <div className="relative isolate overflow-hidden bg-gray-900 py-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            <div className="max-w-xl lg:max-w-lg space-y-8">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                P&P Cần Thơ
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-300">
                Nhập tài khoản Email của bạn để nhận được những thông báo mới
                nhất về chi nhánh P&P Cần thơ.
              </p>
              <div className="mt-6 flex max-w-md gap-x-4">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  onChange={(e) => setValueEmail(e.target.value)}
                  value={valueEmail}
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  placeholder="Nhập Email"
                />
                <button
                  onClick={() => handleValueEmail()}
                  className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Gửi đi
                </button>
              </div>
            </div>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-1 lg:pt-1">
              <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
                <div className="flex items-start justify-start">
                  <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10 hover:animate-ping">
                    <PhoneIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-2 ml-4 font-semibold text-white">
                    SĐT: {dataBranch.phone}
                  </div>
                </div>
                <div className="flex justify-start items-start">
                  <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10 hover:animate-ping">
                    <AtSymbolIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <dt className="mt-2 ml-4 font-semibold text-white">
                    Email: {dataBranch.email}
                  </dt>
                </div>
              </dl>
              <div className="flex justify-start items-start">
                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10 hover:animate-ping">
                  <MapPinIcon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <dt className="-mt-1 lg:ml-4 ml-4 font-semibold text-white">
                  Địa chỉ: {dataBranch.address}
                </dt>
              </div>
              <div className="flex justify-start items-start space-x-4">
                <a
                  href="https://www.facebook.com/nguyenhua.phongphu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="http://localhost:8888/images/facebook.png"
                    className="h-12 hover:animate-bounce"
                  />
                </a>
                <a
                  href="https://www.facebook.com/nguyenhua.phongphu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="http://localhost:8888/images/instagram.png"
                    className="h-12 hover:animate-bounce"
                  />
                </a>
                <a
                  href="https://www.facebook.com/nguyenhua.phongphu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="http://localhost:8888/images/tik-tok.png"
                    className="h-12 hover:animate-bounce"
                  />
                </a>
                <a
                  href="https://www.facebook.com/nguyenhua.phongphu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="http://localhost:8888/images/youtube.png"
                    className="h-12 hover:animate-bounce"
                  />
                </a>
              </div>
            </dl>
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
      {/*cart*/}
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
                      <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-6">
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

                        <div className="mt-3">
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
                                          className="block w-auto p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                          <p id="totalprice" value={totalPrice}>
                            {numberFormat.format(totalPrice)}
                          </p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Khách hàng được hoàn toàn miễn phí giao hàng.
                        </p>
                        <button
                          onClick={handleAdd}
                          className="w-full mb-4 mt-2 flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                          Thanh toán khi nhận hàng
                        </button>
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
