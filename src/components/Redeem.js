import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'
import {  utils } from "ethers";
import { Link } from 'react-router-dom'

import { useAppContext } from '../context'
import { 
    Box, 
    Button, 
    Card, 
    Field, 
    Flex, 
    Heading, 
    Input,
    Modal, 
    Text 
} from "rimble-ui";
import RedeemForm from './RedeemForm'
import { amountFormatter } from '../factory'

import IncrementToken from './IncrementToken'
import contentStrings from "../constants/Localization";
import colors from "../theme/colors";
import { isValidEmail } from "../utils/utils"
import Confirmed from './Confirmed';
//import Confetti from 'react-dom-confetti'

const config = {
  angle: 90,
  spread: 76,
  startVelocity: 51,
  elementCount: 154,
  dragFriction: 0.1,
  duration: 7000,
  stagger: 0,
  width: '10px',
  height: '10px',
  colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a']
}

export function Controls({ theme, type }) {
  return (
    <FrameControls>
      <Unicorn theme={theme}>
        <span role="img" aria-label="unicorn">
          🦄
        </span>{' '}
        Pay{' '}
        <span style={{ color: '#737373' }}>
          {' '}
          {type === 'confirm' ? ' / Order Details' : type === 'shipping' ? ' / Shipping Details' : ''}
        </span>
      </Unicorn>      
    </FrameControls>
  )
}

export default function Redeem({
  burn,
  balanceCAFE = 0,
  ready,
  unlock,
  setCurrentTransaction,
  setShowConnect,
  closeCheckout
}) {
  const { library, account, setConnector } = useWeb3Context()
  const [state] = useAppContext()
  const [show, setShow] = useState(false);

  const [numberBurned, setNumberBurned] = useState()
  const [hasPickedAmount, setHasPickedAmount] = useState(false)
  const [email, setEmail] = useState('')
  const [emailBorderColor, setEmailBorderColor] = useState('text')  

  const [hasConfirmedAddress, setHasConfirmedAddress] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')
  const [lastTransactionHash, setLastTransactionHash] = useState('')

  const [hasBurnt, setHasBurnt] = useState(false)
  const [userAddress, setUserAddress] = useState('')

  const pending = !!transactionHash
  const openModal = () => setShow(true);
  const closeModal = () => {
        setShow(false);
        setNumberBurned(0);
        setHasPickedAmount(false);
        setEmail('');
    };
  
  
  useEffect(() => {
    if (transactionHash) {
      library.waitForTransaction(transactionHash).then(() => {
        setLastTransactionHash(transactionHash)
        setTransactionHash('')
        setHasBurnt(true)
      })
    }
  })

  function handleEmailChange(event){
    if (isValidEmail(event.target.value)){
        setEmail(event.target.value);
        setEmailBorderColor('text');        
    }
    else{
        setEmail('');
        setEmailBorderColor(colors.red);                
    }
  }

  function link(hash) {
    return `https://etherscan.io/tx/${hash}`
  }

  function renderContent() {

    return (
        <Button
          variant="primary"
          disabled={false}
          text={account === null ? 'Connect Wallet' : 'Redeem CAFE'}
          type={'cta'}
          onClick={() => {
            setConnector('Injected', { suppressAndThrowErrors: true }).catch(() => {
              setShowConnect(true)
            })
          }}
        />
    )    
  }

  function redeemCAFEAmount(){
      return (
        <Flex px="6%" mt="6%" flexDirection="column">
            <Heading.h3 variant="primary" mb="3%">
              Redeem CAFE Tokens
            </Heading.h3>  
            <Box width={1}>
                <Field label="Choose the CAFE amount to redeem" width={"100%"} mb="2%">
                <IncrementToken 
                    initialValue={1} 
                    max={utils.formatEther(balanceCAFE)} 
                />
                </Field>
            </Box>
            <Box width={1}>
                <Text.span color="#b4600b" ml="" className="available">
                {balanceCAFE 
                    ? `You own ${utils.formatEther(balanceCAFE)} CAFE`
                    : "You own 0 CAFE "}
                </Text.span>
            </Box>
            <Box width={1}>
                <Field label="Enter email address" width={"100%"} mb="2%">
                    <Input 
                        type="email" 
                        required={true} 
                        placeholder="your@email.com" 
                        width={"100%"} 
                        color={emailBorderColor}  
                        onChange={handleEmailChange} 
                    />        
                </Field>    
            </Box>   
        </Flex>        
      )
  }

  function confirmRedeemCAFE(){
    return (
    <Flex px="6%" mt="6%" flexDirection="column">
        <Box width={1}>
            <Heading.h5>
                {`Are you sure you want to redeem ${numberBurned} CAFE`}
            </Heading.h5>                
        </Box>
        <Box width={1}>
            <Heading.h6>
                {`Information will be sent to ${email} `}
            </Heading.h6>
        </Box>
    </Flex>  
    )
  }

  function burnCAFE(){
    return (
        <Flex px="6%" mt="6%" flexDirection="column">
            <Heading.h5>
                {pending 
                    ? 'Transaction is in progess'
                    : `Transaction hash ${transactionHash} `
                }
            </Heading.h5>
        </Flex>
    )
  }

  function handleClick(){
      if (!hasPickedAmount && isValidEmail(email)){
        setNumberBurned(state.count);
        setHasPickedAmount(true);
      }
      else if (!hasBurnt) {
        console.log('Entra qui: ' + numberBurned) ; 
        burn(numberBurned.toString())
            .then(response => {
                setTransactionHash(response.hash)
            })
            .catch(error => {
                console.error(error)                
            })
      }
      else{

      }
  }

  function notCAFEToRedeem(){
      return (
        <Box width={1}>
            <Heading.h5>Not CAFE to redeem</Heading.h5>
        </Box>  
      )
  }

  return (
    <>
      <Button
        variant="primary"
        disabled={balanceCAFE === 0}
        text={'Next'}
        type={'cta'}
        onClick={openModal}
        >
            Redeem
      </Button>    

      <Modal isOpen={show} >
        <Card
            width={"420px"}
            p={0}
            borderRadius={7}
            borderColor={colors.brown.light}
            boxShadow="1"
            className="coffeeModal"
        >          
          {!hasPickedAmount || !isValidEmail(email)
            ? redeemCAFEAmount()
            : ( !hasBurnt
                ? confirmRedeemCAFE()    
                : burnCAFE()
              )
          }            
          
          <Flex px={"6%"} py={2} mt="3%" mb="10px" justifyContent={"flex-end"}>
            <Button.Outline
              size=""
              variant="danger"
              onClick={closeModal}
              width={1 / 2}
            >
              {contentStrings.cancel}
            </Button.Outline>
            <Button
              variant="primary"
              size=""
              ml={3}
              width={1 / 2} 
              onClick={handleClick}
            >
             {!hasPickedAmount || !isValidEmail(email)   
                ? `Redeem`
                : ( !hasBurnt 
                    ? `Confirm`
                    : 'OK' )
             }  
            </Button>
          </Flex>        
        </Card>
      </Modal>

    </>
  )
}

