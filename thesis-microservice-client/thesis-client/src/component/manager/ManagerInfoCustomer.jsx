import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import callApi from "../../apicaller";
import * as React from "react";
import { useEffect, useState } from "react";
import moment from "moment";
import _ from "lodash";
import Pagination from "@mui/material/Pagination";

export default function ManagerInfoCustomer() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    callApi(`infoCustomer`, "get", null).then((res) => {
      setData(res.data);
    });
  }, []);

  const handleChangePage = (event, value) => {
    setPage(value - 1);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
            <TableCell align="right">
                <b>Thời gian</b>
              </TableCell>
              <TableCell align="right">
                <b>Họ</b>
              </TableCell>
              <TableCell align="right">
                <b>Tên</b>
              </TableCell>
              <TableCell align="right">
                <b>Số điện thoại</b>
              </TableCell>
              <TableCell align="right">
                <b>Email</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_.chunk(data, 8)[page] &&
              _.chunk(data, 8)[page].map((user) => (
                <TableRow key={user.id}>
                     <TableCell align="right">{moment.utc(user.time).format("DD/MM/YYYY")}</TableCell>
                  <TableCell align="right">{user.lastName}</TableCell>
                  <TableCell align="right">{user.firstName}</TableCell>
                  <TableCell align="right">{user.phone}</TableCell>
                  <TableCell align="right">{user.email}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-center mt-8 lg:justify-end">
        <Pagination
          onChange={handleChangePage}
          count={_.chunk(data, 8).length}
          color="primary"
        />
      </div>
    </>
  );
}
