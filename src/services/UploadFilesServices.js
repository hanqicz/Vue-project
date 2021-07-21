import axios from "axios";

export const uploadFile = async (file, onUploadProgress) => {
  let formData = new FormData();
  formData.append("file", file);

  return axios.post(process.env.VUE_APP_API + "uploadFile.php", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress
  });
};

export default uploadFile;
