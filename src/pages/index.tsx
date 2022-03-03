import type { NextPage } from "next";
import Head from "next/head";
import { getPlans } from "./api/plans";
import { getCarriers, insertCarrierPlan } from "./api/carriers";
import { generateRecording } from "./api/polly";
import { useState, useEffect } from "react";

const Home: NextPage = () => {
  const [carrierList, setCarrierList] = useState([]);
  const [planList, setPlanList] = useState([]);
  const [carrier, setCarrier] = useState(1);
  const [plan, setPlan] = useState(1);
  const [disclosure, setDisclosure] = useState('');
  const [showAudio, setShowAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState('https://recording-disclosures-bucket.s3.amazonaws.com/846991d7-059b-4fd4-a86a-0f3d7999c5bd.mp3?AWSAccessKeyId=ASIAWMOYVMXIUQYK5FRO&Expires=1646250869&Signature=JOOn%2BXPKn9y2rwzqHGEo4puopns%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIB3K%2F%2FV35SN4WEpRvG03R%2B1RXDalIwrwsoekzqbE6qfdAiArso5W1No2L3RE7RztcPC8KQDbfngFysaDqE%2FzU2y7SyqqAgg1EAIaDDQzOTA3NzkyMjI1NyIM9Pf8%2FG%2BDO%2BkiCg3hKocCdycNC%2Fqupkuod6jRUSXgh5kCmdTLXAd7U2VUvqg8aVaLKo%2BL2vzVYh8TLwh7JkHyqFX4Bi4aeOCOzfvq3298858g%2FTKGHvAJw9m5r39sg7Hed6BFwpXEPrBNYv1nxsmseesneJrPSMpI9iZppcdDiHD2mfNoW84GT5RuNXHMwURqXpdRti%2BIpZVGKOz%2FLbKDZJZGAK%2B5PnJhNz4ZR7ewzKoNZmeFPEHcHbPukpxrhkrdkpMyX2RFo7f48NYoNYV2qWAPVC6rL5dGIQ4WwPuPV%2B7O%2BkY0311e6mcbn%2Bn117QedVAK3NJdT97qE4k3A1bPon%2FCub7skI%2B%2Fnp9znULIW89%2BoUiotN8w8I%2F%2FkAY6mwGBrq0S6UsCCbFB2cuzEyDMnj4A2ft3ML9VunV0VOznMmQck9MWxcmu4DKBIfyIz9SQqfUpv2s0P6i4Ofi2TbAlS98VUcdgHOa4HgkS9PPK6qLJ92HSKwGeYzMDyZ9vmqOQWk39xZVM07f7sob%2BMANQ1FDLzqJdDYOX9md3FDVC666Hig5J%2BXTX7wJWqfvF51u5ZF0JXhzA4myHFg%3D%3D')

  const getCarrierList = async () => {
    const response = await getCarriers();
    setCarrierList(response);
  };

  const getPlanList = async () => {
    const response = await getPlans();
    setPlanList(response);
    setDisclosure(response[0].sectionOne)
  };

  useEffect(() => {
    setTimeout(() => {
      getCarrierList();
      getPlanList();
    }, 100);
  }, []);

  const handleChangeCarrier = (e) => {
    setCarrier(e.target.value);
  };

  const handleChangePlan = (e) => {
    setPlan(e.target.value);
    //setDisclosure(plan.sectionOne)
  };

  const generateAudio = async () => {
    setShowAudio(true)
    // const payload = {
    //   "text": disclosure,
    //   "voice": "Joey"
    // }
    // const response = await generateRecording(payload);
    // console.log(response)
  };
  

  return (
    <div className="w-full h-screen pt-10 pr-5 pl-5">
      <Head>
        <title>Recording Disclosures</title>
      </Head>
      <div className="pb-10 justify-items-center content-center">
        <label className="font-bold text-4xl text-green-500">
          Recording Disclosures
        </label>
      </div>
      {/* <form> */}
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Carrier
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-state"
              value={carrier}
              onChange={(e) => handleChangeCarrier(e)}
            >
              {carrierList.map((option) => (
                <option key={option.carrierId} value={option.carrierId}>
                  {option.carrierName}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Plan
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-state"
              value={plan}
              onChange={(e) => handleChangePlan(e)}
            >
              {planList.map((option) => (
                <option key={option.planId} value={option.planId}>
                  {option.planName}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Section Sample Transcript
          </label>
          <textarea
            rows={8}
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-password"
            value={disclosure}
            onChange={(e) => setDisclosure(e.target.value)}
          />
          <p className="text-gray-600 text-xs italic">
            Using only section one of any sample for this presentation
          </p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6 pl-3">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => generateAudio()}
        >
          Generate Recording
        </button>
        {showAudio && (<audio id="audioplyr" controls>
          <source id="audioSource" type="audio/mp3" src={audioUrl}></source>
        </audio>)}
      </div>
      {/* </form> */}
    </div>
  );
};

export default Home;
