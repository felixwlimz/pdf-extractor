export const encodeFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const decodeBase64ToFile = (base64: string, fileName: string): File => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
};

export const loadStoredFiles = () => {
   try {
     const storedData = localStorage.getItem("pdfFiles");
     const storedFiles = storedData ? JSON.parse(storedData) : [];

     if (Array.isArray(storedFiles)) {
       const loadedFiles = storedFiles.map((item) =>
         decodeBase64ToFile(item.base64, item.name)
       );
       return loadedFiles;
     } else {
       console.warn("Stored data is not an array. Clearing invalid data.");
       localStorage.removeItem("pdfFiles");
       return [];
     }
   } catch (error) {
     console.error("Error loading files from localStorage:", error);
     return [];
   }
 };

