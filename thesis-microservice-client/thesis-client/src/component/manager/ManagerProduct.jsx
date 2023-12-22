import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import callApi from "../../apicaller";
import * as React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Link } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { Tag } from "antd";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Pagination from "@mui/material/Pagination";
import _ from "lodash";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Input = styled.input`
  padding: 10px;
`;
const Select = styled.select`
  padding: 10px;
  padding-right: 60px;
`;
const FilterContainer = styled.div`
  display: flex;
  margin-bottom: 20px
`;
const Filter = styled.div`
  margin-right: 15px;
`;
const SearchContainer = styled.div`
`;
const Option = styled.option``;

export default function ManagerProduct() {
  const [page, setPage] = useState(0);

  const [dataProduct, setDataProduct] = useState([]);
  const [dataBrand, setDataBrand] = useState([]);
  const [dataType, setDataType] = useState([]);
  const [dataTag, setDataTag] = useState([]);

  const user = JSON.parse(localStorage.getItem("user")) || [];

  const dataStorage = JSON.parse(localStorage.getItem("products")) || [];
  const [message, setMessage] = useState("");

  const [importProduct, setImportProduct] = useState(0);

  useEffect(() => {
    callApi(`product/branch/${user?.managementAt}`, "get", null).then((res) => {
      setDataProduct(res.data);
    });
    callApi(`brand`, "get", null).then((res) => {
      setDataBrand(res.data);
    });
    callApi(`typeOfProduct`, "get", null).then((res) => {
      setDataType(res.data);
    });
    callApi(`tag`, "get", null).then((res) => {
      setDataTag(res.data);
    });
    setImportProduct(dataStorage.length);
  }, [importProduct]);
  //message response
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleDelete = (id) => {
    callApi(`bill/checkExist/${id}/${user.managementAt}`, "get", null).then(
      (res) => {
        if (res.data.length > 0) {
          setMessage("Sản phẩm đang tồn tại trong một đơn hàng không thể xóa!");
          setOpenSnackbar(true);
        } else {
          callApi(`product/${id}`, "delete", null);
          window.location.reload();
        }
      }
    );
  };

  const numberFormat = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const [open, setOpen] = useState(false);
  const [dataDetail, setDataDetail] = useState("");

  const handleClickOpen = (id) => {
    callApi(`product/${id}`, "get", null).then((res) => {
      setDataDetail(res.data);
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [search, setSearch] = useState("");
  const [filterAmount, setFilterAmount] = useState("");
  const [valueTag, setValueTag] = useState("");
  const [valueType, setValueType] = useState("");
  const [valueBrand, setValueBrand] = useState("");

  const onlyUnique = (value) => {
    const result = dataStorage.some((el) => {
      return el.id === value;
    });
    return result;
  };

  const addDataStorage = (product) => {
    if (onlyUnique(product.id)) {
      setMessage("Sản phẩm đã tồn tại trong kho!");
      setOpenSnackbar(true);
    } else {
      dataStorage.push(product);
      localStorage.setItem("products", JSON.stringify(dataStorage));
      setImportProduct(dataStorage.length);
    }
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
    }else if (filterAmount) {
      if(filterAmount == 0){
        return dataProduct.filter((product) => product.amount > 50);
      }
      if(filterAmount == 1){
        return dataProduct.filter((product) => product.amount < 50 && product.amount > 0);
      }
      if(filterAmount == 2){
        return dataProduct.filter((product) => product.amount == 0);
      }
    }
    return dataProduct;
  };

  const handleChangePage = (event, value) => {
    setPage(value - 1);
  };

  return (
    <>
      <FilterContainer>
        <Filter>
          <button className="mr-3 px-5 py-2.5 relative rounded group font-medium text-white font-medium inline-block">
            <span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
            <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
            <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
            <span className="relative">
              <Link to="/product/new">THÊM</Link>
            </span>
          </button>

          <button className="z-1 px-5 py-2.5 relative rounded group font-medium text-white font-medium inline-block">
            <div class="animate-ping z-10 absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -right-2 -top-2 dark:border-gray-900">
              {importProduct}
            </div>
            <span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
            <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
            <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
            <span className="relative">
              <Link to="/importProduct" className="text-white">
                NHẬP
              </Link>
            </span>
          </button>
        </Filter>
        <Filter>
          <SearchContainer>
            <Input
              className="w-32"
              placeholder="Tìm kiếm"
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
          </SearchContainer>
        </Filter>
        <Filter>
          <Select
            onChange={(e) => setFilterAmount(e.target.value)}
            defaultValue={-1}
          >
            <Option value={-1} disabled>
              Mới nhất
            </Option>
            <Option value={0}>Nhiều hơn 50</Option>
            <Option value={1}>Ít hơn 50</Option>
            <Option value={2}>Hết hàng</Option>
          </Select>
        </Filter>
        <Filter>
          <Select
            onChange={(e) => setValueType(e.target.value)}
            defaultValue={-1}
          >
            <Option value={-1} disabled>
              Loại
            </Option>
            {dataType &&
              dataType?.map((data) => {
                return (
                  <Option value={data.name} key={data.id}>
                    {data.name}
                  </Option>
                );
              })}
          </Select>
        </Filter>
        <Filter>
          <Select
            onChange={(e) => setValueTag(e.target.value)}
            defaultValue={-1}
          >
            <Option value={-1} disabled>
              Thẻ
            </Option>
            {dataTag &&
              dataTag?.map((data) => {
                return (
                  <Option value={data.name} key={data.id}>
                    {data.name}
                  </Option>
                );
              })}
          </Select>
        </Filter>
        <Filter>
          <Select
            onChange={(e) => setValueBrand(e.target.value)}
            defaultValue={-1}
          >
            <Option value={-1} disabled>
              Thương hiệu
            </Option>
            {dataBrand &&
              dataBrand?.map((data) => {
                return (
                  <Option value={data.name} key={data.id}>
                    {data.name}
                  </Option>
                );
              })}
          </Select>
        </Filter>
      </FilterContainer>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">
                <b>Tên sản phẩm</b>
              </TableCell>
              <TableCell align="left">
                <b>Ảnh</b>
              </TableCell>
              <TableCell align="left">
                <b>Giá</b>
              </TableCell>
              <TableCell align="left">
                <b>Thương hiệu</b>
              </TableCell>
              {/* <TableCell align="right">
                <b>Nhà cung cấp</b>
              </TableCell> */}
              {/* <TableCell align="right">
                <b>Loại sản phẩm</b>
              </TableCell> */}
              <TableCell align="left">
                <b>Trạng thái</b>
              </TableCell>
              <TableCell align="left">
                <b>Hành động</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_.chunk(filterArrProduct(), 8)[page] &&
              _.chunk(filterArrProduct(), 8)
                [page].slice(0)
                .reverse()
                .map((product) => (
                  <TableRow key={product.id}>
                    <TableCell align="left">
                      {product.name.substring(0, 30) + "..."}
                    </TableCell>
                    <TableCell align="left">
                      <img width="80" src={product.image.slice(-1)}></img>
                    </TableCell>
                    <TableCell align="left">
                      {numberFormat.format(product.price)}
                    </TableCell>
                    <TableCell align="left">{product.brand}</TableCell>
                    {/* <TableCell align="right">{product.supplier}</TableCell> */}
                    {/* <TableCell align="right">{product.type}</TableCell> */}
                    <TableCell align="left">
                      <button
                        style={{
                          backgroundColor:
                            product.amount > 0 ? "#4CAF50" : "#f44336",
                          border: "aliceblue",
                          borderRadius: 15,
                          color: "white",
                          padding: 7,
                        }}
                      >
                        {product.amount > 0 ? "Còn hàng" : "Hết hàng"}
                      </button>
                    </TableCell>
                    <TableCell align="left">
                      <Tooltip title="Thêm vào đơn nhập hàng">
                        <AddCircleOutlineIcon
                          onClick={() => addDataStorage(product)}
                        />
                      </Tooltip>
                      &nbsp;&nbsp;
                      <Tooltip title="Xem chi tiết">
                        <ArticleOutlinedIcon
                          onClick={() => handleClickOpen(product.id)}
                        />
                      </Tooltip>
                      &nbsp;&nbsp;
                      <Tooltip title="Xóa sản phẩm">
                        <DeleteOutlineOutlinedIcon
                          onClick={() => handleDelete(product.id)}
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-center mt-8 lg:justify-end">
        <Pagination
          onChange={handleChangePage}
          count={_.chunk(filterArrProduct(), 8).length}
          color="primary"
        />
      </div>
      {/* form more information */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Số lượng tồn: {dataDetail.amount}
        </DialogTitle>
        <div style={{ marginLeft: 25 }}>
          {dataDetail.tag?.map((tag) => {
            return (
              <Tag color="blue" key={tag.name}>
                {tag}
              </Tag>
            );
          })}
        </div>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dataDetail.description}
          </DialogContentText>
        </DialogContent>
      </Dialog>
      {/* snackbar response */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
