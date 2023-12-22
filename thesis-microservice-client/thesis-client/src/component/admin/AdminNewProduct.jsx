import callApi from "../../apicaller";
import * as React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Checkbox, Col, Row } from "antd";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Title = styled.h1`
  font-size: 24px;
  text-align: center;
`;
const Form = styled.form`
  text-align: center;
  display: flex;
  flex-wrap: wrap;
`;
const Input = styled.input`
  flex: 1;
  margin: 10px 10px 20px 0px;
  padding: 10px 10px 10px 10px;
`;
const InputUpload = styled.input`
  flex: 1;
  margin: 10px 10px 20px 0px;
  padding: 10px 10px 10px 0px;
`;
const Button = styled.button`
  width: 20%;
  border: none;
  background-color: teal;
  color: white;
  cursor: pointer;
  padding: 10px;
  text-align: center;
  display: block;
  margin: 0 auto;
`;
const Select = styled.select`
  flex: 1;
  margin: 10px 10px 20px 0px;
  padding: 10px;
  padding-right: 60px;
`;
const Textarea = styled.textarea`
  margin: 10px 10px 20px 0px;
  padding: 10px;
  width: 100%;
`;

export default function AdminNewProduct() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || [];

  const [dataBrand, setDataBrand] = useState([]);
  const [dataSupplier, setDataSupplier] = useState([]);
  const [dataType, setDataType] = useState([]);
  const [dataTag, setDataTag] = useState([]);

  useEffect(() => {
    callApi("brand", "get", null).then((res) => {
      setDataBrand(res.data);
    });
    callApi("supplier", "get", null).then((res) => {
      setDataSupplier(res.data);
    });
    callApi("typeOfProduct", "get", null).then((res) => {
      setDataType(res.data);
    });
    callApi("tag", "get", null).then((res) => {
      setDataTag(res.data);
    });
  }, []);

  const [selectedFile, setSelectedFile] = useState([]);
  const [nameProductAdd, setNameProductAdd] = useState("");
  const [priceProductAdd, setPriceProductAdd] = useState("");
  const [describeProductAdd, setDescribeProductAdd] = useState("");
  const [brandProductAdd, setBrandProductAdd] = useState("");
  const [supplierProductAdd, setSupplierProductAdd] = useState("");
  const [productTypeProductAdd, setProductTypeProductAdd] = useState("");
  const [checkboxes, setCheckBoxes] = useState("");
  const onChange = (checkedValues) => {
    setCheckBoxes(checkedValues);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const arrElement = [];
    for (var j = 0; j < selectedFile.length; j++) {
      arrElement.push(`http://localhost:8888/images/${selectedFile[j].name}`);
    }
    if (
      nameProductAdd === "" ||
      priceProductAdd === "" ||
      describeProductAdd === "" ||
      brandProductAdd === "" ||
      supplierProductAdd === "" ||
      productTypeProductAdd === "" ||
      checkboxes === "" ||
      selectedFile.length === 0
    ) {
      message.warning("Vui lòng nhập đầy đủ thông tin !");
    } else {
      const dataAdd = {
        name: nameProductAdd,
        price: priceProductAdd,
        image: arrElement,
        brand: brandProductAdd,
        supplier: supplierProductAdd,
        type: productTypeProductAdd,
        description: describeProductAdd,
        tag: checkboxes,
        branchId: user.managementAt,
      };
      callApi("product", "post", dataAdd).then((res) => {
        navigate("/product");
        window.location.reload();
      });

      for (var i = 0; i < selectedFile.length; i++) {
        const formData = new FormData();
        formData.append("images", selectedFile[i]);
        try {
          const response = await axios({
            method: "post",
            url: "http://localhost:8888/images/upload",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
          });
        } catch (error) {
          message.error(error.response.data.message);
        }
      }
    }
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files);
  };

  return (
    <div>
      <Title>Thêm sản phẩm</Title>
      <Form>
        <Input
          placeholder="Tên sản phẩm"
          onChange={(e) => setNameProductAdd(e.target.value)}
        />
        <Input
          placeholder="Giá VNĐ"
          type="number"
          onChange={(e) => setPriceProductAdd(e.target.value)}
        />
        <Textarea
          placeholder="Mô tả"
          onChange={(e) => setDescribeProductAdd(e.target.value)}
        />
        <Select onChange={(e) => setBrandProductAdd(e.target.value)}>
          <option hidden>Thương hiệu</option>
          {dataBrand?.map((brand) => {
            return (
              <option key={brand.id} value={brand.name}>
                {brand.name}
              </option>
            );
          })}
        </Select>
        <Select onChange={(e) => setSupplierProductAdd(e.target.value)}>
          <option hidden>Nhà cung cấp</option>
          {dataSupplier?.map((supplier) => {
            return (
              <option key={supplier.id} value={supplier.name}>
                {supplier.name}
              </option>
            );
          })}
        </Select>
        <Select onChange={(e) => setProductTypeProductAdd(e.target.value)}>
          <option hidden>Loại sản phẩm</option>
          {dataType?.map((producttype) => {
            return (
              <option key={producttype.id} value={producttype.name}>
                {producttype.name}
              </option>
            );
          })}
        </Select>
        <Checkbox.Group style={{ width: "100%" }} onChange={onChange}>
          <Row>
            {dataTag?.map((tag) => {
              return (
                <Col key={tag.id}>
                  <Checkbox value={tag.name}>{tag.name}</Checkbox>&emsp;
                </Col>
              );
            })}
          </Row>
        </Checkbox.Group>
        <InputUpload type="file" onChange={handleFileSelect} multiple />
      </Form>
      <Button onClick={handleAdd}>Đồng ý</Button>
    </div>
  );
}
