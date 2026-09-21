import { API } from "../../types/api";


/**
 * @description generic fetch function sending HTTP GET
 * 
 * @param url string to fetch from
 * @param onSuccess function called during successful results
 * @param setLoading setLoading state function from page
 * @param setDialog setDialog state function from containing page
 */
export function Fetch(url: string, onSuccess: any, setLoading: any, setDialog: any = () => {}) : void {
    API.get(url)
        .then(res => onSuccess(res.data))
        .catch(err =>{ 
            console.log(`${url} fetch error:`, err.message);
            setDialog({
                open: true, 
                message:`Fetching URL: ${url} - ${err.message}`
            });
        })
        .finally(() => setLoading(false));
} // end Fetch