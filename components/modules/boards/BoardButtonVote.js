"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Button from "@/components/button/Button";
import SvgVote from "@/components/svg/SvgVote";
import useApiRequest from "@/hooks/useApiRequest";
import { useStyling } from "@/context/ContextStyling";

const BoardButtonVote = ({ postId, initialVotesCounter }) => {
  const { styling } = useStyling();
  const localStorageKeyName = `${process.env.NEXT_PUBLIC_APP}-hasVoted-${postId}`;

  const [hasVoted, setHasVoted] = useState(false);
  const [votesCounter, setVotesCounter] = useState(initialVotesCounter);

  const { request, loading } = useApiRequest();

  useEffect(() => {
    setHasVoted(localStorage.getItem(localStorageKeyName) === "true");
  }, [localStorageKeyName]);

  const handleVote = async (e) => {
    e.stopPropagation();

    if (loading) return;

    // Snapshot for revert
    const wasVoted = hasVoted;
    const previousVotes = votesCounter;

    // Optimistic Update
    if (wasVoted) {
      setHasVoted(false);
      setVotesCounter((prev) => prev - 1);
      localStorage.removeItem(localStorageKeyName);
    } else {
      setHasVoted(true);
      setVotesCounter((prev) => prev + 1);
      localStorage.setItem(localStorageKeyName, "true");
    }

    await request(
      () => {
        return wasVoted
          ? axios.delete(`/api/modules/boards/vote?postId=${postId}`)
          : axios.post(`/api/modules/boards/vote?postId=${postId}`);
      },
      {
        onError: () => {
          // Revert state on error
          setHasVoted(wasVoted);
          setVotesCounter(previousVotes);
          if (wasVoted) {
            localStorage.setItem(localStorageKeyName, "true");
          } else {
            localStorage.removeItem(localStorageKeyName);
          }
        },
      }
    );
  };

  return (
    <Button
      variant={hasVoted ? "btn-primary" : "btn-ghost"}
      className={`group ${styling.roundness[0]}! text-lg gap-2 ${hasVoted
        ? "border-transparent"
        : "bg-base-100 text-base-content border-base-200 hover:border-base-content/25"
        }`}
      onClick={handleVote}
      isLoading={loading}
      startIcon={<SvgVote />}
    >
      <span className="text-sm font-medium">
        {votesCounter}
      </span>
    </Button>
  );
};

export default BoardButtonVote;
