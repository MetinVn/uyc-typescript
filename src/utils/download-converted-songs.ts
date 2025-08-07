import axios from "axios";

export const downloadFile = async (url: string, fileName: string) => {
  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "blob",
      maxRedirects: 20,
    });

    const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: "audio/mpeg" }));
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(fileURL);
    return true;
  } catch (error) {
    console.error("Failed to download the file:", error);
    return false;
  }
};
