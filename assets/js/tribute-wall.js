import React, { useState } from "react";

export default function TributeWall() {
  const [tributes, setTributes] = useState([]);
  const [form, setForm] = useState({
    petName: "",
    message: "",
    candle: false,
    headstone: "classic",
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTribute = {
      ...form,
      photo: photoPreview,
      loveCount: 0,
    };

    setTributes([newTribute, ...tributes]);

    // reset
    setForm({
      petName: "",
      message: "",
      candle: false,
      headstone: "classic",
    });
    setPhotoPreview(null);
  };

  const sendLove = (index) => {
    const updated = [...tributes];
    updated[index].loveCount += 1;
    setTributes(updated);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "30px", fontFamily: "Arial" }}>
      <h1>🌈 Over the Rainbow Memorial Wall</h1>
      <p>
        A gentle place to honor the life, love, and memory of your beloved companion.
      </p>

      <form onSubmit={handleSubmit} style={{ marginBottom: "40px" }}>
        <input
          type="text"
          name="petName"
          placeholder="Pet's Name"
          value={form.petName}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <textarea
          name="message"
          placeholder="Write your tribute..."
          value={form.message}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <input type="file" accept="image/*" onChange={handlePhoto} />

        {photoPreview && (
          <div style={{ marginTop: "10px" }}>
            <img src={photoPreview} alt="Preview" width="200" />
          </div>
        )}

        <div style={{ marginTop: "15px" }}>
          <label>
            <input
              type="checkbox"
              name="candle"
              checked={form.candle}
              onChange={handleChange}
            />
            🕯 Light a Candle
          </label>
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Select Headstone: </label>
          <select
            name="headstone"
            value={form.headstone}
            onChange={handleChange}
          >
            <option value="classic">Classic Stone</option>
            <option value="marble">Marble</option>
            <option value="angel">Angel</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Submit Tribute
        </button>
      </form>

      <hr />

      {tributes.map((tribute, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "8px",
          }}
        >
          <h2>{tribute.petName}</h2>

          {tribute.photo && (
            <img src={tribute.photo} alt="" width="200" />
          )}

          <p style={{ marginTop: "10px" }}>{tribute.message}</p>

          {tribute.candle && <p>🕯 A candle burns in their honor</p>}

          <p>Headstone: {tribute.headstone}</p>

          <button onClick={() => sendLove(index)}>
            💖 Send Love ({tribute.loveCount})
          </button>

          <br /><br />

          <button
            onClick={() => window.location.href = "/healing-agent"}
          >
            💜 Receive Gentle Support
          </button>
        </div>
      ))}
    </div>
  );
}