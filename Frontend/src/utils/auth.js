import axios from "axios";

export const isAuthenticated = () => {
    if (typeof window == "undefined") {
        return false;
    }

    if (localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"));
    } else {
        return false;
    }
};

export const register = user =>
{
    return axios
    .post(`http://localhost:8080/signup`, user)
    .then((response) => response.data)
    .catch((err) => err.response);  
}

export const signIn = user => {
    return fetch(`http://localhost:8080/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};




// export const signout = () => {
//     if (typeof window !== "undefined") localStorage.removeItem("jwt");
    
//     return fetch(`${process.env.REACT_APP_API_URL}/signout`, {
//         method: "GET"
//     })
//         .then(response => {
//             console.log("signout", response);
//             return response.json();
//         })
//         .catch(err => console.log(err));
// };
