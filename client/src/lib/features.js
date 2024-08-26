import moment from "moment";

const fileFormat = (url = "") => {
  const fileExt = url.split(".").pop();
  if (fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg")
    return "video";
  if (fileExt === "mp3" || fileExt === "wav") return "audio";
  else if (
    fileExt === "jpg" ||
    fileExt === "jpeg" ||
    fileExt === "png" ||
    fileExt === "gif"
  )
    return "image";
  return "file";
};
const transformImage = (url = "", width = 100) => {
  // url ke saath width bhi adjust kar skte hai
  const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);
  return newUrl;
};
const getLast7Days = () => {
  const currentDate = moment();
  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const dayName = dayDate.format("dddd");
    last7Days.unshift(dayName);
  }
  return last7Days;
};
const getOrSaveFromStorage = ({ key, value, get }) => {
  // if (get) {
  //   const storedValue = localStorage.getItem(key);
  //   console.log("storedValue", storedValue);
  //   if (storedValue) {
  //     try {
  //       return JSON.parse(storedValue);
  //     } catch (error) {
  //       console.error(`Error parsing ${key} from localStorage:`, error);
  //       return null;
  //     }
  //   }
  //   return null;
  // } else {
  //   localStorage.setItem(key, JSON.stringify(value));
  // }
  if (get)
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  else localStorage.setItem(key, JSON.stringify(value));
};

export { fileFormat, transformImage, getLast7Days, getOrSaveFromStorage };
