import React from "react";
import { Avatar } from "evergreen-ui";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBirthdayCake,
  faCalendarAlt,
  faEnvelope,
  faPhone,
  faUserClock,
  faHourglassHalf,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import "./Styles/st.css";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedUser") || "[]");

  return (
    <div className="profileContainer">
      <div className="profileCard">
        <div className="avatarContainer">
          <Avatar src="" name={user} size={200} className="avatar" />
          <h1 className="profileTitle">PROFILE</h1>
        </div>
        <div className="profileDetails">
          <div>
            <div className="profileLabel">
              <FontAwesomeIcon icon={faUser} className="profileLabelIcon" />
              <span>UserName</span>
            </div>
            <div className="profileValue">{user}</div>
          </div>
          <div className="fex">
            <div className="profileLabel">
              <FontAwesomeIcon
                icon={faCalendar}
                className="profileLabelIcon"
              />
              <span>Age</span>
            </div>
            <div className="profileValue">19</div>
          </div>

          <div>
            <div className="profileLabel">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="profileLabelIcon"
              />
              <span>Date of Joining</span>
            </div>
            <div className="profileValue">05-09-2024</div>
          </div>
          <div className="fex">
            <div className="profileLabel">
              <FontAwesomeIcon icon={faEnvelope} className="profileLabelIcon" />
              <span>Email</span>
            </div>
            <div className="profileValue">suresh@gmail.com</div>
          </div>
          <div>
            <div className="profileLabel">
              <FontAwesomeIcon icon={faPhone} className="profileLabelIcon" />
              <span>Phone Number</span>
            </div>
            <div className="profileValue">9876543210</div>
          </div>
          <div className="mobbt">
            <button className="logoutButton" onClick={() => navigate("/Login")}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
