import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaLock,
  FaCalendarAlt,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaSave,
  FaCamera,
  FaTimes
} from "react-icons/fa";
import { getStats, getStreak } from "../services/analyticsService";
import "../styles/Profile.css";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "../services/profileService";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

const Profile = () => {

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    bio: "",
    avatarStyle: "personas",
    profileImage: "",
    createdAt: "",
    lastLogin: "",
    emailVerified: false,
    twoFactorEnabled: false
  });
const [stats, setStats] = useState({
  totalTasks: 0,
  completionRate: 0,
  currentStreak: 0
});
  const [openSection, setOpenSection] = useState("");

  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
const [cropImage, setCropImage] = useState(null);

const [crop, setCrop] = useState({ x: 0, y: 0 });

const [zoom, setZoom] = useState(1);

const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

const [showCropModal, setShowCropModal] = useState(false);
  const avatarStyles = [
    "personas",
    "adventurer",
    "adventurer-neutral",
    "avataaars",
    "big-ears",
    "bottts",
    "fun-emoji",
    "identicon",
    "initials",
    "lorelei",
    "micah",
    "miniavs",
    "notionists",
    "open-peeps",
    "pixel-art"
  ];

useEffect(() => {
  loadProfile();
  loadAnalytics();
}, []);
  const loadProfile = async () => {
    try {
      const response = await getProfile();
      setProfile(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadAnalytics = async () => {
  try {

    const [statsRes, streakRes] = await Promise.all([
      getStats(),
      getStreak()
    ]);

    setStats({
      totalTasks: statsRes.data.totalTasks,
      completionRate: statsRes.data.completionRate,
      currentStreak: streakRes.data.currentStreak
    });

  } catch (err) {
    console.log(err);
  }
};

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {

    try {

      const oldEmail = localStorage.getItem("userEmail");

      await updateProfile(profile);

      if (oldEmail !== profile.email) {

        alert("Email updated successfully. Please login again.");

        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");

        window.location.href = "/";

        return;
      }

      alert("Profile Updated Successfully");

      loadProfile();

    } catch (err) {

      alert(err.response?.data || "Unable to update profile");

    }

  };

 const handleImageUpload = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setCropImage(imageUrl);

    setShowCropModal(true);

    setShowPhotoMenu(false);

};
const onCropComplete = (croppedArea, croppedAreaPixels) => {

    setCroppedAreaPixels(croppedAreaPixels);

};

const saveCroppedImage = async () => {

    try {

        const croppedBlob = await getCroppedImg(
            cropImage,
            croppedAreaPixels
        );

        const formData = new FormData();

        formData.append("image", croppedBlob, "profile.jpg");

        const response = await uploadProfileImage(formData);

        setProfile((prev) => ({
            ...prev,
            profileImage: response.data
        }));

        setShowCropModal(false);

        setCropImage(null);

        loadProfile();

    } catch (err) {

        console.error(err);

        alert("Failed to crop image.");

    }

};
  const removePhoto = async () => {

    const updated = {
      ...profile,
      profileImage: ""
    };

    await updateProfile(updated);

    setProfile(updated);

    setShowPhotoMenu(false);

    loadProfile();

  };

 const logout = () => {
    localStorage.clear();
    window.location.replace("/");
};
  const toggleSection = (section) => {

    if (openSection === section) {

      setOpenSection("");

    } else {

      setOpenSection(section);

    }

  };
 return (
<>
<div className="profile-container">

    <div className="profile-header">

        <div
            className="avatar-wrapper"
            style={{ position: "relative" }}
        >

            <img
                className="avatar"
                src={
                    profile.profileImage
                        ? profile.profileImage
                        : `https://api.dicebear.com/9.x/${profile.avatarStyle || "personas"}/svg?seed=${profile.name}`
                }
                alt="Profile"
            />

            <button
                className="edit-avatar-btn"
                onClick={() => setShowPhotoMenu(!showPhotoMenu)}
            >
                <FaCamera />
            </button>

            {
                showPhotoMenu &&

                <div
                    className="photo-menu"
                    style={{
                        position: "absolute",
                        top: "110%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "230px",
                        background: "#fff",
                        borderRadius: "12px",
                        padding: "15px",
                        boxShadow: "0 8px 20px rgba(0,0,0,.2)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        zIndex: 999
                    }}
                >

                    <button
                        onClick={() =>
                            document
                                .getElementById("profileImageInput")
                                .click()
                        }
                    >
                        📷 Upload Custom Image
                    </button>

                    <button
                        onClick={() => {

                            setShowPhotoMenu(false);

                            setShowAvatarModal(true);

                        }}
                    >
                        🎭 Choose Avatar
                    </button>

                    <button
                        onClick={removePhoto}
                    >
                        🗑 Remove Photo
                    </button>

                    <button
                        onClick={() => setShowPhotoMenu(false)}
                    >
                        Close
                    </button>

                    <input
                        id="profileImageInput"
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                    />

                </div>

            }

        </div>

        <h2>{profile.name}</h2>

        <p>{profile.email}</p>

        <div className="profile-stats">

            <div>

               <h3>🔥 {stats.currentStreak}</h3>
<span>Day Streak</span>

            </div>

            <div>

                <h3>{stats.totalTasks}</h3>
<span>Tasks</span>

            </div>

            <div>

<h3>{Math.round(stats.completionRate)}%</h3>
<span>Productivity</span>

              

            </div>

        </div>

    </div>
        {/* Personal */}
        <div className="setting-title" onClick={() => toggleSection("personal")}>
            <span><FaUser /> Personal Information</span>
            {openSection === "personal" ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {openSection === "personal" && (
            <div className="setting-content">
                <label>Name</label>
                <input
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                />
                <button onClick={handleSave}>
                    <FaSave /> Save
                </button>
            </div>
        )}

        {/* Email */}
        <div className="setting-title" onClick={() => toggleSection("email")}>
            <span><FaEnvelope /> Email</span>
            {openSection === "email" ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {openSection === "email" && (
            <div className="setting-content">
                <label>Email</label>
                <input
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                />
                <button onClick={handleSave}>
                    <FaSave /> Save
                </button>
            </div>
        )}

        {/* Phone */}
        <div className="setting-title" onClick={() => toggleSection("phone")}>
            <span><FaPhone /> Phone Number</span>
            {openSection === "phone" ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {openSection === "phone" && (
            <div className="setting-content">
                <label>Phone</label>
                <input
                    name="phone"
                    value={profile.phone || ""}
                    onChange={handleChange}
                />
                <button onClick={handleSave}>
                    <FaSave /> Save
                </button>
            </div>
        )}

        {/* Address */}
        <div className="setting-title" onClick={() => toggleSection("address")}>
            <span><FaMapMarkerAlt /> Address</span>
            {openSection === "address" ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {openSection === "address" && (
            <div className="setting-content">
                <label>City</label>
                <input
                    name="city"
                    value={profile.city || ""}
                    onChange={handleChange}
                />

                <label>Country</label>
                <input
                    name="country"
                    value={profile.country || ""}
                    onChange={handleChange}
                />

                <button onClick={handleSave}>
                    <FaSave /> Save
                </button>
            </div>
        )}

        {/* Bio */}
        <div className="setting-title" onClick={() => toggleSection("bio")}>
            <span><FaInfoCircle /> Bio</span>
            {openSection === "bio" ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {openSection === "bio" && (
            <div className="setting-content">
                <textarea
                    rows="4"
                    name="bio"
                    value={profile.bio || ""}
                    onChange={handleChange}
                />
                <button onClick={handleSave}>
                    <FaSave /> Save
                </button>
            </div>
        )}

        {/* Security */}
        <div className="setting-title" onClick={() => toggleSection("security")}>
            <span><FaLock /> Security</span>
            {openSection === "security" ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {openSection === "security" && (
            <div className="setting-content">
                <p>Change your password and security settings.</p>

                <button
                    style={{
                        background: "#4f46e5",
                        color: "#fff"
                    }}
                >
                    Change Password
                </button>
            </div>
        )}

        {/* Account */}
        <div className="setting-title" onClick={() => toggleSection("account")}>
            <span><FaCalendarAlt /> Account Information</span>
            {openSection === "account" ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {openSection === "account" && (
            <div className="setting-content">

                <p>
                    <b>Joined :</b> {profile.createdAt || "Not Available"}
                </p>

                <p>
                    <b>Last Login :</b> {profile.lastLogin || "Not Available"}
                </p>

                <p>
                    <b>Email Verified :</b>{" "}
                    {profile.emailVerified ? "✅ Yes" : "❌ No"}
                </p>

                <p>
                    <b>Two Factor :</b>{" "}
                    {profile.twoFactorEnabled ? "✅ Enabled" : "❌ Disabled"}
                </p>

            </div>
        )}

        {/* Logout */}
        <div
            className="setting-title"
            onClick={logout}
            style={{ color: "red" }}
        >
            <span>
                <FaSignOutAlt /> Logout
            </span>
        </div>
   



</div>

{/* Avatar Modal */}
{showAvatarModal && (
    <div className="avatar-modal">

        <div className="avatar-box">

            <div className="avatar-header">

                <h2>Choose Avatar</h2>

                <FaTimes
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowAvatarModal(false)}
                />

            </div>

            <div className="avatar-grid">

                {avatarStyles.map((style) => (

                    <img
                        key={style}
                        src={`https://api.dicebear.com/9.x/${style}/svg?seed=${profile.name}`}
                        alt={style}
                        className={
                            profile.avatarStyle === style
                                ? "selected-avatar"
                                : ""
                        }
                        onClick={() =>
                            setProfile({
                                ...profile,
                                avatarStyle: style,
                                profileImage: ""
                            })
                        }
                    />

                ))}

            </div>

            <button
                className="save-avatar"
                onClick={async () => {

                    await updateProfile(profile);

                    loadProfile();

                    setShowAvatarModal(false);

                }}
            >
                Save Avatar
            </button>

        </div>

    </div>
)}

{/* Crop Modal */}
{showCropModal && (

    <div className="avatar-modal">

        <div
            className="avatar-box"
            style={{
                width: "420px",
                height: "520px"
            }}
        >

            <div className="avatar-header">

                <h2>Crop Image</h2>

                <FaTimes
                    style={{ cursor: "pointer" }}
                    onClick={() => {

                        setShowCropModal(false);

                        setCropImage(null);

                    }}
                />

            </div>
<div className="crop-container">

                <Cropper
                    image={cropImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />

            </div>

<div className="crop-footer">
                <p>Zoom</p>

                <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    style={{ width: "100%" }}
                />

            </div>

           <div className="crop-buttons">

                <button
                    onClick={() => {

                        setShowCropModal(false);

                        setCropImage(null);

                    }}
                >
                    Cancel
                </button>

                <button
                    className="save-avatar"
                    onClick={saveCroppedImage}
                >
                    Save
                </button>

            </div>

        </div>

    </div>

)}

</>
);

};

export default Profile;