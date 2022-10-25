import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { FormControl } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { ManageInterface, NutritionInterface } from "../interfaces/NutritionUI";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Link as RouterLink } from "react-router-dom";
import ResponsiveAppBar from "./Bar_02";

function Manage() {
  //[ตารางหลัก] //ที่เอาไปใส่จริงๆ
  const [map_bedID, setMap_BedID] = useState("");
  const [nutritionID, setNutritionID] = useState("");
  const userID = parseInt(localStorage.getItem("uid") + "");
  const [date, setDate] = React.useState<Date | null>(new Date());
  const [comment, setComment] = useState("");

  // data ที่ได้มาจากการ fethch //ได้ข้อมูลทั้งหมดยังไม่เป็นตัวเลขเลยที่ต้องการใส่ในตารางหลัก
  // ตารางที่ได้มาจากตารางเพื่อน และ ตารางที่ GET ข้อมูล
  const [MapBeds, setMapbeds] = useState<any[]>([]);
  const [userName, setUserName] = useState("");
  const [nutrition, setNutrition] = useState<NutritionInterface[]>([]);
  const [manage, SetManage] = React.useState<Partial<ManageInterface>>({});

  //check save
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  //สร้างฟังก์ชันสำหรับ คอยรับการกระทำ เมื่อคลิ๊ก หรือ เลือก
  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof Manage;
    const { value } = event.target;
    SetManage({ ...manage, [id]: value });
    setComment(value);
  };

  // function submit
  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  async function submit() {
    // async function = Synchronous
    // เตรียม data ที่จะส่งออก
    //!! NOTE : ตัว let ภายในตัวแปรและลำดับต้อง match กับ schema ของ entity หลัก ไม่งั้นแตก !!!!
    let data = {
      User_ID: userID,
      NutritionID: convertType(nutritionID),
      Map_BedID: convertType(map_bedID),
      Date: date,
      Comment: comment,
    };

    const apiUrl = "http://localhost:8080/CreateManage";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setSuccess(true);
        } else {
          setError(true);
        }
      });
    setMap_BedID("");
    setNutritionID("");
    setDate(null);
    setComment("");
  }

  // onchange in combobox //สร้างฟังก์ชันสำหรับ คอยรับการกระทำ เมื่อคลิ๊ก หรือ เลือก
  const onchangeMap_Bed = (event: SelectChangeEvent) => {
    setMap_BedID(event.target.value as string);
  };

  const onChangeNutrition = (event: SelectChangeEvent) => {
    setNutritionID(event.target.value as string);
  };

  const getUser = async () => {
    const apiUrl = `http://localhost:8080/user/${userID}`;
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setUserName(res.data.Name);
        }
      });
  };

  // GET /ListNutrition
  const getNutrition = async () => {
    const apiUrl = "http://localhost:8080/nutritions";
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setNutrition(res.data);
        }
      });
  };

  const getMappigBed = async () => {
    const apiUrl = "http://localhost:8080/GetListMapBeds";
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setMapbeds(res.data);
        }
      });
  };

  //function useEffect
  useEffect(() => {
    getUser();
    getNutrition();
    getMappigBed();
  }, []);

  //Alert Snackbar
  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };

  // UserInterface
  return (
    <div>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success">
          บันทึกข้อมูลสำเร็จ
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          บันทึกข้อมูลไม่สำเร็จ
        </Alert>
      </Snackbar>
      <ResponsiveAppBar />

      <Container maxWidth="md">
        <Box>
          <Paper>
            <Box
              display={"flex"}
              sx={{
                marginTop: 3,
                marginX: 2,

                paddingX: 2,
                paddingY: 0,
              }}
            >
              <Box sx={{ paddingX: 2, paddingY: 1 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  color="primary"
                  gutterBottom
                  sx={{ paddingTop: 2 }}
                >
                  โภชนาการ
                </Typography>
              </Box>
            </Box>
            <Divider />

            <Grid
              container
              rowSpacing={1}
              columnSpacing={5}
              sx={{ paddingX: 5 }}
            >
              <Grid item xs={6}>
                <p>ชื่อผู้ป่วย</p>
                <FormControl fullWidth>
                  <Select
                    id="Patient_Name"
                    value={map_bedID}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    onChange={onchangeMap_Bed}
                  >
                    <MenuItem value="">เลือกผู้ป่วย</MenuItem>
                    {MapBeds.map((MapBeds) => (
                      <MenuItem value={MapBeds.ID} key={MapBeds.ID}>
                        {MapBeds.Triage.Patient.Patient_Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <p>โภชนาการแบบ</p>
                <FormControl fullWidth>
                  <Select
                    id="Nutrition_Name"
                    value={nutritionID}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    onChange={onChangeNutrition}
                  >
                    <MenuItem value="">เลือกโภชนาการ</MenuItem>
                    {nutrition.map((nutrition) => (
                      <MenuItem value={nutrition.ID} key={nutrition.ID}>
                        {nutrition.Type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <p>แพทย์ผู้จัดการ</p>
                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    id="outlined-read-only-input"
                    value={userName}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <p>Date Time</p>
                <FormControl fullWidth variant="outlined">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={date}
                      onChange={(date) => {
                        setDate(date);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <p>หมายเหตุ</p>
                <TextField
                  fullWidth
                  id="outlined-multiline-static"
                  label="โภชนาการเพิ่มเติม"
                  multiline
                  rows={4}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  sx={{ backgroundColor: "#C70039", marginY: 3 }}
                  component={RouterLink}
                  to="/HomePage2"
                  variant="contained"
                >
                  ย้อนกลับ
                </Button>
                <Button
                  style={{ float: "right" }}
                  sx={{ marginY: 3 }}
                  onClick={submit}
                  variant="contained"
                  color="success"
                >
                  <b>บันทึก</b>
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}

export default Manage;
