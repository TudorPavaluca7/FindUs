import React, { Component } from "react";
import { Form } from "react-bootstrap";

class FormGroup extends Component {
  render() {
    return (
      <Form.Group controlId={this.props.controlId}>
        <Form.Label>{this.props.label}</Form.Label>
        <Form.Control
          type={this.props.type}
          placeholder={this.props.placeholder}
        />
      </Form.Group>
    );
  }
}

export default FormGroup;
