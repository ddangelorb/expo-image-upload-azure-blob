import axios from "axios";

const apiA = axios.create({
    baseURL: "https://wpdstorageaccounths.blob.core.windows.net/wpdblob",
});

export default apiA;