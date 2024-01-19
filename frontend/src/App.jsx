import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import axios from "axios";

function App() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    getPdf();
  }, []);

  const getPdf = async () => {
    try {
      const result = await axios.get("http://localhost:3000/get-files");
      console.log(result.data.data);
      setImage(result.data.data);
    } catch (error) {
      console.error("Error fetching PDF data:", error);
    }
  };

  const showPdf = (pdf) => {
    window.open(`http://localhost:3000/uploaded-files/${pdf}`, "_blank", "noreferrer");
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
  
    try {
      const result = await axios.post(
        "http://localhost:3000/upload-files",
        formData
      );
  
      setTitle("");
      setFile("");
      getPdf(); 
      window.alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error:", error.response);
    }
  };
  
  

  return (
    <div className="container">
      <form className="form-style" onSubmit={handleSubmit}>
        <h4 className="mt-2">upload pdf in here</h4>
        <input
          type="text"
          className="form-control mt-3"
          placeholder="title"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          className="form-control mt-2"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button className="btn btn-success mt-3" type="submit">
          submit
        </button>
      </form>
      <div className="uplodded">
      {image == null
  ? ""
  : image.map((data) => {
      return (
        <div className="done mt-5" key={data._id}>
          <h4> {data.title}</h4>
          <button
            className="btn btn-success"
            onClick={() => showPdf(data.pdf)}
          >
            show pdf
          </button>
        </div>
      );
    })}

      </div>
    </div>
  );
}

export default App;
