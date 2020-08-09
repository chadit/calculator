import React from "react";
// import { Link } from 'react-router-dom'
import Layout from "../shared/layout";
import Calculator from "../components/Calculator/Calculator";
import "./styles/events.css";

const Home = (props) => {
  return (
    <Layout header="Calculator">
      <Calculator send={this.send} />
    </Layout>
  );
};

export default Home;
