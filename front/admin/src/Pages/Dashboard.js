import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import { useHistory } from "react-router-dom";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { Card, TableContainer } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { getRedeemData, updateRedeemData } from "../Services/DashboarService";
import Swal from "sweetalert2";
import { AlertError, AlertSuccess } from "../Helpers/SweetalertHelper";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 150,
  },
}));
export default function Dashboard() {
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [data, setData] = React.useState([]);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    async function fetchData() {
      const [result, error] = await getRedeemData();
      if (error) { 
        console.log(error.response)
      }
      setData(result.data.data);
    }
    fetchData();
  }, []);

  const updateStatus = async (id) => {
    Swal.fire({
      title: "Change Status",
      input: "select",
      inputOptions: {
        created: "Created",
        "in delivery": "In Delivery",
        rejected: "Rejected",
      },
      inputPlaceholder: "Select status",
      showCancelButton: true,
    }).then(async (value) => {
      if (value.isConfirmed) {
        const [result, error] = await updateRedeemData(id, {
          status: value.value,
        });
        if (error) { 
          AlertError.fire({text: "Update Status Failed"})
        }
        if (result) { 
          AlertSuccess.fire({ text: "Update Status Success" });
        }
      }
    });
  };
  const onclickLogout = () => {
    localStorage.clear();
    history.push("/login")
  };
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {" "}
          <div>
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={onclickLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </div>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <PrizeTotal />
              </Paper>
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <PrizeCreated />
              </Paper>
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <PrizeInDelivery />
              </Paper>
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <PrizeRejected />
              </Paper>
            </Grid> */}
            <Grid item xs={12} md={12} lg={12}>
              <Card className={classes.root}>
                <CardContent style={{ width: "100%" }}>
                  {/* <Autocomplete
                    id="combo-box-demo"
                    options={[{ title: "Test" }]}
                    getOptionLabel={(option) => option.title}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Filter by Status"
                        variant="outlined"
                      />
                    )}
                  /> */}
                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell align="right">Customer ID</TableCell>
                          <TableCell align="right">Customer Name</TableCell>
                          <TableCell align="right">Customer Address</TableCell>
                          <TableCell align="right">
                            Customer Contact Person
                          </TableCell>
                          <TableCell align="right">Prize</TableCell>
                          <TableCell align="right">Delivery Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((el, index) => (
                          <TableRow
                            key={index}
                            onClick={() => {
                              updateStatus(el.ID);
                            }}
                          >
                            <TableCell>{el.ID}</TableCell>
                            <TableCell align="right">{el.cust_id}</TableCell>
                            <TableCell align="right">{el.cust_name}</TableCell>
                            <TableCell align="right">
                              {el.cust_address}
                            </TableCell>
                            <TableCell align="right">{el.cust_cp}</TableCell>
                            <TableCell align="right">{el.prize}</TableCell>
                            <TableCell align="right">{el.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
