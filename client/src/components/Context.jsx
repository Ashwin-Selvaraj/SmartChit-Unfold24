import React, { useContext, createContext } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const { contract } = useContract("0x08bAA308336ED50F7C081bF2493B79FEB50E27a9");
  const { mutateAsync: initiateChit, isLoading, error } = useContractWrite(contract, 'createChit');
  const { mutateAsync: enrollInChit } = useContractWrite(contract, 'joinChit');
  const walletAddress = useAddress();
  const connectWallet = useMetamask();

  const [currentChit, setCurrentChit] = React.useState({});
  const [availableChits, setAvailableChits] = React.useState([]);
  const [chitParticipants, setChitParticipants] = React.useState([]);
  const [userChits, setUserChits] = React.useState([]);
  const [createdChits, setCreatedChits] = React.useState([]);

  const transferFunds = async () => {
    try {
      const tx = await sdk.wallet.transfer("{{wallet_address}}", 0.8);
    } catch (err) {
      console.error(err);
    }
  };

  const createNewChit = async (formData) => {
    const currentMonth = 5; 
    const currentYear = 2023;
    const initialDate = new Date(currentYear, currentMonth - 1);
    const monthInUnix = Math.floor(initialDate.getTime() / 1000);

    try {
      const transaction = await initiateChit({
        args: [
          formData.title,
          formData.desc,
          Math.floor(ethers.utils.formatUnits(ethers.utils.parseEther(formData.total), "gwei")),
          Math.floor(ethers.utils.formatUnits(ethers.utils.parseEther(formData.inst), "gwei")),
          monthInUnix,
          formData.participants,
          Date.parse(formData.deadline) / 1000,
        ],
      });
      window.location.replace('/');
    } catch (err) {
      console.error(err);
    }
  };

  const fetchParticipants = async (chitId) => {
    const idInBigNum = new BigNumber(chitId).toString(10);
    try {
      if (contract) {
        const participants = await contract.call('getParticipants', idInBigNum);
        setChitParticipants(participants);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const retrieveChitDetails = async (chitId) => {
    const idInBigNum = new BigNumber(chitId).toString(10);
    try {
      if (contract) {
        const chitData = await contract.call('chits', idInBigNum);
        const formattedChit = {
          title: chitData.title,
          desc: chitData.description,
          total: ethers.utils.formatEther(chitData.totalAmount.toString()),
          inst: ethers.utils.formatEther(chitData.installmentAmount.toString()),
          period: new Date(chitData.installmentPeriod * 1000).toString(),
          participants: chitData.numberOfParticipants.toString(),
          deadline: new Date(chitData.deadline * 1000).toString(),
        };
        setCurrentChit(formattedChit);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCreatedChits = async () => {
    try {
      if (contract) {
        const allChits = await contract.call('getChits');
        const formattedChits = allChits.map((data, index) => {
          const isCreator = walletAddress?.toLowerCase() === data.creator.toLowerCase();
          return {
            id: index,
            creator: data.creator,
            title: data.title,
            desc: data.description,
            total: ethers.utils.formatEther(data.totalAmount.toString()),
            inst: ethers.utils.formatEther(data.installmentAmount.toString()),
            period: new Date(data.installmentPeriod * 1000),
            participants: data.numberOfParticipants.toString(),
            deadline: new Date(data.deadline * 1000),
            isCreator,
          };
        });
        setCreatedChits(formattedChits);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserChits = async () => {
    try {
      if (contract) {
        const allChits = await contract.call('getChits');
        const formattedChits = allChits.filter((data) =>
          data.participants.some(
            (participant) => walletAddress?.toLowerCase() === participant.wallet.toLowerCase()
          )
        ).map((data, index) => ({
          id: index,
          creator: data.creator,
          title: data.title,
          desc: data.description,
          total: ethers.utils.formatEther(data.totalAmount.toString()),
          inst: ethers.utils.formatEther(data.installmentAmount.toString()),
          period: new Date(data.installmentPeriod * 1000),
          participants: data.numberOfParticipants.toString(),
          deadline: new Date(data.deadline * 1000),
        }));
        setUserChits(formattedChits);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const joinChit = async (chitId) => {
    try {
      await enrollInChit({ args: [chitId] });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <AppContext.Provider
      value={{
        connectWallet,
        walletAddress,
        createNewChit,
        joinChit,
        retrieveChitDetails,
        fetchParticipants,
        fetchCreatedChits,
        createdChits,
        fetchUserChits,
        userChits,
        transferFunds,
        chitParticipants,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
