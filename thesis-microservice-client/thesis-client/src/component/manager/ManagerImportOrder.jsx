import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ReadMoreOutlinedIcon from "@mui/icons-material/ReadMoreOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import callApi from "../../apicaller";
import * as React from "react";
import { useEffect, useState} from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

export default function ManagerImportOrder() {
  const [data, setData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")) || "";

  useEffect(() => {
    callApi(`importOrder/branch/${user?.managementAt}`, "get", null).then(
      (res) => {
        setData(res.data);
      }
    );
  }, []);

  const handleDelete = (id) => {
    callApi(`importOrder/${id}`, "delete", null);
    window.location.reload();
  };

  const numberFormat = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Ngày nhập hàng</b>
              </TableCell>
              <TableCell align="right">
                <b>Tổng tiền nhập</b>
              </TableCell>
              <TableCell align="right">
                <b>Hành động</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.items &&
              data.items
                .slice(0)
                .reverse()
                .map((importOrder, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {moment.utc(importOrder.time).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell align="right">
                      {numberFormat.format(importOrder.totalPrice)}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Chi tiết hóa đơn">
                        <Link
                          to={`/detailImportOrder/${importOrder.id}`}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          <ReadMoreOutlinedIcon />
                        </Link>
                      </Tooltip>
                      &nbsp;&nbsp;
                      <Tooltip title="Xóa hóa đơn">
                        <DeleteOutlineOutlinedIcon
                          onClick={() => handleDelete(importOrder.id)}
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
