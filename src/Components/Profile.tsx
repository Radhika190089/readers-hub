import React from "react";
import { Avatar } from "evergreen-ui";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBirthdayCake,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import "./Styles/st.css";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("admin") || "[]");

  return (
    <div className="profileContainer">
      <div className="profileCard">
        <div className="profileDetails">
          <h1 className="profileTitle">PROFILE</h1>

          <div className="profileLabel">
            <FaUser className="profileLabelIcon" />
            <span>Full Name</span>
          </div>
          <div className="profileValue">Suresh</div>

          <div className="profileLabel">
            <FaBirthdayCake className="profileLabelIcon" />
            <span>Age</span>
          </div>
          <div className="profileValue">19</div>

          <div className="profileLabel">
            <FaCalendarAlt className="profileLabelIcon" />
            <span>Date of Joining</span>
          </div>
          <div className="profileValue">05-09-2024</div>

          <div className="profileLabel">
            <FaEnvelope className="profileLabelIcon" />
            <span>Email</span>
          </div>
          <div className="profileValue">suresh@gmail.com</div>

          <div className="profileLabel">
            <FaPhone className="profileLabelIcon" />
            <span>Phone Number</span>
          </div>
          <div className="profileValue">9876543210</div>
        </div>

        <div className="avatarContainer" style={{marginRight:'50px', marginTop:'1px'}}>
          <Avatar
            src="https://th.bing.com/th/id/OIP.zwopwehds0tzVkU1UCSlEAHaEK?rs=1&pid=ImgDetMain"
            name={"Suresh"}
            size={200}
            className="avatar"
          />
        </div>
        <button className="logoutButton" onClick={() => navigate("/Login")} style={{marginBottom:'50px', marginRight:'120px'}}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
