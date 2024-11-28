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

// export const validateHiveUsername = (username, setError) => {
//   if (username.length > 16) {
//     setError("Username must not exceed 16 characters.");
//     return false;
//   }

//   const usernameParts = username.split(".");
//   for (const item of usernameParts) {
//     if (item.length < 3) {
//       setError("Each part of the username must be at least 3 characters long.");
//       return false;
//     }
//     if (!/^[\x00-\x7F]*$/.test(item[0])) {
//       setError("Each part of the username must start with an ASCII character.");
//       return false;
//     }
//     if (!/^([a-zA-Z0-9]|-|\.)+$/.test(item)) {
//       setError("Username can only contain letters, numbers, dashes, and dots.");
//       return false;
//     }
//     if (item.includes("--")) {
//       setError("Username parts cannot contain consecutive hyphens (--).");
//       return false;
//     }
//     if (/^\d/.test(item)) {
//       setError("Username parts cannot start with a number.");
//       return false;
//     }
//   }
//   // setError("")
//   // If no errors are found
//   return true;
// }

// export const validateHiveUsername = (username, setError) => {
//   if (username.length < 3 || username.length > 16) {
//     setError("Username must be between 3 and 16 characters long.");
//     return false;
//   }

//   if (/^\d/.test(username)) {
//     setError("Username cannot start with a number.");
//     return false;
//   }

//   if (/^\./.test(username) || /\.$/.test(username)) {
//     setError("Username cannot start or end with a dot (.).");
//     return false;
//   }

//   if (/\.{2,}/.test(username)) {
//     setError("Username cannot contain consecutive dots (..).");
//     return false;
//   }

//   // Regex to validate Hive username rules (dots, hyphens, and alphanumeric)
//   const regex = /^(?!.*--)(?!.*\.\.)(?!.*-\.)[a-z0-9]+([-\.][a-z0-9]+)*$/;

//   if (!regex.test(username)) {
//     setError(
//       "Username can only contain lowercase letters, numbers, single dots, and single hyphens."
//     );
//     return false;
//   }

//   // Clear the error message if validation passes
//   // setError("");
//   return true;
// };

export const validateHiveUsername = (username, setError) => {
  if (username.length < 3 || username.length > 16) {
    setError("Username must be between 3 and 16 characters long.");
    return false;
  }

  if (/^\d/.test(username)) {
    setError("Username cannot start with a number.");
    return false;
  }

  if (/^\./.test(username) || /\.$/.test(username)) {
    setError("Username cannot start or end with a dot (.).");
    return false;
  }

  if (/\.{2,}/.test(username)) {
    setError("Username cannot contain consecutive dots (..).");
    return false;
  }

  // Ensure all parts between dots have at least 3 characters
  const parts = username.split(".");
  for (const part of parts) {
    if (part.length < 3) {
      setError("Each part of the username (separated by dots) must be at least 3 characters long.");
      return false;
    }
  }

  // Regex to validate Hive username rules (dots, hyphens, and alphanumeric)
  const regex = /^(?!.*--)(?!.*\.\.)(?!.*-\.)[a-z0-9]+([-\.][a-z0-9]+)*$/;

  if (!regex.test(username)) {
    setError(
      "Username can only contain lowercase letters, numbers, single dots, and single hyphens."
    );
    return false;
  }

  return true;
};
