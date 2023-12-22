import { useEffect, useState } from "react";
import * as React from "react";
import Swal from "sweetalert2";
import callApi from "../../apicaller";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import validator from "validator";
import { useNavigate } from "react-router-dom";

export default function DetailInfoUser() {
  const navigate = useNavigate();
  const customer = JSON.parse(localStorage.getItem("user")) || [];
  const [dataCustomer, setDataCustomer] = useState([]);

  useEffect(() => {
    callApi(`auth/id/${customer.id}`, "get", null).then((res) => {
      setDataCustomer(res.data);
    });
  }, [dataCustomer]);

  const [open, setOpen] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const handleChange = () => {
    if (name === "" || phone === "" || email === "" || address === "") {
      Swal.fire({
        title: "Lỗi!",
        text: "Vui lòng điền đầy đủ thông tin!",
        icon: "warning",
      });
    } else if (validator.isEmail(email) === false) {
      Swal.fire({
        title: "Lỗi!",
        text: "Email không hợp lệ!",
        icon: "warning",
      });
    } else {
      const dataChange = {
        fullName: name,
        phone: phone,
        address: address,
        email: email,
      };
      callApi(`auth/user/${customer.id}`, "patch", dataChange).then((res) => {
        setOpen(false);
        Swal.fire({
          title: "Thành công!",
          text: "Thay đổi thông tin thành công!",
          icon: "success",
        });
      });
    }
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [passWord, setPassword] = useState("");

  const handleSetOpenAccount = () => {
    if (currentPassword === "") {
      Swal.fire({
        title: "Lỗi!",
        text: "Vui lòng nhập mật khẩu hiện tại!",
        icon: "warning",
      });
    }else {
      callApi(`auth/checkPassword/${dataCustomer.id}/${currentPassword}`, "get", null).then((res) => {
        if(res.data === true){
          setOpenAccount(true)
        }else{
          Swal.fire({
            title: "Lỗi!",
            text: "Mật khẩu không trùng khớp!",
            icon: "error",
          });
        }
      });
    }
  };

  const handleChangeAccount = () => {
    if (userName === "" || passWord === "") {
      Swal.fire({
        title: "Lỗi!",
        text: "Vui lòng điền đầy đủ thông tin!",
        icon: "warning",
      });
    } else {
      const dataChange = {
        username: userName,
        password: passWord,
      };
      callApi(`auth/account/${customer.id}`, "patch", dataChange).then((res) => {
        navigate("/login")
      });
    }
  };

  return (
    <>
      <div className="m-6">
        <div className="px-4 sm:px-0">
          <h3 className="text-2xl font-semibold leading-7 text-gray-900">
            Thông tin cá nhân
          </h3>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Họ và tên
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {dataCustomer.fullName}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Số điện thoại
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {dataCustomer.phone}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Email
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {dataCustomer.email}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Địa chỉ
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {dataCustomer.address}
              </dd>
            </div>
            {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Tài khoản
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {dataCustomer.username}
              </dd>
            </div> */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Hành động
              </dt>
              <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <input
                  onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mb-6 w-40 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="password"
                    placeholder="Mật khẩu hiện tại"
                  />
                  <br/>
                <button
                  onClick={() => handleSetOpenAccount()}
                  class="relative px-6 py-3 font-bold text-black group mb-6"
                >
                  <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-2 -translate-y-2 bg-red-300 group-hover:translate-x-0 group-hover:translate-y-0"></span>
                  <span className="absolute inset-0 w-full h-full border-4 border-black"></span>
                  <span className="relative">Thay đổi tài khoản</span>
                </button>
                <br />
                <button
                  onClick={() => setOpen(true)}
                  class="relative px-6 py-3 font-bold text-black group"
                >
                  <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-2 -translate-y-2 bg-red-300 group-hover:translate-x-0 group-hover:translate-y-0"></span>
                  <span className="absolute inset-0 w-full h-full border-4 border-black"></span>
                  <span className="relative">Thay đổi thông tin</span>
                </button>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpen(false)}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">
                            Thay đổi thông tin người dùng
                          </span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-xl font-semibold leading-6 text-gray-900 mb-4">
                          Thay đổi thông tin người dùng
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="mb-10">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Họ và tên
                          </label>
                          <input
                            onChange={(e) => setName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                          />
                        </div>
                        <div className="mb-10">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Số điện thoại
                          </label>
                          <input
                            onChange={(e) => setPhone(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                          />
                        </div>
                        <div className="mb-10">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                          </label>
                          <input
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                          />
                        </div>
                        <div className="mb-10">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Địa chỉ
                          </label>
                          <input
                            onChange={(e) => setAddress(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                          />
                        </div>
                        <div className="justify-center space-x-4 mt-12 text-center">
                          <button
                            onClick={() => handleChange()}
                            className="relative px-6 py-3 font-bold text-black group"
                          >
                            <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-2 -translate-y-2 bg-red-300 group-hover:translate-x-0 group-hover:translate-y-0"></span>
                            <span className="absolute inset-0 w-full h-full border-4 border-black"></span>
                            <span className="relative">Đồng ý</span>
                          </button>
                          <button
                            onClick={() => setOpen(false)}
                            className="relative px-6 py-3 font-bold text-black group"
                          >
                            <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-2 -translate-y-2 bg-red-300 group-hover:translate-x-0 group-hover:translate-y-0"></span>
                            <span className="absolute inset-0 w-full h-full border-4 border-black"></span>
                            <span className="relative">Trở về</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>


      <Transition.Root show={openAccount} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenAccount}>
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
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpenAccount(false)}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">
                            Thay đổi thông tin đăng nhập
                          </span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-xl font-semibold leading-6 text-gray-900 mb-4">
                        Thay đổi thông tin đăng nhập
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="mb-10">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Tài khoản
                          </label>
                          <input
                            onChange={(e) => setUserName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                          />
                        </div>
                        <div className="mb-10">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Mật khẩu
                          </label>
                          <input
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="password"
                          />
                        </div>
                        <div className="justify-center space-x-4 mt-12 text-center">
                          <button
                            onClick={() => handleChangeAccount()}
                            className="relative px-6 py-3 font-bold text-black group"
                          >
                            <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-2 -translate-y-2 bg-red-300 group-hover:translate-x-0 group-hover:translate-y-0"></span>
                            <span className="absolute inset-0 w-full h-full border-4 border-black"></span>
                            <span className="relative">Thay đổi</span>
                          </button>
                          <button
                            onClick={() => setOpenAccount(false)}
                            className="relative px-6 py-3 font-bold text-black group"
                          >
                            <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-2 -translate-y-2 bg-red-300 group-hover:translate-x-0 group-hover:translate-y-0"></span>
                            <span className="absolute inset-0 w-full h-full border-4 border-black"></span>
                            <span className="relative">Trở về</span>
                          </button>
                        </div>
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
