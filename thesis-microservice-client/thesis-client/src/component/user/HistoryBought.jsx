import {
  CheckIcon,
  CalendarIcon,
  PaperClipIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import callApi from "../../apicaller";
import * as React from "react";
import Swal from "sweetalert2";
import { XMarkIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import { Link } from "react-router-dom";
import _ from "lodash";
import Pagination from "@mui/material/Pagination";

export default function HistoryBought() {
  const [page, setPage] = useState(0);
  const user = JSON.parse(localStorage.getItem("user")) || [];

  const [dataBill, setDataBill] = useState([]);

  useEffect(() => {
    callApi(`bill/customer/${user.id}`, "get", null).then((res) => {
      setDataBill(res.data);
    });
  }, []);

  const numberFormat = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const deleteBill = async (id) => {
    Swal.fire({
      title: "Bạn muốn hủy đơn hàng?",
      showDenyButton: true,
      confirmButtonText: "Hủy",
      denyButtonText: `Không hủy`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        callApi(`bill/${id}`, "delete", null).then((res) => {
          window.location.reload();
          Swal.fire("Đã hủy đơn hàng thành công", "", "success");
        });
      } else if (result.isDenied) {
        Swal.fire("Không hủy đơn hàng!", "", "success");
      }
    });
  };

  const handleChangePage = (event, value) => {
    setPage(value - 1);
  };

  if (dataBill) {
    return (
      <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {_.chunk(dataBill.slice(0).reverse(), 8)[page] &&
          _.chunk(dataBill.slice(0).reverse(), 8)[page]?.map(
            (bill, index) => {
              return (
                <div
                  key={index}
                  className="mb-10 mx-auto mt-10 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none"
                >
                  <div className="p-8 lg:flex-auto">
                    <div className="flex justify-start">
                      <img
                        src="http://localhost:8888/images/map.png"
                        className="h-10"
                      ></img>
                      <h3 className="ml-3 mt-3 text-2xl font-bold tracking-tight text-gray-900">
                        {bill.branch.name}
                      </h3>
                    </div>

                    <ul
                      role="list"
                      className="mt-8 space-y-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
                    >
                      <p className="flex gap-x-3">
                        <CalendarIcon
                          className="h-6 w-5 flex-none text-indigo-600"
                          aria-hidden="true"
                        />
                        Ngày mua hàng{" "}
                        {moment.utc(bill.time).format("DD/MM/YYYY")}
                      </p>
                      <li className="flex gap-x-3">
                        <PaperClipIcon
                          className="h-6 w-5 flex-none text-indigo-600"
                          aria-hidden="true"
                        />
                        {bill.description}
                      </li>
                    </ul>
                    <div className="mt-10 flex items-center gap-x-4">
                      <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
                        Tiến trình đơn hàng
                      </h4>
                      <div className="h-px flex-auto bg-gray-100" />
                    </div>
                    <ul
                      role="list"
                      className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
                    >
                      {bill.status ? (
                        <li className="flex gap-x-3">
                          <CheckIcon
                            className="h-6 w-5 flex-none text-indigo-600"
                            aria-hidden="true"
                          />
                          Đã xác nhận
                        </li>
                      ) : (
                        <li className="flex gap-x-3">
                          <XMarkIcon
                            className="h-6 w-5 flex-none text-rose-500"
                            aria-hidden="true"
                          />
                          Chờ xác nhận
                        </li>
                      )}

                      {bill.status ? (
                        <li className="flex gap-x-3">
                          <CheckIcon
                            className="h-6 w-5 flex-none text-indigo-600"
                            aria-hidden="true"
                          />
                          Đã chuẩn bị hàng
                        </li>
                      ) : (
                        <li className="flex gap-x-3">
                          <XMarkIcon
                            className="h-6 w-5 flex-none text-rose-500"
                            aria-hidden="true"
                          />
                          Chưa chuẩn bị hàng
                        </li>
                      )}

                      {bill.delivered ? (
                        <li className="flex gap-x-3">
                          <CheckIcon
                            className="h-6 w-5 flex-none text-indigo-600"
                            aria-hidden="true"
                          />
                          Đang giao hàng
                        </li>
                      ) : (
                        <li className="flex gap-x-3">
                          <XMarkIcon
                            className="h-6 w-5 flex-none text-rose-500"
                            aria-hidden="true"
                          />
                          Chờ lấy hàng
                        </li>
                      )}

                      {bill.finish ? (
                        <li className="flex gap-x-3">
                          <CheckIcon
                            className="h-6 w-5 flex-none text-indigo-600"
                            aria-hidden="true"
                          />
                          Đã giao hàng
                        </li>
                      ) : (
                        <li className="flex gap-x-3">
                          <XMarkIcon
                            className="h-6 w-5 flex-none text-rose-500"
                            aria-hidden="true"
                          />
                          Chưa giao hàng
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                    <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center relative h-full">
                      <div className="mx-auto max-w-xs px-8">
                        {bill.paid === true ? (
                          <img
                            src="http://localhost:8888/images/invoice.png"
                            className="absolute top-2 left-2 h-14"
                          ></img>
                        ) : (
                          ""
                        )}

                        <button
                          onClick={() => deleteBill(bill.id)}
                          type="button"
                          className="text-gray-400 hover:text-gray-500 absolute top-3 right-3"
                        >
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                        <p className="text-base font-semibold text-gray-600">
                          Tổng giá trị đơn hàng
                        </p>
                        <p className="mt-6 flex items-baseline justify-center gap-x-2">
                          <span className="text-5xl font-bold tracking-tight text-gray-900">
                            {numberFormat.format(bill.totalPrice)}
                          </span>
                        </p>
                        <Link
                          to={`/bill/${bill.id}`}
                          className="mt-10 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
      </div>
      <div className="flex justify-center m-8 lg:justify-end ">
        <Pagination
          onChange={handleChangePage}
          count={_.chunk(dataBill, 8).length}
          color="primary"
        />
      </div>
    </div>
    
    );
  } else {
    return (
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">Lỗi tìm kiếm</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Không có đơn hàng nào được tìm thấy
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Mua bất kì sản phẩm nào để có thể xem lại lịch sử mua hàng
        </p>
      </div>
    </main>
    );
  }
}
