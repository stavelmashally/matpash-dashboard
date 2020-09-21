import React from "react";
import { Navbar, Nav } from 'react-bootstrap';
import './CreateChart.css';


const items = [
  { label: "צור טבלה", link: "#chart" },
  { label: "ניהול משתמש", link: "#Manage" },
  { label: "סטטיסטיקה", link: "#Statistics" },
];

function NavBar() {
  return (
      <Navbar bg="primary" variant={"dark"} expand="lg" className="justify-content-lg-end">
        <Navbar.Brand href="#home">מתפ״ש</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto justify-content-lg-end">
            <Nav.Link href="/Statistics">סטטיסטיקה</Nav.Link>
            <Nav.Link href="/CreateChart">צור טבלה</Nav.Link>
            <Nav.Link href="/">עבור לדשבורד</Nav.Link>
          </Nav>

        </Navbar.Collapse>
      </Navbar>
  );
}

export default NavBar;