const FrameControls = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`

const Unicorn = styled.p`
  color: ${props => (props.theme === 'dark' ? '#000' : '#fff')};
  font-weight: 600;
  margin: 0px;
  font-size: 16px;
`

const Close = styled.img`
  width: 16px;
  color: #fff;
  font-weight: 600;
  margin: 0px;
  /* margin-right: 2px;
  margin-top: -7px; */
  height: 16px;
  font-size: 16px;
  padding: 4px;
  cursor: pointer;
`

const InfoFrame = styled.div`
  opacity: ${props => (props.pending ? 0.6 : 1)};
  width: 100%;
  font-size: 20px;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-top: ${props => (props.hasPickedAmount ? '8px' : '0')};
  justify-content: ${props => (props.hasPickedAmount ? 'flex-start' : 'space-between')};
  align-items: flex-end;
  padding: ${props => (props.hasPickedAmount ? '1rem 0 1rem 0' : ' 0')};
  /* padding: 1rem 0 1rem 0; */
  margin-top: 12px;
  /* margin-bottom: 8px; */
  /* margin-right: ${props => (props.hasPickedAmount ? '8px' : '0px')}; */
  border-radius: 6px;
  /* background-color: ${props => (props.hasPickedAmount ? '#000' : 'none')}; */
  border: ${props => (props.hasPickedAmount ? '1px solid #3d3d3d' : 'none')};
`

const Owned = styled.div`
  font-weight: 700;
  color: #efe7e4;
  font-size: 24px;
  margin-bottom: 12px;
  margin: 0px;
  white-space: pre-wrap;
`

const Bonus = styled.div`
  font-weight: 500;
  font-size: 12px;
  padding: 4px;
  background-color: ${props => props.theme.uniswapPink};
  border-radius: 4px;
  position: absolute;
  top: 200px;
  left: 32px;
`

const ImgStyle = styled.img`
  width: ${props => (props.hasPickedAmount ? (props.hasBurnt ? '300px' : '120px') : '300px')};
  padding: ${props => (props.hasPickedAmount ? (props.hasBurnt ? '0px' : '0 1rem 0 0') : '2rem 0 2rem 0')};
  box-sizing: border-box;
`
const SockCount = styled.span`
  color: #aeaeae;
  font-weight: 400;
  font-size: 14px;
  width: 100%;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.uniswapPink};
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`

const Back = styled.div`
  color: #aeaeae;
  font-weight: 400;
  margin: 0px;
  margin: -4px 0 16px 0px !important;
  font-size: 14px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* color: ${props => props.theme.uniswapPink}; */
  text-align: center;
  span {
    cursor: pointer;
  }
  span:hover {
    text-decoration: underline;
  }
`

const CheckoutPrompt = styled.p`
  font-weight: 500;
  font-size: 14px;
  margin: 24px 16px 0 16px !important;
  text-align: left;
  color: '#000';
  font-style: italic;
  width: 100%;
`

const RedeemFrame = styled(RedeemForm)`
  width: 100%;
`

const EtherscanLink = styled.a`
  text-decoration: none;
  color: ${props => props.theme.uniswapPink};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
`