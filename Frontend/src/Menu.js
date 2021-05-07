import React, { Component } from "react";


class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  // componentDidMount() {
  //   // axios.get este un promise. Deci functia then se executa doar dupa ce si doar daca functia get s-a executat cu succes
  //   axios.get("http://127.0.0.1:8000/users/")
  //     .then((response) => {
  //       console.log(response)
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })
  // }

  // componentDidMount() {
  //   axios.get("http://127.0.0.1:8000/users/")
  //     .then((response) => {
  //       const users = response.data;
  //       this.setState({ users });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  render() {
    return (
      <ul>
        steaua
      </ul>
    )
  }
}

export default Menu;
