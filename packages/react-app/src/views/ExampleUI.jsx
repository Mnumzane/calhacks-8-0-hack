import { SyncOutlined } from "@ant-design/icons";
import { Select } from "antd";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { Address, Balance } from "../components";
import { useTokenList } from "eth-hooks/dapps/dex";

export default function ExampleUI({
  token1,
  token2,
  strategy,
  setStrategyEvents,
  setToken1Events,
  setToken2Events,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [newStrategy, setNewStrategy] = useState("loading...");
  const [selectedToken1, setSelectedToken1] = useState("Pick a token!");
  const [selectedToken2, setSelectedToken2] = useState("Pick a token!");
  const listOfTokens = useTokenList(
    "https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json",
  );

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>Liquidity Manager UI</h2>
        <h4>strategy: {strategy}</h4>
        <Divider />
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /* look how you call setStrategy on your contract: */
              setNewStrategy("fixed strategy");
              tx(writeContracts.LiquidityProvisionContract.setStrategy("fixed strategy"));
            }}
          >
            Set Strategy to &quot;fixed strategy&quot;
          </Button>
        </div>
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /* look how you call setStrategy on your contract: */
              setNewStrategy("uniform reset strategy");
              tx(writeContracts.LiquidityProvisionContract.setStrategy("uniform reset strategy"));
            }}
          >
            Set Strategy to &quot;uniform reset strategy&quot;
          </Button>
        </div>
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /* look how you call setStrategy on your contract: */
              setNewStrategy("proportional reset strategy");
              tx(writeContracts.LiquidityProvisionContract.setStrategy("proportional reset strategy"));
            }}
          >
            Set Strategy to &quot;proportional reset strategy&quot;
          </Button>
        </div>
        <Divider />
        Your Address:
        <Address address={address} ensProvider={mainnetProvider} fontSize={16} />
        <Divider />
        ENS Address Example:
        <Address
          address="0x34aA3F359A9D614239015126635CE7732c18fDF3" /* this will show as austingriffith.eth */
          ensProvider={mainnetProvider}
          fontSize={16}
        />
        <Divider />
        {/* use utils.formatEther to display a BigNumber: */}
        <h2>Your Balance: {yourLocalBalance ? utils.formatEther(yourLocalBalance) : "..."}</h2>
        <div>OR</div>
        <Balance address={address} provider={localProvider} price={price} />
        <Divider />
        Your Contract Address:
        <Address
          address={
            readContracts && readContracts.LiquidityProvisionContract
              ? readContracts.LiquidityProvisionContract.address
              : null
          }
          ensProvider={mainnetProvider}
          fontSize={16}
        />
        <Divider />
        <Select
          showSearch
          value={selectedToken1}
          onChange={async value => {
            if (value === selectedToken2) {
              return;
            }
            const result = tx(writeContracts.LiquidityProvisionContract.setToken1(value), update => {
              console.log("📡 Transaction Update:", update);
              if (update && (update.status === "confirmed" || update.status === 1)) {
                console.log(" 🍾 Transaction " + update.hash + " finished!");
                console.log(
                  " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                );
              }
            });
            console.log("awaiting metamask/web3 confirm result...", result);
            console.log(await result);
            return setSelectedToken1(value);
          }}
          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          optionFilterProp="children"
        >
          {listOfTokens.map(token => (
            <Option key={token.symbol} value={token.symbol}>
              {token.symbol}
            </Option>
          ))}
        </Select>
        <Divider />
        <Select
          showSearch
          value={selectedToken2}
          onChange={async value => {
            if (value === selectedToken1) {
              return;
            }
            const result = tx(writeContracts.LiquidityProvisionContract.setToken2(value), update => {
              console.log("📡 Transaction Update:", update);
              if (update && (update.status === "confirmed" || update.status === 1)) {
                console.log(" 🍾 Transaction " + update.hash + " finished!");
                console.log(
                  " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                );
              }
            });
            console.log("awaiting metamask/web3 confirm result...", result);
            console.log(await result);
            return setSelectedToken2(value);
          }}
          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          optionFilterProp="children"
        >
          {listOfTokens.map(token => (
            <Option key={token.symbol} value={token.symbol}>
              {token.symbol}
            </Option>
          ))}
        </Select>
        <Divider />
        
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /*
              you can also just craft a transaction and send it to the tx() transactor
              here we are sending value straight to the contract's address:
            */
              tx({
                to: writeContracts.LiquidityProvisionContract.address,
                value: utils.parseEther("0.001"),
              });
              /* this should throw an error about "no fallback nor receive function" until you add it */
            }}
          >
            Send Value
          </Button>
        </div>
      </div>

      {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in LiquidityProvisionContract.sol! )
      */}
      <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        <h2>Events:</h2>
        <List
          bordered
          dataSource={setStrategyEvents.concat(setToken1Events).concat(setToken2Events)}
          renderItem={item => {
            return (
              <List.Item key={item.blockNumber + "_" + item.args.sender + "_" + item.args.purpose}>
                <Address address={item.args[0]} ensProvider={mainnetProvider} fontSize={16} />
                {item.args[1]}
              </List.Item>
            );
          }}
        />
      </div>

      {/* <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 256 }}>
        <Card>
          Check out all the{" "}
          <a
            href="https://github.com/austintgriffith/scaffold-eth/tree/master/packages/react-app/src/components"
            target="_blank"
            rel="noopener noreferrer"
          >
            📦 components
          </a>
        </Card>

        <Card style={{ marginTop: 32 }}>
          <div>
            There are tons of generic components included from{" "}
            <a href="https://ant.design/components/overview/" target="_blank" rel="noopener noreferrer">
              🐜 ant.design
            </a>{" "}
            too!
          </div>

          <div style={{ marginTop: 8 }}>
            <Button type="primary">Buttons</Button>
          </div>

          <div style={{ marginTop: 8 }}>
            <SyncOutlined spin /> Icons
          </div>

          <div style={{ marginTop: 8 }}>
            Date Pickers?
            <div style={{ marginTop: 2 }}>
              <DatePicker onChange={() => {}} />
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <Slider range defaultValue={[20, 50]} onChange={() => {}} />
          </div>

          <div style={{ marginTop: 32 }}>
            <Switch defaultChecked onChange={() => {}} />
          </div>

          <div style={{ marginTop: 32 }}>
            <Progress percent={50} status="active" />
          </div>

          <div style={{ marginTop: 32 }}>
            <Spin />
          </div>
        </Card>
      </div> */}
    </div>
  );
}
