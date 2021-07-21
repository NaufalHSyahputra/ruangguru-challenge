import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import RedeemIcon from "@material-ui/icons/Redeem";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { useState } from "react";
import { useEffect } from "react";
import { getUserData, saveUserData } from "./Services/ClientService";
import { AlertError, AlertSuccess } from "./Helpers/SweetalertHelper";
import Autocomplete from "@material-ui/lab/Autocomplete";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: "wrap",
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    margin: theme.spacing(1),
    width: "100%", // Fix IE 11 issue.
  },
}));

export default function SignUp() {
  const [userID, setUserID] = useState("");
  const [disableuserID, setDisableUserID] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [packages, setPackages] = useState([]);
  const [packageSelected, setPackageSelected] = useState({});
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [alreadyInput, setAlreadyInput] = useState("")
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.userId) {
      fetchData();
      if (localStorage.getItem("alreadyinput") === params.userId) { 
        setAlreadyInput(localStorage.getItem("alreadyinput"))
      } else { 
        setAlreadyInput("")
        localStorage.setItem("alreadyinput", "")
      }
    }
    async function fetchData() {
      const [result, error] = await getUserData({
        userId: params.userId,
      });
      if (error) {
        AlertError.fire({
          text: error.response.data.message,
        });
        return;
      }
      if (result.status >= 200 && result.status < 300) {
        //get succeed package
        let packages = result.data.packages.filter(
          (el) => el.orderStatus === "SUCCEED"
        );
        packages = packages.map((el) => {
          let prize = "";
          let prize_id = "";
          switch (el.packageTag) {
            case "englishacademy":
              prize = "shoes";
              prize_id = "sepatu";
              break;
            case "skillacademy":
              prize = "bag";
              prize_id = "tas";
              break;
            case "ruangguru":
              prize = "pencils";
              prize_id = "pensil";
              break;
            default:
              prize = "";
              break;
          }
          return {
            ...el,
            prize,
            prize_id,
          };
        });
        setPackageSelected(packages[0]);
        setPackages(packages);
        setName(result.data.user.userName);
        setUserID(result.data.user.userId);
        setContactNumber(result.data.user.userPhoneNumber);
        setDisableUserID(true);
      }
    }
  }, []);

  const onChangeName = ({ target: { value } }) => {
    setName(value);
    if (value.length === 0) { 
      setSubmitDisabled(true)
    }else { 
      setSubmitDisabled(false)
    }
  };

  const onChangeAddress = ({ target: { value } }) => {
    setAddress(value);
    if (value.length === 0) { 
      setSubmitDisabled(true)
    }else { 
      setSubmitDisabled(false)
    }
  };

  const onChangeContactNumber = ({ target: { value } }) => {
    setContactNumber(value);
    if (value.length === 0) { 
      setSubmitDisabled(true)
    }else { 
      setSubmitDisabled(false)
    }
  };

  const onChangePackage = (e, newValue) => {
    setPackageSelected(newValue);
    if (!newValue) { 
      setSubmitDisabled(true)
    }else { 
      setSubmitDisabled(false)
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault()
    let data = {
      custid: userID,
      custname: name,
      custaddress: address,
      custcp: contactNumber,
      prize: packageSelected.prize
    };
    const [result, error] = await saveUserData(data)
    if (error) {
      AlertError.fire({
        text: error.response.data.message,
      });
      return;
    }
    if (result.status >= 200 && result.status < 300) {
      AlertSuccess.fire({
        text: "Data anda berhasil disimpan. Silahkan tunggu sampai barang anda sampai."
      }).then(() => {
        localStorage.setItem("alreadyinput", userID);
        setAlreadyInput(userID)
      })
    }
  };
  const classes = useStyles();
  if (alreadyInput) { 
    return (
      <div>
        <CssBaseline />
        <AppBar
          position="static"
          color="default"
          elevation={0}
          className={classes.appBar}
        >
          <Toolbar className={classes.toolbar}>
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              className={classes.toolbarTitle}
            >
              Ruangguru Client
            </Typography>
            {/* <Button
              href="#"
              color="primary"
              variant="outlined"
              className={classes.link}
            >
              Admin
            </Button> */}
          </Toolbar>
        </AppBar>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <RedeemIcon />
            </Avatar>
            <Typography variant="h5" gutterBottom>
              YOU ALREADY CLAIM THE PRIZE
            </Typography>
            <Typography variant="body1" gutterBottom align="center">
              Anda sudah pernah melakukan klaim
            </Typography>
          </div>
          <Box mt={5}>
            <Copyright />
          </Box>
        </Container>
      </div>
    );
  }
  return (
    <div>
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
          >
            Ruangguru Client
          </Typography>
          {/* <Button
            href="#"
            color="primary"
            variant="outlined"
            className={classes.link}
          >
            Admin
          </Button> */}
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <RedeemIcon />
          </Avatar>
          <Typography variant="h5" gutterBottom>
            YOU WON. CLAIM YOUR PRIZE!
          </Typography>
          <Typography variant="body1" gutterBottom align="center">
            Selamat, anda berhak mendapatkan hadiah berupa :{" "}
            <b>{packageSelected.prize_id}</b> dari Ruangguru. Silahkan lengkapi
            form dibawah agar kami dapat mengirimkan hadiah mu.
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="userid"
                  label="User ID"
                  name="userid"
                  autoComplete="userid"
                  value={userID}
                  disabled={disableuserID}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="name"
                  label="Contact Person Name"
                  name="name"
                  autoComplete="name"
                  onChange={onChangeName}
                  value={name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  multiline
                  maxRows={4}
                  fullWidth
                  id="standard-multiline-flexible"
                  label="Delivery Address"
                  name="address"
                  autoComplete="address"
                  value={address}
                  onChange={onChangeAddress}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="name"
                  label="Contact Number"
                  name="name"
                  autoComplete="name"
                  value={contactNumber}
                  onChange={onChangeContactNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  id="combo-box-demo"
                  options={packages}
                  getOptionLabel={(option) => option.packageName}
                  onChange={onChangePackage}
                  value={packageSelected}
                  disabled={packages.length <= 1}
                  style={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Product Subscription Name"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={onSubmit}
              disabled={submitDisabled}
            >
              Submit
            </Button>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    </div>
  );
}
