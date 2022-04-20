// @ts-nocheck
/* eslint-disable react/jsx-key */
import type { NextPage } from "next";
import Head from "next/head";
import { getPlans } from "./api/plans";
import { getCarriers, insertCarrierPlan } from "./api/carriers";
import { generateRecording } from "./api/polly";
import { useState, useEffect } from "react";
import { BiCopy } from "react-icons/bi";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { POLLY_URL } from "../utils/constants";

const Home: NextPage = () => {
  const [carrierList, setCarrierList] = useState([]);
  const [planList, setPlanList] = useState([]);
  const [carrier, setCarrier] = useState(1);
  const [carrierName, setCarrierName] = useState("Humana");
  const [plan, setPlan] = useState(0);
  const [sample, setSample] = useState("sectionOne");
  const [disclosure, setDisclosure] = useState("");
  const [showAudio, setShowAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [generateAll, setGenerateAll] = useState(false);
  const [allRecordingsList, setAllRecordingsList] = useState([]);
  const [showTextArea, setShowTextArea] = useState(true);
  const [showBackdrop, setShowBackdrop] = useState(false)

  const getCarrierList = async () => {
    const response = await getCarriers();
    setCarrierList(response);
  };

  const getPlanList = async () => {
    const response = await getPlans();
    setPlanList(response);
    //setDisclosure(response[2].sectionTwo)
  };

  useEffect(() => {
    setTimeout(() => {
      getCarrierList();
      getPlanList();
    }, 100);
  }, []);

  const handleChangeCarrier = (e) => {
    setCarrier(e.target.value);
    const text = disclosure.replace(
      carrierName,
      carrierList[e.target.value - 1].carrierName
    );
    setCarrierName(carrierList[e.target.value - 1].carrierName);
    setDisclosure(text);
  };

  ///Descomentar esto cuando sea el momento

  const handleChangePlan = (e) => {
    setPlan(e.target.value);
    let text; //= planList[e.target.value - 1].sectionOne.replace("{{carrierName}}", carrierList[carrier - 1].carrierName);
    switch (sample) {
      case "sectionOne":
        text = planList[e.target.value - 1].sectionOne.replaceAll(
          "{{carrierName}}",
          carrierList[carrier - 1].carrierName
        );
        break;
      case "sectionTwo":
        text = planList[e.target.value - 1].sectionTwo.replaceAll(
          "{{carrierName}}",
          carrierList[carrier - 1].carrierName
        );
        break;
      case "sectionThree":
        text = planList[e.target.value - 1].sectionThree.replaceAll(
          "{{carrierName}}",
          carrierList[carrier - 1].carrierName
        );
        break;
    }
    setDisclosure(text);
  };

  const handleChangeSample = (e) => {
    setSample(e.target.value);
    let text;
    switch (e.target.value) {
      case "sectionOne":
        text = planList[plan - 1].sectionOne.replaceAll(
          "{{carrierName}}",
          carrierList[carrier - 1].carrierName
        );
        break;
      case "sectionTwo":
        text = planList[plan - 1].sectionTwo.replaceAll(
          "{{carrierName}}",
          carrierList[carrier - 1].carrierName
        );
        break;
      case "sectionThree":
        text = planList[plan - 1].sectionThree.replaceAll(
          "{{carrierName}}",
          carrierList[carrier - 1].carrierName
        );
        break;
    }
    setDisclosure(text);
  };

  const handleGenerate = () => {
    if (generateAll) {
      generateAllRecordings();
      setShowTextArea(false);
      //setShowBackdrop(true)
    } else {
      generateAudio();
      setShowTextArea(true);
    }
  };

  const generateAudio = async () => {
    setShowAudio(false);
    const payload = {
      text: disclosure,
      voice: "Joey",
    };
    const response = await generateRecording(payload);
    setAudioUrl(response.url);
    setShowAudio(true);
  };

  const generateAllRecordings = () => {
    var list = [];
    let i = 0;
    carrierList.forEach((carrier) => {
      planList.forEach(async (plan) => {
        list.push({
          id: i++,
          carrierName: carrier.carrierName,
          planName: plan.planName,
          sectionOne: await generateRecordingBatch(
            plan.sectionOne.replace("{{carrierName}}", carrier.carrierName)
          ),
          sectionTwo: await generateRecordingBatch(
            plan.sectionTwo.replace("{{carrierName}}", carrier.carrierName)
          ),
          sectionThree: await generateRecordingBatch(
            plan.sectionThree.replace("{{carrierName}}", carrier.carrierName)
          ),
        });
      });
    });
    setAllRecordingsList([...allRecordingsList, ...list])
    //Array.prototype.push.apply(allRecordingsList, list)
  };

  const generateRecordingBatch = async (text): Promise<string> => {
    const payload = {
      text: text,
      voice: "Joey",
    };
    const rawResponse = await fetch(`${POLLY_URL}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const content = await rawResponse.json();
    //setShowBackdrop(false)
    return content.url;
  };

  return (
    <>
      <div className="w-full h-screen pt-10 pr-5 pl-5">
        <Head>
          <title>Recording Disclosures</title>
        </Head>
        <div className="pb-10 justify-items-center content-center">
          <label className="font-bold text-4xl text-green-500">
            Recording Disclosures MVP
          </label>
        </div>
        {/* <form> */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
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
                <option key={0} value="0" disabled>
                  --Select--
                </option>
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
          <div className="w-full md:w-1/4 px-3">
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
                <option key={0} value="0" disabled>
                  --Select--
                </option>
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
          <div className="w-full md:w-1/4 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Sample / Template
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-state"
                value={sample}
                onChange={(e) => handleChangeSample(e)}
              >
                <option key={0} value="0" disabled>
                  --Select--
                </option>
                <option key={1} value="sectionOne">
                  Section 1
                </option>
                <option key={2} value="sectionTwo">
                  Section 2
                </option>
                <option key={3} value="sectionThree">
                  Section 3
                </option>
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
          <div className="w-full md:w-1/4 px-3 pt-8">
            <label className="text-gray-500 font-bold">
              <input
                className="mr-2 leading-tight"
                type="checkbox"
                defaultChecked={generateAll}
                onChange={() => setGenerateAll(!generateAll)}
              />
              <span className="text-sm">
                Generate recording for all disclosures
              </span>
            </label>
          </div>
        </div>
        {showTextArea && (
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
        )}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="px-3 pt-8">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleGenerate()}
            >
              Generate Recording
            </button>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          {showAudio && (
            <>
              <div className="pt-4 pl-4">
                <audio id="audioplyr" controls>
                  <source
                    id="audioSource"
                    type="audio/mp3"
                    src={audioUrl}
                  ></source>
                </audio>
              </div>
              <div className="pt-8 pl-4">
                <a
                  href={audioUrl}
                  target="_blank"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  rel="noreferrer"
                  download
                >
                  Download
                </a>
              </div>
              <div className="pt-4 pl-4">
                <input
                  className="border-blue-500 border-solid border rounded py-2 px-4"
                  type="text"
                  value={audioUrl}
                  disabled
                />
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                  onClick={() => navigator.clipboard.writeText(audioUrl)}
                >
                  <BiCopy />
                </button>
              </div>
            </>
          )}
        </div>
        {!showTextArea && (
          <div className="flex flex-wrap -mx-3 mb-6 pb-8">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="recordings">
                <TableHead>
                  <TableRow
                    style={{ backgroundColor: "black", color: "white" }}
                  >
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      Carrier
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      Plan Type
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      Section One Record
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      Section Two Record
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      Section Three Record
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allRecordingsList.map((row) => (
                    <TableRow>
                      <TableCell style={{ textAlign: "center" }}>
                        {row.carrierName}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {row.planName}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        <a
                          href={row.sectionOne}
                          target="_blank"
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          rel="noreferrer"
                          download
                        >
                          Download MP3 S1
                        </a>
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        <a
                          href={row.sectionTwo}
                          target="_blank"
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          rel="noreferrer"
                          download
                        >
                          Download MP3 S2
                        </a>
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        <a
                          href={row.sectionThree}
                          target="_blank"
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          rel="noreferrer"
                          download
                        >
                          Download MP3 S3
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
      <Backdrop style={{ position: "absolute", zIndex: 1 }} open={showBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Home;
