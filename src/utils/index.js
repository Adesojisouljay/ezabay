import { toast } from "react-toastify";
import { jwtDecode } from 'jwt-decode';
import axios from "axios"


export const getPrice = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'usd',
        vs_currencies: 'ngn'
      }
    });
    
    const nairaToUsdRate = response.data.usd.ngn;
    return nairaToUsdRate
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
  }
};

export const usdPrice = await getPrice();

export const formatNumbers = (n)=> {
    if(n) return n?.toFixed(3)
    };

export const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export const formatString = (str) => {
  if (str.length <= 8) {
    return str;
  }

  const firstPart = str.slice(0, 4);
  const lastPart = str.slice(-4);

  return `${firstPart}...${lastPart}`;
}

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => toast.success("Copied to clipboard!", {
      style: {
        backgroundColor: 'rgba(229, 229, 229, 0.1)',
        color: '#fff',
        fontSize: '16px',
        marginTop: "60px"
      },
    }))
    .catch((error) => toast.error("Failed to copy text", {
      style: {
        backgroundColor: 'rgba(229, 229, 229, 0.1)',
        color: '#fff',
        fontSize: '16px',
        marginTop: "60px"
      },
    }));
};

export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const getFirstItem = string => Number(string?.split(" ")[0])

export const formatNumberWithCommas = (num) => {

  return Number(num).toLocaleString("en-US", {
    maximumFractionDigits: 3,
    useGrouping: true,
  });
};