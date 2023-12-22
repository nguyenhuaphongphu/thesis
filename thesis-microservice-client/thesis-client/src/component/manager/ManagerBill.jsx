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
import Tooltip from "@mui/material/Tooltip";
import moment from "moment";
import { Link } from "react-router-dom";
import ReadMoreOutlinedIcon from "@mui/icons-material/ReadMoreOutlined";
import styled from "styled-components";
import Pagination from "@mui/material/Pagination";
import _ from "lodash";

const Option = styled.option``;
const Filter = styled.div``;
const FilterContainer = styled.div`
  display: flex;
`;
const Select = styled.select`
  flex: 1;
  margin: 10px 10px 20px 0px;
  padding: 10px;
  padding-right: 60px;
`;

export default function ManagerBill() {
  const [page, setPage] = useState(0);
  const handleChangePage = (event, value) => {
    setPage(value - 1);
  };

  const [data, setData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")) || "";

  useEffect(() => {
    callApi(`bill/branch/${user?.managementAt}`, "get", null).then((res) => {
      setData(res.data);
    });
  }, []);

  const handleDelete = (ob) => {
    const _ob = { ...ob, active: !ob.active };
    callApi(`bill/${ob.id}`, "put", _ob);
    window.location.reload();
  };

  const numberFormat = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const handleStatus = (ob) => {
    const _ob = { ...ob, status: !ob.status };
    callApi(`bill/${ob.id}`, "put", _ob);
    window.location.reload();
  };

  const handleGiving = (ob) => {
    const _ob = { ...ob, delivered: !ob.delivered };
    callApi(`bill/${ob.id}`, "put", _ob);
    window.location.reload();
  };

  const handleFinish= (ob) => {
    const _ob = { ...ob, finish: !ob.finish };
    callApi(`bill/${ob.id}`, "put", _ob);
    window.location.reload();
  };

  const [giving, setGiving] = useState("0");
  const filterGiving = (e) => {
    setGiving(e);
  };

  const filterArrBill = () => {
    if (giving) {
      if (giving === "0") {
        return (
          data &&
          data.filter((bill) => 
            bill.finish === false && bill.active === true
          )
        );
      }else if (giving === "1") {
        return (
          data &&
          data.filter((bill) => 
            bill.finish === true && bill.active === true
          )
        );
      }
    }
  };

  return (
    <>
      <FilterContainer>
        <Filter>
          <Select
            onChange={(e) => filterGiving(e.target.value)}
            defaultValue={-1}
          >
            <Option value={-1} disabled>Chọn trạng thái</Option>
            <Option value="0">Chưa giao hàng</Option>
            <Option value="1">Đã giao hàng</Option>
          </Select>
        </Filter>
      </FilterContainer>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Ngày đặt</b>
              </TableCell>
              <TableCell align="right">
                <b>Tổng tiền</b>
              </TableCell>
              <TableCell align="right">
                <b>Nhận đơn</b>
              </TableCell>
              <TableCell align="right">
                <b>Trạng thái hàng</b>
              </TableCell>
              <TableCell align="right">
                <b>Đã giao</b>
              </TableCell>
              <TableCell align="right">
                <b>Hành động</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_.chunk(filterArrBill().slice(0).reverse(), 8)[page] &&
              _.chunk(filterArrBill().slice(0).reverse(), 8)[page].map(
                (bill, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {moment.utc(bill.time).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell align="right">
                      {numberFormat.format(bill.totalPrice)}
                    </TableCell>
                    <TableCell align="right">
                      <button
                        style={{
                          backgroundColor: bill.status ? "#e7e7e7" : "#f44336",
                          border: "aliceblue",
                          borderRadius: 15,
                          color: "white",
                          padding: 7,
                        }}
                        onClick={() => handleStatus(bill)}
                      >
                        {bill.status ? "Đã nhận đơn" : "Nhận đơn"}
                      </button>
                    </TableCell>
                    <TableCell align="right">
                      <button
                        style={{
                          backgroundColor: bill.delivered
                            ? "#e7e7e7"
                            : "#f44336",
                          border: "aliceblue",
                          borderRadius: 15,
                          color: "white",
                          padding: 7,
                        }}
                        onClick={() => handleGiving(bill)}
                      >
                        {bill.delivered ? "Đã lấy hàng" : "Chưa lấy hàng"}
                      </button>
                    </TableCell>
                    <TableCell align="right">
                      <button
                        style={{
                          backgroundColor: bill.finish
                            ? "#e7e7e7"
                            : "#f44336",
                          border: "aliceblue",
                          borderRadius: 15,
                          color: "white",
                          padding: 7,
                        }}
                        onClick={() => handleFinish(bill)}
                      >
                        {bill.finish ? "Đã giao" : "Chưa giao"}
                      </button>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Chi tiết hóa đơn">
                        <Link
                          to={`/detailbill/${bill.id}`}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          <ReadMoreOutlinedIcon />
                        </Link>
                      </Tooltip>
                      &nbsp;&nbsp;
                      <Tooltip title="Xóa hóa đơn">
                        <DeleteOutlineOutlinedIcon
                          onClick={() => handleDelete(bill)}
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-center mt-8 lg:justify-end">
        <Pagination
          onChange={handleChangePage}
          count={_.chunk(filterArrBill(), 8).length}
          color="primary"
        />
      </div>
    </>
  );
}
