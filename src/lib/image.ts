const srcSetSizes = [140, 290, 480, 590, 990, 1200, 1980];

export const optimizeImage = (url: string) => {
  return url.replace("upload/", "upload/q_auto,f_auto/");
};

export const webp = (url: string) => {
  return url.replace("upload/", "upload/q_auto,f_webp/");
};

export const srcSet = (url: string) => {
  return srcSetSizes
    .map((size) => `${url.replace("upload/", `upload/w_${size}/`)} ${size}w`)
    .join(", ");
};
