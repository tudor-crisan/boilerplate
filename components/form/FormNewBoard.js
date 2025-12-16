"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function FormNewBoard() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message) {
      toast(message, { icon: '👏' });
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isLoading) {
      return;
    }

    try {
      const response = await fetch("/api/board", {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: {
          "Content-type": "application/json"
        }
      })

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.message) {
        setMessage(data.message);
        setName("");
        return
      }

    } catch (e) {
      setError(e.message);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className="space-y-4 bg-base-100 p-8 rounded-3xl"
      onSubmit={handleSubmit}
    >
      <p className="font-bold text-lg mb-2">
        Create a new feedback board
      </p>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">
          Board name
        </legend>
        <input
          required
          type="text"
          className={`input ${error && 'input-error'}`}
          placeholder="Enter board name"
          value={name}
          onFocus={() => setError("")}
          onChange={(e) => setName(e.target.value)}
        />
        {error && (
          <p className="label text-red-600">{error}</p>
        )}
      </fieldset>
      <div className="flex">
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading && <span className="loading loading-spinner loading-xs"></span>}
          {isLoading ? 'Creating Board' : 'Create Board'}
        </button>
      </div>
      <Toaster />
    </form>
  )
}
