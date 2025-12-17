"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function FormNewBoard() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message) {
      toast.success(message);
      setMessage("");
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError("");
    }
  }, [error]);

  const resetErrors = (input) => {
    setErrors({ ...errors, [input]: "" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isLoading) {
      return;
    }

    try {
      const { data } = await axios.post("/api/board", { name });

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.message) {
        setMessage(data.message);
        setName("");
        return
      }

    } catch (res) {
      setError(res.response.data?.error || "");
      setErrors(res.response.data?.errors || {});
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
          className={`input ${errors["name"] && 'input-error'}`}
          placeholder="Enter board name"
          value={name}
          onFocus={() => resetErrors("name")}
          onChange={(e) => setName(e.target.value)}
        />
        {errors["name"] && (
          <p className="label text-red-600">{errors["name"]}</p>
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
