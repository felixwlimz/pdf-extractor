export const encodePdfFiles = (files: File[]) => {
   const filePromises = files.map(file => {
     return new Promise<string>((resolve, reject) => {
       if (file && file.type === "application/pdf") {
         const fileReader = new FileReader();
         fileReader.onloadend = () => {
           const base64String = (fileReader.result as string).split(",")[1];
           resolve(base64String);
         };
         fileReader.onerror = () => {
           reject(new Error("Fail to read the file"));
         };
         fileReader.readAsDataURL(file);
       } else {
         reject(new Error("Invalid file type. Please upload a PDF file."));
       }
     });
   })

   return Promise.all(filePromises)
};

export const decodePdfFile = (base64 : string) => {
   const byteChars = atob(base64)
   const byteNumbers = Array.from(byteChars).map(char => char.charCodeAt(0) )
   const byteArr = new Uint8Array(byteNumbers)

   return new Blob([byteArr], { type : 'application/pdf'})
}