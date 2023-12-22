import Clear from "@mui/icons-material/Clear";
import styled from "styled-components";
import { useState, useEffect } from "react";
import callApi from "../../apicaller";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Tag } from "antd";

const Container = styled.div`
  position: relative;
  margin-top: 20px;
  margin-bottom: 20px;
`;
const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;
const Input = styled.input`
  flex: 1;
  margin: 10px 10px 0px 0px;
  padding: 10px;
  width: 100px;
  text-align: center;
`;
const CenterButton = styled.button`
  padding: 9.5px;
  border: 2px solid teal;
  background-color: white;
  &:hover {
    background-color: #f8f4f4;
  }
`;
const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Info = styled.div`
  flex: 3;
`;
const Product = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;
const Image = styled.img`
  width: 130px;
`;
const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;
const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;
const Select = styled.select`
  flex: 1;
  padding: 10px;
  width: 100%;
`;
const Summary = styled.div`
  position: absolute;
  right: 0;
  width: 50%;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 40px;
`;
const SummaryTitle = styled.h1`
  font-weight: 200;
  text-align: center;
`;
const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
`;
const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
`;

export default function ManagerImportProduct() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState([]);

  useEffect(() => {
    callApi(`supplier`, "get", null).then((res) => {
      setData(res.data);
    });
  }, []);

  const [supplierAdd, setSupplierAdd] = useState();

  const items = JSON.parse(localStorage.getItem("products")) || [];

  const clearAllItem = () => {
    localStorage.removeItem("products");
    window.location.reload();
  };

  const removeItem = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    localStorage.setItem("products", JSON.stringify(newItems));
    window.location.reload();
  };

  const [totalPrice, setTotalPrice] = useState(0);

  const numberFormat = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const handleAdd = async () => {
    const _items = items.map((item) => {
      return {
        ...item,
        price: document.getElementsByName(item.id)[0].value,
        amount: document.getElementById(item.id).value,
      };
    });
    let _supplier = data.find((supplier) => supplier.id === supplierAdd);
    const dataAdd = {
      totalPrice: totalPrice,
      products: _items,
      supplier: _supplier,
      branchId: user.managementAt,
    };
    callApi("importOrder", "post", dataAdd);
    const _itemsAdd = items.map((item) => {
      return {
        ...item,
        amount: item.amount + Number(document.getElementById(item.id).value),
      };
    });
    const promises = [];

    _itemsAdd.map((item) => {
      const result = callApi(`product/${item.id}`, "put", item);
      promises.push(result);
    });

    const results = await Promise.all(promises);
    const actualDatas = results.map((result) => result.data);
    localStorage.removeItem("products");
    window.location.reload();
  };

  const onChangeQty = () => {
    let totalVal = 0;
    for (let i = 0; i < items.length; i++) {
      totalVal =
        totalVal +
        document.getElementsByName(items[i].id)[0].value *
          document.getElementById(items[i].id).value;
    }
    setTotalPrice(totalVal);
  };
  return (
    <>
      <Top>
        <CenterButton onClick={clearAllItem}>XÓA TẤT CẢ SẢN PHẨM</CenterButton>
      </Top>
      <Bottom>
        <Info>
          {items.map((product) => {
            return (
              <>
                <Product key={product.id}>
                  <ProductDetail>
                    <Clear onClick={() => removeItem(product.id)} />
                    <Image src={product.image.slice(-1)} />
                    <Details>
                      <span>
                        {product.tag &&
                          product.tag.map((tag, index) => {
                            return (
                              <Tag key={index} color="blue">
                                {tag}
                              </Tag>
                            );
                          })}
                      </span>
                      <span>
                        <b>Tên sản phẩm:</b> {product.name}
                      </span>
                      <span>
                        <b>Giá:</b> {numberFormat.format(product.price)}
                      </span>
                      <span>
                        <b>Thương hiệu:</b> {product.brand}
                      </span>
                      <span>
                        <b>Loại:</b> {product.type}
                      </span>
                    </Details>
                  </ProductDetail>
                  <PriceDetail>
                    <ProductAmountContainer>
                      <Input
                        id={product.id}
                        min="1"
                        type="number"
                        defaultValue="1"
                        onClick={() => onChangeQty()}
                      />
                    </ProductAmountContainer>
                    <Box
                      component="form"
                      sx={{
                        "& > :not(style)": { m: 1, width: "25ch" },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        name={product.id}
                        label="Giá nhập hàng"
                        variant="standard"
                        onChange={() => onChangeQty()}
                      />
                    </Box>
                  </PriceDetail>
                </Product>
                <Hr />
              </>
            );
          })}
        </Info>
      </Bottom>
      <Container>
        <Summary>
          <SummaryTitle>ĐƠN NHẬP HÀNG</SummaryTitle>
          <Select onChange={(e) => setSupplierAdd(e.target.value)}>
            <option selected hidden>
              Nhà cung cấp
            </option>
            {data.map((supplier) => {
              return (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              );
            })}
          </Select>
          <SummaryItem type="total">
            <SummaryItemText>Tổng</SummaryItemText>
            <SummaryItemPrice>
              {numberFormat.format(totalPrice)}
            </SummaryItemPrice>
          </SummaryItem>
          <Button onClick={handleAdd}>NHẬP HÀNG NGAY</Button>
        </Summary>
      </Container>
    </>
  );
}
