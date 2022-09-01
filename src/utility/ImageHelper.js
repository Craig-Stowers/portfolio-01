//receives image source and returns 2d array of pixels [r,g,b,a] values


export const createImageData = (data, width, height ) => {

      const newData = [...data];
      const dataCopy = [...data];
      const pixels = [];
      while (dataCopy.length) pixels.push(dataCopy.splice(0, 4));
      const pixelsCopy = [...pixels];
      const arr2d = [];
      while (pixelsCopy.length) arr2d.push(pixelsCopy.splice(0, width));




      return {
            width,
            height,
            data:newData,
            pixels,
            arr2d,
            pixelFromPosition: (x, y) => {
               return arr2d[y][x];
            },
            positionFromIndex: (index) => {
               const x = index % width;
               const y = Math.floor(index / width);
               return [x, y];
            }

         }
}



export const ImageHelper = (image, cb) => {
   const img = new Image();
   const canvas = document.createElement("canvas");
   const context = canvas.getContext("2d");

   const onLoadImage = () => {
      img.removeEventListener("load", onLoadImage);

      const [width, height] = [img.width, img.height];
      canvas.width = width
      canvas.height = height      
      context.drawImage(img, 0, 0);
     
      const data = Array.from(context.getImageData(0, 0, width, height).data);
      cb(createImageData(data, width, height));
      
   };
   img.addEventListener("load", onLoadImage);
   img.src = image;
};
