import API from "../api";

export const getProfile = () => {
    return API.get("/auth/profile");
};

export const updateProfile = (data) => {
    return API.put("/auth/profile", data);
};

export const uploadProfileImage = (formData) => {

    return API.post(
        "/auth/upload-profile-image",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

};