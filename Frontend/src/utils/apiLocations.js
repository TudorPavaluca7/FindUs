import axios from "axios";

export const getCountries = () =>
{
    return axios
    .get(`http://localhost:8080/locations`)
    .then((response) => response.data)
    .catch((err) => console.log(err));

}

export const getCitiesByCountry = (country) =>
{
    return axios
    .get(`http://localhost:8080/cities/${country}`)
    .then((response) => response.data)
    .catch((err) => console.log(err));

}

