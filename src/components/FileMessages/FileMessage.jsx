import { useState } from "react";

import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFile,
  FaDownload,
  FaRobot,
} from "react-icons/fa";

import "./styles.css";

const FileMessage = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(URL.createObjectURL(selectedFile));
      setFileName(selectedFile.name);
    }
  };

  const renderFileMessage = () => {
    console.log(fileName.split(".").pop());
    switch (fileName.split("/").pop()) {
      case "pdf":
        return (
          <div className="msg">
            <FaFilePdf size={24} color={"#e74c3c"} />
            <p> {fileName} </p>
            <FaDownload href={file}></FaDownload>
          </div>
        );
      case "word":
        return (
          <div className={"msg"}>
            <FaFileWord size={24} color={"#e74c3c"} />
            <p> {fileName} </p>
            <FaDownload href={file}></FaDownload>
          </div>
        );
      case "xlsx":
        return (
          <div className={"msg"}>
            <FaFileExcel size={24} color={"#e74c3c"} />
            <p> {fileName} </p>
            <FaDownload href={file}></FaDownload>
          </div>
        );
      default:
        return (
          <div className={"msg"}>
            <FaFile size={24} color={"#e74c3c"} />
            <p> {fileName} </p>
            <FaDownload href={file}></FaDownload>
          </div>
        );
    }
  };

  return (
    <div className="nav-bar">
      <FaRobot className="carbot"></FaRobot>
      <input type="file" accept="*/*" onChange={handleFileChange} />

      {file && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          {renderFileMessage()}
          <div style={{ marginTop: "10px" }}>
            <a href={file} download={fileName}>
              <button style={{ padding: "10px 20px", fontSize: "16px" }}>
                Download
              </button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileMessage;
