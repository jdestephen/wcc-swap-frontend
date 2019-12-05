import React from "react";
import { Button, Heading } from "rimble-ui";
import contentStrings from "../constants/Localization";
import colors from "../theme/colors";
import "../App.scss";
import useAxios from "axios-hooks";
import drip from "../assets/drip.png";
import pour from "../assets/pour.png";

export default function CoffeeCard({ totalSupply, coffeeHash }) {
  //let coffeeInfo
  const [{ data, loading, error }, refetch] = useAxios(
    `https://ipfs.infura.io/ipfs/${coffeeHash}`
  );

  if (loading) return <Heading.h3>Loading...</Heading.h3>;
  if (error) return <Heading.h3>Error...</Heading.h3>;

  return (
    <div className="coffee-card">
      <div className="coffee-image"></div>

      <div className="product-title">
        <Heading.h4 color={colors.brown.base} textAlign="left">
          Honduran {data.coffee.Variety}
        </Heading.h4>
        <Heading.h6 textAlign="left">{data.coffee.notes}</Heading.h6>
        <Heading.h2 color={colors.brown.base} textAlign="left">
          Premium Specialty Coffee
        </Heading.h2>
        <p>
          We are using as colateral this single origin coffee best in terms of
          flavor in quality with Wrapped DAI Saving rates as collateral to mint
          a wrapped coffee coin token used to redeem a premium bag of this
          coffee roasted.
        </p>
        <p>
          Read all the details <a href="#"> over here</a>
        </p>
      </div>
      <div className="product-details">
        <ul>
          <li>
            <Heading.h5>Redem Details</Heading.h5>28 kg, {data.coffee.Process},
            Medium roast
          </li>
          {/* <li>
            <Heading.h5>Process</Heading.h5> {data.coffee.Process}
          </li> */}
          <li>
            <Heading.h5>Specialty Coffee Score</Heading.h5> {data.coffee.score}
            /100
          </li>
          <li>
            <Heading.h5>Best for</Heading.h5>
            <img src={pour} alt="pour over coffee" className="pour" />
            <img src={drip} alt="drip machine" className="drip" />
          </li>
        </ul>
        <Heading.h3 color={colors.brown.base}>0.067 ETH / $10 </Heading.h3>
        <Heading.h5 color={colors.brown.text}>
          80/{totalSupply} {contentStrings.available}
        </Heading.h5>
        <div className="button-wrapper">
          <Button variant="primary" className="buy">
            {contentStrings.buy}
          </Button>
          <Button variant="custom" className="trade">
            Swap
          </Button>
        </div>
      </div>
    </div>
  );
}
