import {Button, Divider, HStack, Input, Stack, Text} from "@chakra-ui/react";
import {useCallback, useEffect, useState} from "react";
import scriptTotalSupply from "../../flow/scripts/scriptTotalSupply";
import scriptBalanceOf from "../../flow/scripts/scriptBalanceOf";
import scriptIsInit from "../../flow/scripts/scriptIsInit";
import txInitPass from "../../flow/tx/txInitPass";
import txSetup from "../../flow/tx/txSetup";
import {useActiveFlowReact} from "../../hooks/flow";
import {ERROR, IDLE, IDLE_DELAY, PROCESSING, SUCCESS} from "../../constants/status";
import txDividePass from "../../flow/tx/txDividePass";

const FlowPortal = () => {
  const [myInit, setMyInit] = useState(false);
  const [supply, setSupply] = useState('-');
  const [balance, setBalance] = useState('-');
  const [divideId, setDivideId] = useState('');
  const [transferId, setTransferId] = useState('');
  const [transferStatue, setTransferStatue] = useState(IDLE);
  const [transferAddr, setTransferAddr] = useState('');
  const [initStatue, setInitStatue] = useState(IDLE);
  const [genesisStatue, setGenesisStatue] = useState(IDLE);
  const [divideStatue, setDivideStatue] = useState(IDLE);
  const {user} = useActiveFlowReact();

  const fetchTotalSupply = useCallback(async () => {
    const res = await scriptTotalSupply()
    if (res) {
      setSupply(res)
    }
  }, [])

  const fetchBalance = useCallback(async () => {
    if (user.addr && myInit) {
      try {
        const res = await scriptBalanceOf(user.addr)
        if (res) {
          setBalance(res)
        }
      } catch (e) {
        console.log('fetch balance error')
      }
    }
  }, [user.addr, myInit])

  const fetchIsInit = useCallback(async () => {
    if (user.addr) {
      try {
        const res = await scriptIsInit(user.addr)
        if (res) {
          setMyInit(res)
        }
      } catch (e) {
        console.log('scriptIsInit error')
      }
    }
  }, [user.addr])

  const initMyAccount = async () => {
    if (user.addr) {
      try {
        setInitStatue(PROCESSING)
        const res = await txSetup(user.addr)
        if (res?.status === 4) {
          setInitStatue(SUCCESS)
          setTimeout(() => {
            setInitStatue(IDLE)
          }, IDLE_DELAY)
        } else {
          setInitStatue(ERROR)
          setTimeout(() => {
            setInitStatue(IDLE)
          }, IDLE_DELAY)
        }
      } catch (e) {
        console.log('init error')
        setInitStatue(ERROR)
        setTimeout(() => {
          setInitStatue(IDLE)
        }, IDLE_DELAY)
      }
    }
  }

  const genesisWakandaPass = async () => {
    if (user.addr && myInit) {
      try {
        setGenesisStatue(PROCESSING)
        const res = await txInitPass(user.addr)
        if (res?.status === 4) {
          setGenesisStatue(SUCCESS)
          setTimeout(() => {
            setGenesisStatue(IDLE)
          }, IDLE_DELAY)
        } else {
          setGenesisStatue(ERROR)
          setTimeout(() => {
            setGenesisStatue(IDLE)
          }, IDLE_DELAY)
        }
      } catch (e) {
        console.log(e)
        setGenesisStatue(ERROR)
        setTimeout(() => {
          setGenesisStatue(IDLE)
        }, IDLE_DELAY)
      }
    }
  }

  const divideWakandaPass = async (id: number) => {
    if (user.addr && myInit) {
      setDivideStatue(PROCESSING)
      try {
        const res = await txDividePass(id)
        if (res?.status === 4) {
          setDivideStatue(SUCCESS)
          setTimeout(() => {
            setDivideStatue(IDLE)
            window.location.reload()
          }, IDLE_DELAY)
        } else {
          setDivideStatue(ERROR)
          setTimeout(() => {
            setDivideStatue(IDLE)
          }, IDLE_DELAY)
        }
      } catch (e) {
        console.log(e)
        setDivideStatue(ERROR)
        setTimeout(() => {
          setDivideStatue(IDLE)
        }, IDLE_DELAY)
      }
    }
  }

  useEffect(() => {
    fetchTotalSupply()
    fetchBalance()
    fetchIsInit()
  }, [fetchTotalSupply, fetchBalance, fetchIsInit])

  return (
    <Stack spacing={'24px'} align={"center"}>
      <Stack maxW={'container.md'} w={'full'} border={'1px'} alignItems={"center"} spacing={'24px'} py={'24px'}>
        <Text fontSize={'xl'} fontWeight={'bold'}>WakandaPass Portal on flow</Text>
        {user.addr && (
          <>
            <Divider/>
            {!myInit ? (
              <Button minW={'160px'} color={"black"} bg={"rgb(105,239,148)"} onClick={initMyAccount}
                      isLoading={initStatue === PROCESSING}>
                {initStatue === IDLE && ("Initialize Account First")}
                {initStatue === ERROR && ("Initialize Error")}
                {initStatue === SUCCESS && ("Initialize Success")}
              </Button>
            ) : (
              <Text fontSize={'md'} fontWeight={'500'}>
                My Balance: {balance} WP
              </Text>
            )}
          </>
        )}
        <Divider/>
        <Text fontSize={'md'} fontWeight={'500'}>
          Total Supply: {supply} WP
        </Text>
        {user.addr && (supply === '0') && (
          <>
            <Divider/>
            <Button minW={'160px'} bg={"black"} color={'white'} isLoading={genesisStatue === PROCESSING}
                    onClick={genesisWakandaPass}>
              {genesisStatue === IDLE && ("Genesis")}
              {genesisStatue === ERROR && ("Error")}
              {genesisStatue === SUCCESS && ("Success")}
            </Button>
          </>
        )}
        <Divider/>
        <HStack spacing={'12px'}>
          <Input borderRadius={0} placeholder={'token id'} onChange={(e) => setDivideId(e.target.value)}/>
          <Button
            bg={"black"}
            color={"white"}
            isLoading={divideStatue === PROCESSING}
            disabled={!divideId}
            onClick={() => divideWakandaPass(Number(divideId))}
            minW={'120px'}
          >
            {divideStatue === IDLE && ("Divide")}
            {divideStatue === ERROR && ("Error")}
            {divideStatue === SUCCESS && ("Success")}
          </Button>
        </HStack>
        <Divider/>
        <Stack spacing={'12px'}>
          <Input borderRadius={0} placeholder={'receipt address'}/>
          <HStack spacing={'12px'}>
            <Input borderRadius={0} placeholder={'token id'} />
            <Button
              bg={"black"}
              color={"white"}
              isLoading={transferStatue === PROCESSING}
              disabled={!transferId || !transferAddr}
              minW={'120px'}
            >
              Transfer
            </Button>
          </HStack>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default FlowPortal