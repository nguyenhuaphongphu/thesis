import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import callApi from "../../apicaller";
import * as React from "react";

export default function DetailBill() {
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    callApi(`bill/${id}`, "get", null).then((res) => {
      setData(res.data);
    });
  }, []);

  const numberFormat = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return (
    <div className="bg-white">
      {data.products &&
        data.products.map((product, index) => {
          return (
            <div
              key={index}
              className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-16 lg:max-w-7xl lg:grid-cols-2 lg:px-8"
            >
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {product.name}
                </h2>
                <p className="mt-4 text-gray-500">{product.description}</p>

                <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-8 lg:gap-x-8">
                  <div className="border-t border-gray-200 pt-4">
                    <dt className="font-medium text-gray-900">Thương hiệu</dt>
                    <dd className="mt-2 text-sm text-gray-500">
                      {product.brand}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <dt className="font-medium text-gray-900">Loại sản phẩm</dt>
                    <dd className="mt-2 text-sm text-gray-500">
                      {product.type}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <dt className="font-medium text-gray-900">Giá sản phẩm</dt>
                    <dd className="mt-2 text-sm text-gray-500">
                      {numberFormat.format(product.price)} / cái
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <dt className="font-medium text-gray-900">Số lượng mua</dt>
                    <dd className="mt-2 text-sm text-gray-500">
                      {product.amount}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <dt className="font-medium text-gray-900">Thẻ sản phẩm</dt>
                    <dd className="mt-2 text-sm text-gray-500">
                      {product.tag &&
                        product.tag.map((tag, index) => {
                          return (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                            >
                              {tag}
                            </span>
                          );
                        })}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <dt className="font-medium text-gray-900">Thành tiền</dt>
                    <dd className="mt-2 text-sm text-gray-500">
                      <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                        {numberFormat.format(product.price * product.amount)}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
                {product.image &&
                  product.image.map((image, index) => {
                    return (
                        <img
                          key={index}
                          src={image}
                          className="lg:ml-10 rounded-lg h-72"
                        />
                    );
                  })}
              </div>
            </div>
          );
        })}
    </div>
  );
}
