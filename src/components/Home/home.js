import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../../redux/alertSlice";
import Adminlayout from "./adminLayout";
import $, { get } from "jquery";
import "bootstrap";
import "./home.css";
import UserApplications from "./userApplications";

const Home = () => {
  const dispatch = useDispatch();
  const [existingApplication, setExistingApplications] = useState(null);
  const { loading } = useSelector((state) => state.alerts);
  const [states, setStates] = useState([]);
  const Navigate = useNavigate();
  const [user, setUser] = useState({});
  const [admin, setAdmin] = useState(false);
  const [reload, setReload] = useState(false);
  const Application = Object.freeze({
    Name: "",
    Address: "",
    City: "",
    state: "",
    email: "",
    mobile: "",
    CompanyName: "",
  });

  const [application, setApplication] = useState(Application);
  const getData = async () => {
    let response;
    try {
      response = await axios.post(
        "/api/user/",
        {},
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        if (response.data.data.isSuperUser) {
          console.log("admin", response.data.isSuperUser);
          setAdmin(true);
        } else {
          setExistingApplications(response.data.Applications);
          setUser(response.data.data);
        }
      }
    } catch (error) {
      localStorage.clear();
      Navigate("/login");
    }
  };

  const getStates = async () => {
    try {
      const response = await axios.get("/api/user/getStates/", {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setStates(response.data.states);
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e) => {
    setApplication({
      ...application,
      [e.target.name]: e.target.value.trim(),
    });
  };
  const handleChangeFile = (e) => {
    console.log(e.target.files[0]);
    setApplication({
      ...application,
      [e.target.name]: e.target.files[0],
    });
  };
  const submitHandler = async (event) => {
    event.preventDefault();
    console.log(application);
    try {
      $("#modalSubscriptionForm").modal("hide");

      const response = await axios.post(
        "/api/user/newApplication",
        { application },
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      window.location.reload();
      $("#modalSubscriptionForm").modal("hide");
      getData();
    } catch (error) {
      console.log(error);
    }
  };
  const logout = () => {
    localStorage.clear();
    Navigate("/login");
  };
  const userEmptyCheck = !(
    Object.keys(user).length === 0 && user.constructor === Object
  );

  return (
    <React.Fragment>
      {userEmptyCheck && (
        <React.Fragment>
          <nav class="navbar ">
            <div class="container-fluid navClass">
              <a class="navbar-brand text-dark">Incubation </a>

              <section className="ftco-section">
                <div
                  className="modal fade"
                  id="modalSubscriptionForm"
                  tabindex="-1"
                  role="dialog"
                  aria-labelledby="myModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header text-center">
                        <h4 className="modal-title w-100 font-weight-bold">
                          Subscribe
                        </h4>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>

                      <form
                        onSubmit={submitHandler}
                        onLoad={getStates}
                        id="incubationApplication"
                      >
                        {" "}
                        <div className="modal-body mx-3">
                          <div className="md-form mb-2">
                            <i className="fas fa-user prefix grey-text"></i>
                            <label
                              data-error="wrong"
                              data-success="right"
                              for="form3"
                            >
                              Name :
                            </label>
                            <input
                              onChange={handleChange}
                              type="text"
                              name="Name"
                              id="form3"
                              placeholder="Name"
                              className="form-control validate"
                            />
                          </div>

                          <div className="md-form mb-2">
                            <i className="fas fa-envelope prefix grey-text"></i>
                            <label
                              data-error="wrong"
                              data-success="right"
                              for="form2"
                            >
                              Address :
                            </label>
                            <input
                              onChange={handleChange}
                              type="text"
                              name="Address"
                              id="form2"
                              placeholder="Address"
                              className="form-control validate"
                            />{" "}
                          </div>

                          <div className="md-form m">
                            <i className="fas fa-envelope prefix grey-text"></i>
                            <label
                              data-error="wrong"
                              data-success="right"
                              for="form2"
                            >
                              City :
                            </label>
                            <input
                              onChange={handleChange}
                              type="text"
                              name="City"
                              id="form2"
                              placeholder="City"
                              className="form-control validate"
                            />
                          </div>

                          <div className="md-form m">
                            <i className="fas fa-envelope prefix grey-text"></i>
                            <label
                              data-error="wrong"
                              data-success="right"
                              for="form2"
                            >
                              Email :
                            </label>
                            <input
                              onChange={handleChange}
                              type="email"
                              id="form2"
                              name="email"
                              placeholder="Email"
                              className="form-control validate"
                            />
                          </div>

                          <div className="md-form m">
                            <i className="fas fa-envelope prefix grey-text"></i>
                            <label
                              data-error="wrong"
                              data-success="right"
                              for="form2"
                            >
                              Mobile :
                            </label>
                            <input
                              onChange={handleChange}
                              type="tel"
                              id="form2"
                              placeholder="Phone NO"
                              name="mobile"
                              className="form-control validate"
                            />
                          </div>

                          <div className="md-form m">
                            <i className="fas fa-envelope prefix grey-text"></i>
                            <label
                              data-error="wrong"
                              data-success="right"
                              for="form2"
                            >
                              Company Name :
                            </label>
                            <input
                              onChange={handleChange}
                              type="text"
                              id="form2"
                              placeholder="Company Name"
                              name="CompanyName"
                              required
                              className="form-control validate"
                            />
                          </div>
                        </div>
                        <div className="modal-footer d-flex justify-content-center">
                          <button className="btn btn-dark">
                            Submit <i className="fas fa-paper-plane-o ml-1"></i>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="text-center"></div>
                <div className="container">
                  <div className="row ">
                    {!existingApplication && (
                      <button
                        id="newApp"
                        className="d-flex align-items-center btn btn-dark"
                        data-toggle="modal"
                        data-target="#modalSubscriptionForm"
                      >
                        Apply
                      </button>
                    )}

                    <button
                      onClick={logout}
                      className="logout-btn d-flex align-items-center btn btn-danger"
                      data-toggle=""
                      data-target=""
                    >
                      logout
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </nav>
          {existingApplication && (
            <UserApplications application={existingApplication} />
          )}
        </React.Fragment>
      )}

      {admin && <Adminlayout />}
    </React.Fragment>
  );
};
export default Home;
